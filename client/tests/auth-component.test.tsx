import { act, render, screen } from '@testing-library/react';
import LoginAuthentication from '~/components/Auth';
import ErrorModalProvider from '~/components/ErrorModal';

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
        <LoginAuthentication />
      </ErrorModalProvider>
    );
  });

  it('should render available button', () => {
    const btnSigninGoogle = screen.getByRole('button', { name: 'signin-google' });
    const btnSigninEmail = screen.getByRole('button', { name: 'signin-email' });
    const btnSigninGuest = screen.getByRole('button', { name: 'signin-guest' });

    expect(btnSigninGoogle).toBeInTheDocument();
    expect(btnSigninEmail).toBeInTheDocument();
    expect(btnSigninGuest).toBeInTheDocument();
  });

  it('should render form input name and password', async () => {
    const btnSigninEmail = screen.getByRole('button', { name: 'signin-email' });
    const btnSigninGuest = screen.getByRole('button', { name: 'signin-guest' });

    // if it interacts with an element that changes state, wrap it inside an act()
    act(() => btnSigninEmail.click());
    const inputEmail = await screen.findByRole('textbox');
    expect(inputEmail).toHaveAttribute('name', 'email');

    act(() => btnSigninGuest.click());
    const inputGuestId = await screen.findByRole('textbox');
    expect(inputGuestId).toHaveAttribute('name', 'guest');
  });
});
