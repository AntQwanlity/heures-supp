import { Mail } from "core/ports/mail/mail.client";

export class MagicLinkMail implements Mail {
  constructor(private readonly legalCaseId: string, private readonly magicLinkToken: string) {}

  get params(): Record<string, string> {
    return { legalCaseId: this.legalCaseId, magicLinkToken: this.magicLinkToken };
  }

  get templateId(): number {
    return 1;
  }
}
