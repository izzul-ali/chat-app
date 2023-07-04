import { Request, Response } from 'express';
import { Message } from '../types/message';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MulterError } from 'multer';
import fsp from 'fs/promises';
import response from '../utils/response-api';
import prisma from '../lib/prisma';
import updload from '../lib/multer';

export async function sendMessage(req: Request, res: Response) {
  const payload: Message = req.body;

  if (payload.type !== 'TEXT') {
    return response<null>(res, 400, 'Only receive text', null);
  }

  if (!payload.senderId || !payload.receiverId || !payload.message) {
    return response<null>(res, 400, 'incomplete payload send message', null);
  }

  try {
    payload.message = payload.message.trimStart();

    const resp = await prisma.messages.create({
      data: payload,
    });

    return response<Message>(res, 200, '', resp);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return response<null>(res, 400, 'Error when send message. code: ' + error.code, null);
    }

    const err = <Error>error;
    console.log(err.stack || err.message);

    return response<null>(res, 500, 'Internal Server Error when send message', null);
  }
}

export async function getMessageId(req: Request, res: Response) {
  const { userId, contactId } = req.params;

  if (!userId || !contactId) {
    return response<null>(res, 400, 'params id is required', null);
  }

  try {
    const result = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: contactId,
          },
          {
            senderId: contactId,
            receiverId: userId,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // TODO: remove on production
    function sleep() {
      return new Promise((resolve) => setTimeout(() => resolve('send'), 2000));
    }
    await sleep();

    return response<Message[]>(res, 200, '', result);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return response<null>(res, 400, 'Error when get messages. code: ' + error.code, null);
    }

    const err = <Error>error;
    console.log(err.stack || err.message);

    return response<null>(res, 500, 'Internal Server Error when get messages', null);
  }
}

const imageUpload = updload.single('image');
export async function sendImage(req: Request, res: Response) {
  imageUpload(req, res, async (err) => {
    if (err instanceof MulterError) {
      return response<null>(res, 400, err.message, null);
    }

    if (err instanceof Error) {
      return response<null>(res, 400, err.message, null);
    }

    const payload: Message = req.body;

    if (payload.type !== 'IMAGE') {
      return response<null>(res, 400, 'Only receive image', null);
    }

    if (!payload.senderId || !payload.receiverId) {
      return response<null>(res, 400, 'Sender or receiver id is required', null);
    }

    const fileName = req.file?.originalname;

    try {
      const isSaved = (await fsp.stat(`resource/images/${fileName}`)).isFile();
      if (!isSaved) {
        return response<null>(res, 500, 'Failed to save image on server', null);
      }

      const result = await prisma.messages.create({
        data: {
          senderId: payload.senderId,
          receiverId: payload.receiverId,
          createdAt: new Date(payload.createdAt),
          type: 'IMAGE',
          urlFileOrImage: `http://localhost:8080/resource/${fileName}`,
        },
      });

      return response<Message>(res, 201, '', result);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return response<null>(res, 500, `Error when send image message, Code: ${error.code}`, null);
      }

      const errr = <Error>error;
      console.log(errr.stack || errr.message);

      return response<null>(res, 500, 'Internal server error when send image message', null);
    }
  });
}
