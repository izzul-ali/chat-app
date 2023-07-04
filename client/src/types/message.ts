import { User } from './user';

type MessageType = 'TEXT' | 'FILE' | 'IMAGE';
type MessageStatus = 'SENT' | 'READ';

export interface Message {
  id?: number;
  senderId: string;
  receiverId: string;
  type: MessageType;
  status?: MessageStatus;
  message: string;
  urlFileOrImage?: string;
  createdAt: Date;
}

export interface AllContactMessage extends User {
  type?: MessageType;
  urlFileOrImage?: string;
  currentMessage: string;
  createdAt: Date;
}
