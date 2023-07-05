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

export async function mutateMessageCache(friendId: string, msg: Message) {
  await Promise.all([
    mutate(
      ['/contact/?id=', friendId],
      produce<Message[]>((prev) => {
        prev.push(msg);
      }),
      { revalidate: false }
    ),

    mutateContact(friendId, msg),
  ]);
}

export async function mutateContact(friendId: string, msg: Message) {
  await mutate(
    'all-contact',
    produce<AllContactMessage[]>((prev) => {
      prev.filter((u) => {
        if (u.id === friendId) {
          u.type = msg.type;
          u.urlFileOrImage = msg.urlFileOrImage;
          u.currentMessage = msg.message!;
          u.createdAt = msg.createdAt!;
          return u;
        }
      });

      // get contact order
      const cIndex: number = prev.findIndex((v) => v.id === friendId);

      // delete the contact, then move the deleted contact to first index of array
      prev.splice(0, 0, prev.splice(cIndex, 1)[0]);
    }),
    { revalidate: false }
  );
}
