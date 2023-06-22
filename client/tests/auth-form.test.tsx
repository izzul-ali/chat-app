import { render, screen } from '@testing-library/react';
import AuthForm from '~/components/form/Auth';

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
    render(<AuthForm />);
  });

  it('should render available button', () => {
    const btnSelectSignin = screen.getByRole('button', { name: 'btn-signin' });
    const btnSelectSignup = screen.getByRole('button', { name: 'btn-signup' });
    const btnShowPassword = screen.getByRole('button', { name: 'btn-show-password' });
    const btnSubmit = screen.getByRole('button', { name: 'btn-submit' });
    const btnSigninGoogle = screen.getByRole('button', { name: 'btn-signin-google' });

    expect(btnSelectSignin).toBeInTheDocument();
    expect(btnSelectSignup).toBeInTheDocument();
    expect(btnShowPassword).toBeInTheDocument();
    expect(btnSubmit).toBeInTheDocument();
    expect(btnSigninGoogle).toBeInTheDocument();
  });

  it('should render form input name and password', () => {
    const inputs = screen.getAllByRole('textbox');

    // When signin
    expect(inputs.length).toBe(1);
    expect(inputs[0]).toHaveAttribute('name', 'username');
  });
});
