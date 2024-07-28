import { Message } from "../factories/MessageFactory";

// MessageBuilder.ts
export class MessageBuilder {
  private content: string = "";
  private type: string = "text"; // default type
  private timestamp: Date = new Date();
  private author: string = "anonymous";

  setContent(content: string): MessageBuilder {
    this.content = content;
    return this;
  }

  setType(type: string): MessageBuilder {
    this.type = type;
    return this;
  }

  setTimestamp(timestamp: Date): MessageBuilder {
    this.timestamp = timestamp;
    return this;
  }

  setAuthor(author: string): MessageBuilder {
    this.author = author;
    return this;
  }

  build(): Message {
    return { content: this.content, type: this.type };
  }
}
