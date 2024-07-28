import { Message } from "../factories/MessageFactory";

// ChatThread.ts
export class ChatThread {
  private messages: Message[] = [];
  private users: Set<string>;

  constructor() {
    this.users = new Set();
  }

  addUser(user: string): void {
    this.users.add(user);
  }

  removeUser(user: string): void {
    this.users.delete(user);
  }

  isEmpty(): boolean {
    return this.users.size === 0;
  }

  addMessage(message: Message): void {
    this.messages.push(message);
  }

  getMessages(): Message[] {
    return this.messages;
  }
}
