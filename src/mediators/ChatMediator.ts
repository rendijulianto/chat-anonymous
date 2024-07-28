export class ChatMediator {
  private users: Set<string> = new Set();

  addUser(user: string): void {
    this.users.add(user);
  }

  removeUser(user: string): void {
    this.users.delete(user);
  }

  sendMessage(message: string, user: string): void {
    // Logic to send message
    console.log(`Message from ${user}: ${message}`);
  }
}
