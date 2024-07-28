// factories/MessageFactory.ts

// Define the Message interface
export interface Message {
  content: string;
  type: string;
}

// Implement the TextMessage class
export class TextMessage implements Message {
  content: string;
  type: string = "text"; // Initialized at declaration

  constructor(content: string) {
    this.content = content;
  }
}

// Implement the ImageMessage class
export class ImageMessage implements Message {
  content: string;
  type: string = "image"; // Initialized at declaration

  constructor(content: string) {
    this.content = content;
  }
}

// Define the MessageFactory interface
export interface MessageFactory {
  createMessage(content: string): Message;
}

// Implement the TextMessageFactory class
export class TextMessageFactory implements MessageFactory {
  createMessage(content: string): Message {
    return new TextMessage(content);
  }
}

// Implement the ImageMessageFactory class
export class ImageMessageFactory implements MessageFactory {
  createMessage(content: string): Message {
    return new ImageMessage(content);
  }
}
