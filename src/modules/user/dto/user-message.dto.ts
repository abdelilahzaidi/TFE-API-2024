export interface UserMessages {
    firstName: string;
    lastName: string;
    receivedMessages: {
      receivers: { firstName: string; lastName: string }[];
    }[];
    sentMessages: {
      sender: { firstName: string; lastName: string };
    }[];
  }