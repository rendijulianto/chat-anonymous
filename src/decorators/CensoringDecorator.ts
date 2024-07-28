import { Message } from "../factories/MessageFactory";

export class CensoringDecorator implements Message {
  private message: Message;
  private badWords: string[] = [
    "goblok",
    "tolol",
    "brengsek",
    "kampret",
    "keparat",
    "monyet",
    "sialan",
    "perek",
    "bencong",
    "banci",
  ];

  constructor(message: Message) {
    this.message = message;
  }

  get content(): string {
    return this.censor(this.message.content);
  }

  get type(): string {
    return this.message.type;
  }

  private censor(content: string): string {
    // Create a regex pattern for each bad word
    const regexPattern = new RegExp(this.badWords.join("|"), "gi");

    // Replace the matched bad words with asterisks
    return content.replace(regexPattern, (match) => "*".repeat(match.length));
  }
}
