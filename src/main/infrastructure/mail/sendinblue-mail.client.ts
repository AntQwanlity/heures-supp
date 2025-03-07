import { Injectable } from "@nestjs/common";
import { TransactionalEmailsApi } from "@sendinblue/client";
import { Mail, MailClient } from "core/ports/mail/mail.client";

@Injectable()
export class SendinblueMailClient implements MailClient {
  constructor(private readonly transactionalEmailsApi: TransactionalEmailsApi) {}

  async sendMail(mail: Mail, recipients: string[]): Promise<void> {
    await this.transactionalEmailsApi.sendTransacEmail({
      templateId: mail.templateId,
      to: recipients.map((recipient) => ({ email: recipient })),
      params: mail.params,
    });
  }
}
