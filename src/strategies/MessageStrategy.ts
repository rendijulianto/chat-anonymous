import { Message } from "../factories/MessageFactory";

// MessageStrategy.ts
interface SendMessageStrategy {
  send(message: Message): void;
}

export class DirectSendMessageStrategy implements SendMessageStrategy {
  send(message: Message): void {
    console.log(`Sending message directly: ${message.content}`);
  }
}
