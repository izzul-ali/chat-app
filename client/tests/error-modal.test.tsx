import { render, screen } from '@testing-library/react';
import { FC, useEffect } from 'react';
import ErrorModalProvider, { useErrorModal } from '~/components/ErrorModal';

const ErrorComponent: FC = () => {
  const { setError } = useErrorModal();
  useEffect(() => {
    setError('Error Test');
  }, []);
  return <></>;
};

it('error modal test', async () => {
  render(
    <ErrorModalProvider>
      <ErrorComponent />
    </ErrorModalProvider>
  );

  const errorMesg = await screen.findByText('Error: Error Test');
  const closeBtn = await screen.findByRole('button', { name: /X/ });

  expect(errorMesg).toBeInTheDocument();
  expect(closeBtn).toBeInTheDocument();
});
