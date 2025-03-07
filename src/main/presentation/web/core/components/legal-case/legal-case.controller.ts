import { Body, Controller, Get, Header, Param, Post, Query, StreamableFile } from "@nestjs/common";
import { DateTime } from "DateTime";
import { IsArray, IsDateString, IsIn, IsInt, IsOptional, ValidateNested } from "class-validator";
import { User } from "core/components/auth/domain/user";
import { Sex, Sexes } from "core/components/client/domain/sex";
import { LegalCaseAppService } from "core/components/legal-case/application/legal-case-app.service";
import { WorkedDay } from "core/components/legal-case/domain/worked-day";
import { LegalCaseConcealedWorkView } from "presentation/web/core/components/compensation/legal-case-concealed-work.view";
import { LegalCaseHoursRecallView } from "presentation/web/core/components/compensation/legal-case-hours-recall.view";
import { LegalCaseMandatoryRestingView } from "presentation/web/core/components/compensation/legal-case-mandatory-resting.view";
import { LegalCaseSalariesPeriodsView } from "presentation/web/core/components/legal-case/legal-case-salaries-periods.view";
import { LegalCaseView } from "presentation/web/core/components/legal-case/legal-case.view";
import { DailyWorkedHoursView } from "presentation/web/core/components/worked-hours/daily-worked-hours.view";
import { WeeklyWorkedHoursView } from "presentation/web/core/components/worked-hours/weekly-worked-hours.view";
import { YearlyWorkedHoursView } from "presentation/web/core/components/worked-hours/yearly-worked-hours.view";
import { Public } from "presentation/web/infrastructure/nest/auth-api.guard";
import { CurrentUser } from "presentation/web/infrastructure/nest/current-user.decorator";

export class UpdateSalaryDto {
  id!: string;

  @IsInt()
  amount!: number;
}

export class UpdateWorkedDayDto {
  id!: string;

  @IsDateString()
  morningStartsAt!: string;

  @IsDateString()
  morningEndsAt!: string;

  @IsDateString()
  afternoonStartsAt!: string;

  @IsDateString()
  afternoonEndsAt!: string;
}

export class UpdateWorkedDaysDto {
  @IsArray()
  @ValidateNested({ each: true })
  workedDays!: UpdateWorkedDayDto[];
}

export class UpdateLegalCaseDto {
  id!: string;

  @IsOptional()
  @IsIn(Sexes)
  sex!: string;

  firstName!: string;

  lastName!: string;

  email!: string;

  @IsInt()
  weeklyHours!: number;

  @IsInt()
  baseMonthlySalary!: number;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;
}

@Controller()
export class LegalCaseController {
  constructor(private readonly legalCaseAppService: LegalCaseAppService) {}

  @Get("legal-cases")
  async getLegalCases(@CurrentUser() user: User): Promise<LegalCaseView[]> {
    const legalCases = await this.legalCaseAppService.getAllByUser(user["id"]);

    return legalCases.map((legalCase) => LegalCaseView.fromDomain(legalCase));
  }

  @Post("legal-case/create")
  async createLegalCase(@CurrentUser() user: User): Promise<string> {
    const legalCase = await this.legalCaseAppService.createLegalCase(user);
    return legalCase["id"];
  }

  @Post("legal-case/:legalCaseId")
  async updateLegalCase(
    @CurrentUser() user: User,
    @Body() input: UpdateLegalCaseDto,
  ): Promise<void> {
    await this.legalCaseAppService.updateLegalCase(
      user,
      input.id,
      input.firstName,
      input.lastName,
      input.email,
      input.weeklyHours,
      DateTime.fromIsoFormattedString(input.startsAt),
      DateTime.fromIsoFormattedString(input.endsAt),
      input.baseMonthlySalary,
      input.sex as Sex,
    );
  }

  @Get("legal-case/:legalCaseId")
  async getLegalCase(
    @CurrentUser() user: User,
    @Param("legalCaseId") legalCaseId: string,
  ): Promise<LegalCaseView> {
    const legalCase = await this.legalCaseAppService.getLegalCase(user, legalCaseId, false);

    return LegalCaseView.fromDomain(legalCase);
  }

  @Get("legal-case/:legalCaseId/salaries-periods")
  async getLegalCaseSalariesPeriods(
    @CurrentUser() user: User,
    @Param("legalCaseId") legalCaseId: string,
  ): Promise<LegalCaseSalariesPeriodsView> {
    const legalCase = await this.legalCaseAppService.getLegalCase(user, legalCaseId, false);

    return LegalCaseSalariesPeriodsView.create(legalCase);
  }

  @Get("legal-case/:legalCaseId/hours-recall")
  async getLegalCaseHoursRecall(
    @CurrentUser() user: User,
    @Param("legalCaseId") legalCaseId: string,
  ): Promise<LegalCaseHoursRecallView> {
    const legalCase = await this.legalCaseAppService.getLegalCase(user, legalCaseId);

    return LegalCaseHoursRecallView.create(legalCase);
  }

