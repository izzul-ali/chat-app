import { Request, Response } from 'express';
import { AllContactMessage, MessageType } from '../types/message';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import response from '../utils/response-api';
import prisma from '../lib/prisma';

type CurrentMessage = {
  type?: MessageType;
  urlFileOrImage?: string;
  message?: string;
  createdAt?: Date;
};

export async function getAllUsers(req: Request, res: Response) {
  const userId = req.params.userId;

  if (!userId) {
    return response<null>(res, 400, 'URL Params is required', null);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return response<null>(res, 401, 'User not found, should logout session', null);
    }

    const result = await prisma.user.findMany({
      where: { id: { not: userId } },
      include: {
        senderId: {
          where: { OR: [{ senderId: userId }, { receiverId: userId }] },
          select: { type: true, urlFileOrImage: true, message: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        receiverId: {
          where: { OR: [{ senderId: userId }, { receiverId: userId }] },
          select: { type: true, urlFileOrImage: true, message: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const data: AllContactMessage[] = result.map((v) => {
      const currSenderMessage = v.senderId[0] || null;
      const currReceiverMessage = v.receiverId[0] || null;

      // if both sender and receiver has been send message
      let currMessage: CurrentMessage | null = null;
      if (currSenderMessage && currReceiverMessage) {
        if (currSenderMessage.createdAt.getTime() < currReceiverMessage.createdAt.getTime()) {
          currMessage = currReceiverMessage;
        } else {
          currMessage = currSenderMessage;
        }
      }

      return {
        id: v.id,
        email: v.email,
        image: v.image,
        name: v.name,
        provider: v.provider,
        type: currMessage?.type || currSenderMessage?.type || currReceiverMessage?.type,
        urlFileOrImage:
          currMessage?.urlFileOrImage || currSenderMessage?.urlFileOrImage || currReceiverMessage?.urlFileOrImage,
        currentMessage: currMessage?.message || currSenderMessage?.message || currReceiverMessage?.message,
        createdAt: currMessage?.createdAt || currSenderMessage?.createdAt || currReceiverMessage?.createdAt,
      };
    });

    const sortByCreatedMessageTime = data.sort((a, b) =>
      a.createdAt && b.createdAt ? b.createdAt?.getTime() - a.createdAt?.getTime() : 0
    );

    return response<AllContactMessage[]>(res, 200, '', sortByCreatedMessageTime);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return response<null>(res, 200, `error with status code: ${error.code}`, null);
    }

    const err = <Error>error;
    console.log(err.stack || err.message);

    return response<null>(res, 200, 'Internal server error when get all users', null);
  }
}
