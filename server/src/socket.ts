import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Message } from './types/message';

type OnlineUser = {
  socketId: string;
  userId: string;
};

class SocketController {
  private onlineUsers: OnlineUser[] = [];
  private socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null = null;

  constructor(public io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {}

  public run() {
    this.io.on('connection', (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
      this.onSocketConnection = socket;

      this.onOnlineUser();
      this.onSendMessage();

      socket.on('disconnect', () => {
        this.onlineUsers = this.onlineUsers.filter((u) => u.socketId !== socket.id);

        // send to all users
        this.io.emit(
          'offline-users',
          this.onlineUsers.map((u) => u.userId)
        );
      });
    });
  }

  set onSocketConnection(socketConnection: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    this.socket = socketConnection;
  }

  private onOnlineUser() {
    this.socket?.on('user-online', (userId: string) => {
      if (this.onlineUsers.some((u) => u.userId === userId)) return;
      this.onlineUsers.push({ userId: userId, socketId: this.socket!.id });

      // send to all users
      this.io.emit(
        'online-users',
        this.onlineUsers.map((u) => u.userId)
      );
    });
  }

  private onSendMessage() {
    this.socket?.on('send-message', (msg: Message) => {
      const receiver = this.onlineUsers.find((u) => u.userId === msg.receiverId);

      // only send realtime message to online users
      if (!receiver) return;

      this.io.to(receiver.socketId).emit('new-message', msg);
    });
  }
}

export default SocketController;
