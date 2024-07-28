import { Message } from "../factories/MessageFactory";

export class MessagePrototype {
  private prototype: Message;

  constructor(proto: Message) {
    this.prototype = proto;
  }

  clone(): Message {
    return Object.assign({}, this.prototype);
  }
}
