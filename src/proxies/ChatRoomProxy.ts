// ChatRoomProxy.ts
interface ChatRoom {
  join(user: string): void;
  leave(user: string): void;
}

export class RealChatRoom implements ChatRoom {
  private users: Set<string> = new Set();

  join(user: string): void {
    this.users.add(user);
    console.log(`${user} joined the room`);
  }

  leave(user: string): void {
    this.users.delete(user);
    console.log(`${user} left the room`);
  }
}

export class ChatRoomProxy implements ChatRoom {
  private realChatRoom: RealChatRoom;

  constructor(realChatRoom: RealChatRoom) {
    this.realChatRoom = realChatRoom;
  }

  join(user: string): void {
    this.realChatRoom.join(user);
  }

  leave(user: string): void {
    this.realChatRoom.leave(user);
  }
}
