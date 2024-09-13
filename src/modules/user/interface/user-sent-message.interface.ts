// sent-messages.dto.ts
export interface SentMessages {
    sender: {
      firstName: string;
      lastName: string;
    };
    sentMessages: {
      id: number;
      titre: string;
      content: string;
      dateHeureEnvoie: Date;
      receivers: {
        firstName: string;
        lastName: string;
      }[];
    }[];
  }
  