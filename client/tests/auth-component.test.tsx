import { act, render, screen } from '@testing-library/react';
import LoginAuthentication from '~/components/Auth';
import ErrorModalProvider from '~/components/ErrorModal';
import CurrentUserContextProvider from '~/hooks/useUser';

// by default jest not support to render package next/navigation
// https://github.com/scottrippey/next-router-mock/issues/67#issuecomment-1561164934
jest.mock('next/router', () => () => import('next-router-mock'));
jest.mock('next/navigation', () => ({
  ...require('next-router-mock'),
  useSearchParams: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const router = require('next-router-mock').useRouter();
    const path = router.asPath.split('?')?.[1] ?? '';
    return new URLSearchParams(path);
  },
}));

describe('authentication form', () => {
  beforeEach(() => {
    render(
      <ErrorModalProvider>
        <CurrentUserContextProvider>
          <LoginAuthentication isAuthenticate={false} />
        </CurrentUserContextProvider>
      </ErrorModalProvider>
    );
  });

  it('should render available button', () => {
    const btnSigninGoogle = screen.getByRole('button', { name: 'signin-google' });
    const inputEmail = screen.getByRole('textbox');
    const btnSigninEmail = screen.getByRole('button', { name: 'signin-email' });

    expect(btnSigninGoogle).toBeInTheDocument();
    expect(inputEmail).toHaveAttribute('name', 'email');
    expect(btnSigninEmail).toBeInTheDocument();
  });

  it('should render form input name and password', async () => {
    const btnSigninEmail = screen.getByRole('button', { name: 'signin-email' });

    // if it interacts with an element that changes state, wrap it inside an act()
    act(() => btnSigninEmail.click());
    const errorText = await screen.findByText('Please enter an email address for login');
    expect(errorText).toBeInTheDocument();
  });
});
