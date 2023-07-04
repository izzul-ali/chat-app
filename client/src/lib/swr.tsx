'use client';

import { AxiosError } from 'axios';
import { SWRConfig } from 'swr';
import { useErrorModal } from '~/components/ErrorModal';
import { ResponseApi } from '~/types/api';

export default function SwrConfigProvider({ children }: { children: React.ReactNode }) {
  const { setError } = useErrorModal();
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateIfStale: false,
        errorRetryCount: 5,
        onError(err: AxiosError) {
          const errData = err.response?.data as ResponseApi<null>;

          // set to global error
          setError(errData?.error || err.message);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
