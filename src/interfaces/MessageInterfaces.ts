export interface IMessage {
  content: string;
  type: string;
  author: string;
  timestamp: Date;
}

export interface ITextMessage extends IMessage {
  type: "text";
}

export interface IImageMessage extends IMessage {
  type: "image";
}
