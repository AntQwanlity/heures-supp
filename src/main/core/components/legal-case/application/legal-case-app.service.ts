import { Injectable } from "@nestjs/common";
import { DateTime } from "DateTime";
import { User } from "core/components/auth/domain/user";
import { Sex } from "core/components/client/domain/sex";
import { LegalCaseRepository } from "core/components/legal-case/application/legal-case.repository";
import { MagicLinkMail } from "core/components/legal-case/application/magic-link.mail";
import { LegalCase } from "core/components/legal-case/domain/legal-case";
import { WorkedDay } from "core/components/legal-case/domain/worked-day";
import { GoogleAuthClient } from "core/ports/auth/google-auth.client";
import { HttpClient } from "core/ports/http/http-client";
import { MailClient } from "core/ports/mail/mail.client";
import { PDFService } from "core/ports/pdf/pdf.service";
import { UnauthorizedError } from "core/shared-kernel/unauthorized.error";
import { randomBytes } from "crypto";
import { Readable } from "stream";

@Injectable()
export class LegalCaseAppService {
  constructor(
    private readonly legalCaseRepository: LegalCaseRepository,
    private readonly pdfService: PDFService,
    private readonly mailClient: MailClient,
    private readonly httpService: HttpClient,
    private readonly googleAuthClient: GoogleAuthClient,
  ) {}

  async getAllByUser(userId: string): Promise<LegalCase[]> {
    return this.legalCaseRepository.getAllByUser(userId);
  }

  async getLegalCase(
    user: User,
    legalCaseId: string,
    withWorkedDays?: boolean,
  ): Promise<LegalCase> {
    const legalCase = await this.legalCaseRepository.getByPk(legalCaseId, withWorkedDays);

    if (!legalCase.isAccessibleBy(user))
      throw new UnauthorizedError(
        `User ${user["id"]} is not allowed to access legal case ${legalCaseId}`,
      );

    return legalCase;
  }

  async getDailyWorkedHours(
    user: User | undefined,
    legalCaseId: string,
    magicLinkToken: string | undefined,
  ): Promise<WorkedDay[]> {
    const legalCase = await this.legalCaseRepository.getByPk(legalCaseId);

    const isMagicLinkTokenValid = magicLinkToken && magicLinkToken === legalCase["magicLinkToken"];

    if ((user && !legalCase.isAccessibleBy(user)) || (!user && !isMagicLinkTokenValid))
      throw new UnauthorizedError(
        `Cannot access legal case ${legalCaseId} with user id ${user?.["id"]} and magic link token ${magicLinkToken}`,
      );

    return legalCase.sortedWorkedDays;
  }

  async createLegalCase(user: User): Promise<LegalCase> {
    const magicLinkToken = randomBytes(48).toString("base64url");
    return await this.legalCaseRepository.create(
      LegalCase.createWithDefaults(user, magicLinkToken),
    );
  }

  async updateLegalCase(
    user: User,
    legalCaseId: string,
    firstName: string,
    lastName: string,
    email: string,
    weeklyHours: number,
    startsAt: DateTime,
    endsAt: DateTime,
    baseMonthlySalary: number,
    sex?: Sex,
  ): Promise<void> {
    const legalCase = await this.getLegalCase(user, legalCaseId);

    legalCase.updateClient(firstName, lastName, email, sex);
    legalCase.updateWeeklyHours(weeklyHours);
    legalCase.updateBaseMonthlySalary(baseMonthlySalary);
    legalCase.updateDates(startsAt, endsAt);

    await this.legalCaseRepository.update(legalCase);
  }

  async updateSalaryAmount(
    user: User,
    legalCaseId: string,
    id: string,
    amount: number,
  ): Promise<LegalCase> {
    const legalCase = await this.getLegalCase(user, legalCaseId);

    legalCase.updateSalaryAmount(id, amount);

    return this.legalCaseRepository.update(legalCase);
  }

  async generateStatementPdf(user: User, legalCaseId: string): Promise<Readable> {
    const token = await this.googleAuthClient.getToken(
      `https://puppeteer-bwsy73vqnq-ew.a.run.app?url=https://www.heures-supp.fr/app/legal-case/${legalCaseId}/pdf`,
    );
    return this.httpService.getStream(
      `https://puppeteer-bwsy73vqnq-ew.a.run.app?url=https://www.heures-supp.fr/app/legal-case/${legalCaseId}/pdf`,
      token,
    );
  }

  async updateWorkedDays(
    user: User | undefined,
    legalCaseId: string,
    magicLinkToken: string | undefined,
    workedDays: WorkedDay[],
  ): Promise<void> {
    const legalCase = await this.legalCaseRepository.getByPk(legalCaseId);

    const isMagicLinkTokenValid = magicLinkToken && magicLinkToken === legalCase["magicLinkToken"];

    if ((user && !legalCase.isAccessibleBy(user)) || (!user && !isMagicLinkTokenValid))
      throw new UnauthorizedError(
        `Cannot access legal case ${legalCaseId} with user id ${user?.["id"]} and magic link token ${magicLinkToken}`,
      );

    legalCase.updateWorkedDays(workedDays);

    await this.legalCaseRepository.update(legalCase);
  }

  async sendMagicLink(user: User, legalCaseId: string): Promise<void> {
    const legalCase = await this.getLegalCase(user, legalCaseId);

    if (!legalCase["client"]) return;

    const magicLinkToken = randomBytes(48).toString("base64url");
    legalCase.updateMagicLinkToken(magicLinkToken);

    await this.legalCaseRepository.update(legalCase);

    await this.mailClient.sendMail(new MagicLinkMail(legalCase["id"], magicLinkToken), [
      legalCase["client"]["user"]["email"],
    ]);
  }
}