  @Get("legal-case/:legalCaseId/mandatory-resting")
  async getLegalCaseMandatoryResting(
    @CurrentUser() user: User,
    @Param("legalCaseId") legalCaseId: string,
  ): Promise<LegalCaseMandatoryRestingView> {
    const legalCase = await this.legalCaseAppService.getLegalCase(user, legalCaseId);

    return LegalCaseMandatoryRestingView.create(legalCase);
  }

  @Get("legal-case/:legalCaseId/concealed-work")
  async getLegalCaseConcealedWork(
    @CurrentUser() user: User,
    @Param("legalCaseId") legalCaseId: string,
  ): Promise<LegalCaseConcealedWorkView> {
    const legalCase = await this.legalCaseAppService.getLegalCase(user, legalCaseId);

    return LegalCaseConcealedWorkView.create(legalCase);
  }

  @Public()
  @Get("legal-case/:legalCaseId/daily-worked-hours")
  async getDailyWorkedHours(
    @CurrentUser() user: User | undefined,
    @Param("legalCaseId") legalCaseId: string,
    @Query("token") token: string | undefined,
  ): Promise<DailyWorkedHoursView> {
    const sortedWorkedHours = await this.legalCaseAppService.getDailyWorkedHours(
      user,
      legalCaseId,
      token,
    );

    return DailyWorkedHoursView.create(sortedWorkedHours);
  }

  @Get("legal-case/:legalCaseId/weekly-worked-hours")
  async getWeeklyWorkedHours(
    @CurrentUser() user: User,
    @Param("legalCaseId") legalCaseId: string,
  ): Promise<WeeklyWorkedHoursView> {
    const legalCase = await this.legalCaseAppService.getLegalCase(user, legalCaseId);

    return WeeklyWorkedHoursView.create(legalCase);
  }

  @Get("legal-case/:legalCaseId/yearly-worked-hours")
  async getYearlyWorkedHours(
    @CurrentUser() user: User,
    @Param("legalCaseId") legalCaseId: string,
  ): Promise<YearlyWorkedHoursView> {
    const legalCase = await this.legalCaseAppService.getLegalCase(user, legalCaseId);

    return YearlyWorkedHoursView.create(legalCase);
  }

  @Post("legal-case/:legalCaseId/salaries/update")
  async updateSalary(
    @CurrentUser() user: User,
    @Param("legalCaseId") legalCaseId: string,
    @Body() input: UpdateSalaryDto,
  ): Promise<LegalCaseSalariesPeriodsView> {
    const legalCase = await this.legalCaseAppService.updateSalaryAmount(
      user,
      legalCaseId,
      input.id,
      input.amount,
    );

    return LegalCaseSalariesPeriodsView.create(legalCase);
  }

  @Public()
  @Post("legal-case/:legalCaseId/worked-days/update")
  async updateWorkedDay(
    @CurrentUser() user: User | undefined,
    @Param("legalCaseId") legalCaseId: string,
    @Query("token") token: string | undefined,
    @Body() input: UpdateWorkedDaysDto,
  ): Promise<void> {
    return this.legalCaseAppService.updateWorkedDays(
      user,
      legalCaseId,
      token,
      input.workedDays.map(
        (wd) =>
          new WorkedDay(
            wd.id,
            legalCaseId,
            DateTime.fromIsoFormattedString(wd.morningStartsAt),
            DateTime.fromIsoFormattedString(wd.morningEndsAt),
            DateTime.fromIsoFormattedString(wd.afternoonStartsAt),
            DateTime.fromIsoFormattedString(wd.afternoonEndsAt),
          ),
      ),
    );
  }

  @Get("legal-case/:legalCaseId/download-statement")
  @Header("Content-Type", "application/pdf")
  @Header("Content-Disposition", "attachment; filename=decompte-heures.pdf")
  async getPdf(
    @CurrentUser() user: User,
    @Param("legalCaseId") legalCaseId: string,
  ): Promise<StreamableFile> {
    const stream = await this.legalCaseAppService.generateStatementPdf(user, legalCaseId);
    return new StreamableFile(stream);
  }

  /*
  @Post("legal-case/:legalCaseId/work-hours")
  @UseInterceptors(FileInterceptor("file"))
  async uploadWorkHours(
    @Param("legalCaseId") legalCaseId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: "xls",
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    Logger.log(`File : ${file.buffer.toString()}`);
  }*/

  @Post("legal-case/:legalCaseId/send-magic-link")
  async sendMagicLink(
    @CurrentUser() user: User,
    @Param("legalCaseId") legalCaseId: string,
  ): Promise<void> {
    return this.legalCaseAppService.sendMagicLink(user, legalCaseId);
  }
}
