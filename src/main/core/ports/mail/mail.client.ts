export interface Mail {
  get templateId(): number;
  get params(): Record<string, string>;
}

export abstract class MailClient {
  abstract sendMail(mail: Mail, recipients: string[]): Promise<void>;
}
