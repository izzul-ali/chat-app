import { render, screen } from '@testing-library/react';
import ErrorModal from '~/components/ErrorModal';

it('error modal test', () => {
  render(<ErrorModal message="message" clear={() => ''} />);

  const closeBtn = screen.getByRole('button', { name: /X/ });

  expect(closeBtn).toBeInTheDocument();
  expect(screen.getByText(/Error: message/)).toBeInTheDocument();
});
