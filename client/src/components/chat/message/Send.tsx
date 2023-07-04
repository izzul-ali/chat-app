'use client';

import { FaMicrophone } from 'react-icons/fa';
import { BsImage } from 'react-icons/bs';
import { RiAttachment2, RiSendPlaneFill } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';
import { useChat } from '~/hooks/useChat';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Message } from '~/types/message';
import { ResponseApi } from '~/types/api';
import { AxiosError } from 'axios';
import { useErrorModal } from '~/components/ErrorModal';
import { useCurrentUser } from '~/hooks/useUser';
import { AnimatePresence, motion } from 'framer-motion';
import { SessionUser } from '~/types/user';
import { mutateMessageCache } from '~/hooks/useMessage';
import axiosInstance from '~/lib/axios';
import socket from '~/lib/socket';
import Image from 'next/image';

export default function SendMessage({ user, userId }: { user: SessionUser; userId: string }) {
  const { currentUser } = useCurrentUser();
  const { friend } = useChat();
  const { setError } = useErrorModal();

  const message = useRef<HTMLTextAreaElement | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const imageInput = useRef<HTMLInputElement | null>(null);

  const [previewImage, setPreviewImage] = useState<File>();

  useEffect(() => {
    setPreviewImage(undefined);
  }, [friend?.id]);

  function handleShowInputImage() {
    imageInput.current?.click();
  }

  function handleShowInputFile() {
    fileInput.current?.click();
  }

  async function handlePreviewImage(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setPreviewImage(e.target.files[0]);
  }

  async function handleSendImage() {
    const form = new FormData();

    if (!previewImage) return;

    if (!friend?.id) {
      setError('Contact id not define');
      return;
    }

    form.append('image', previewImage);
    form.append('senderId', currentUser?.id || userId);
    form.append('receiverId', friend.id);
    form.append('createdAt', new Date().toString());
    form.append('type', 'IMAGE');

    try {
      const resp = await axiosInstance.post('/messages/image', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newMessage = (resp.data as ResponseApi<Message>).data;

      await mutateMessageCache(friend.id, newMessage);

      socket.emit('send-message', newMessage);
      setPreviewImage(undefined);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.error || error.message);
        return;
      }

      setError('Failed to send image');
    }
  }

  // TODO: handle send file

  async function handleSendMessage() {
    if (!message.current || !message.current.value) {
      return;
    }

    if (!friend?.id) {
      setError('Contact id not define');
      return;
    }

    const payload: Message = {
      senderId: currentUser?.id || user?.id || userId,
      receiverId: friend.id,
      message: message.current.value,
      createdAt: new Date(),
      type: 'TEXT',
    };
    try {
      const resp = await axiosInstance.post('/messages', payload);
      const newMessage = (resp.data as ResponseApi<Message>).data;

      await mutateMessageCache(friend.id, newMessage);

      socket.emit('send-message', newMessage);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.error || error.message);
        return;
      }

      setError((error as Error).message);
    }

    message.current!.value = '';
  }

  return (
    <>
      <AnimatePresence>
        {previewImage && (
          <motion.div
            key="preview-box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, delayChildren: 0.3 }}
            className="absolute w-full h-full bg-gray-200/80 dark:bg-gray-950/80 flex flex-col justify-end items-center pb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-fit"
            >
              <button
                onClick={() => setPreviewImage(undefined)}
                className="text-lg p-3 block w-fit mx-auto mb-5 rounded-full bg-gray-700/40 text-white"
              >
                <IoClose />
              </button>
              <Image
                alt={previewImage.name}
                src={URL.createObjectURL(previewImage)}
                width={100}
                height={100}
                className="w-fit rounded-md max-w-[80%] h-fit mx-auto"
              />
            </motion.div>

            <button
              onClick={async () => await handleSendImage()}
              className="mt-10 bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-sm px-5 py-1 rounded text-white inline-flex items-center gap-x-2"
            >
              Send
              <RiSendPlaneFill />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-fit pb-4 pt-2 px-3 bg-send dark:bg-gray-950">
        <div className="p-2 bg-input-message dark:bg-gray-900 rounded-lg flex text-gray-600 items-center gap-x-2">
          <button type="button" className="hover:bg-gray-100 dark:hover:bg-gray-950 p-1 rounded">
            <FaMicrophone className="text-base" />
          </button>
          <textarea
            ref={message}
            autoCorrect="off"
            defaultValue={message.current?.value}
            name="message"
            cols={30}
            rows={1}
            placeholder="send message"
            className="placeholder:text-xs placeholder:pt-1 overflow-hidden resize-none outline-none text-sm bg-transparent text-gray-800 dark:text-gray-200 flex-grow pr-5 py-1"
          ></textarea>

          <div className="flex items-center gap-x-3 text-base">
            <button
              onClick={() => handleShowInputImage()}
              type="button"
              className="hover:bg-gray-100 dark:hover:bg-gray-950 p-1 rounded"
            >
              <BsImage className="text-gray-600 dark:text-gray-500" />
              <input
                ref={imageInput}
                onChange={handlePreviewImage}
                type="file"
                name="image"
                id="image"
                accept="image/png, image/gif, image/jpeg, image/jpg, image/ico, image/svg"
                className="sr-only"
              />
            </button>
            <button
              onClick={() => handleShowInputFile()}
              type="button"
              className="hover:bg-gray-100 dark:hover:bg-gray-950 p-1 rounded"
            >
              <RiAttachment2 className="text-gray-700 dark:text-gray-500 text-lg" />
              <input
                ref={fileInput}
                // onChange={handlePreviewFile}
                type="file"
                name="file"
                id="file"
                accept="text/plain"
                className="sr-only"
              />
            </button>
            <button
              onClick={() => handleSendMessage()}
              type="button"
              className="p-1 text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-950 rounded"
            >
              <RiSendPlaneFill />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
