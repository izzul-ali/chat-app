import { ResponseApi } from '~/types/api';
import { AllContactMessage, Message } from '~/types/message';
import { produce } from 'immer';
import useSWR, { mutate } from 'swr';
import axiosInstance from '~/lib/axios';

export default function useMessage(userId: string, friendId: string) {
  const { data, isLoading } = useSWR(
    ['/contact/?id=', friendId],
    async () => (await axiosInstance.get<ResponseApi<Message[]>>(`/messages/${userId}/${friendId}/all`)).data.data,
    {
      keepPreviousData: true,
    }
  );

  return { data, isLoading };
}

export async function mutateMessageCache(friendId: string, newMessage: Message) {
  await Promise.all([
    mutate(
      ['/contact/?id=', friendId],
      produce<Message[]>((prev) => {
        prev.push(newMessage);
      }),
      { revalidate: false }
    ),

    mutate(
      'all-contact',
      produce<AllContactMessage[]>((prev) => {
        prev.filter((u) => {
          if (u.id === friendId) {
            u.type = newMessage.type;
            u.urlFileOrImage = newMessage.urlFileOrImage;
            u.currentMessage = newMessage.message!;
            u.createdAt = newMessage.createdAt!;
            return u;
          }
        });
      }),
      { revalidate: false }
    ),
  ]);
}
