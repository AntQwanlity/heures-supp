import { Duration } from "Duration";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);
dayjs.extend(weekday);
dayjs.updateLocale("fr", {
  relativeTime: {
    future: "dans %s",
    past: "il y a %s",
    s: "quelques secondes",
    m: "une minute",
    mm: "%d minutes",
    h: "une heure",
    hh: "%d heures",
    d: "un jour",
    dd: "%d jours",
    M: "un mois",
    MM: "%d mois",
    y: "un an",
    yy: "%d ans",
  },
});

type DateTimeFormat = "MonthYear" | "Date" | "DateTime" | "Time" | "Ago" | "Iso8601";

export const DateTimeFormats: Record<DateTimeFormat, string> = {
  MonthYear: "MMMM YYYY",
  Date: "L",
  DateTime: "L LT",
  Time: "LT",
  Ago: "",
  Iso8601: "YYYY-MM-DDTHH:mm:ssZ",
};

/**
 * Warning : the "tz" plugin behaves weirdly when using the UTC timezone.
 * Using Dayjs UTC mode is recommended instead, if needed.
 * eg : don't do .tz("UTC"), do .utc()
 */
export class DateTime {
  constructor(private readonly dayjsDateTime: Dayjs, private readonly tz: string) {}

  getDay(): number {
    return this.dayjsDateTime.tz(this.tz).date();
  }

  getMonth(): number {
    return this.dayjsDateTime.tz(this.tz).month();
  }

  getYear(): number {
    return this.dayjsDateTime.tz(this.tz).year();
  }

  isAfter(other: DateTime): boolean {
    return this.dayjsDateTime.isAfter(other.dayjsDateTime);
  }

  isBefore(other: DateTime): boolean {
    return this.dayjsDateTime.isBefore(other.dayjsDateTime);
  }

  isBetween(startDate: DateTime, endDate: DateTime): boolean {
    return this.dayjsDateTime.isBetween(startDate.dayjsDateTime, endDate.dayjsDateTime);
  }

  isWeekDay(): boolean {
    return ![0, 6].includes(this.dayjsDateTime.tz(this.tz).day());
  }

  equals(other: DateTime): boolean {
    return this.dayjsDateTime.isSame(other.dayjsDateTime);
  }

  getNativeDate(): Date {
    return this.dayjsDateTime.toDate();
  }

  formatTemplate(template: string): string {
    return this.dayjsDateTime.tz(this.tz).locale("fr").format(template);
  }

  format(format: DateTimeFormat): string {
    if (format === "Iso8601")
      return this.dayjsDateTime.tz(this.tz).locale("fr").format(DateTimeFormats["Iso8601"]);
    return format === "Ago"
      ? this.dayjsDateTime.tz(this.tz).locale("fr").fromNow()
      : this.formatTemplate(DateTimeFormats[format]);
  }

  atHour(hour: number): DateTime {
    return new DateTime(this.dayjsDateTime.tz(this.tz).hour(hour), this.tz);
  }

  atHourMinutes(hour: number, minutes: number): DateTime {
    return new DateTime(this.dayjsDateTime.tz(this.tz).hour(hour).minute(minutes), this.tz);
  }

  atMonth(month: number): DateTime {
    return new DateTime(this.dayjsDateTime.tz(this.tz).month(month), this.tz);
  }

  atStartOfDay(): DateTime {
    return new DateTime(this.dayjsDateTime.tz(this.tz).locale("fr").startOf("day"), this.tz);
  }

  atEndOfDay(): DateTime {
    return new DateTime(this.dayjsDateTime.tz(this.tz).locale("fr").endOf("day"), this.tz);
  }

  atStartOfWeek(): DateTime {
    return new DateTime(
      this.dayjsDateTime.tz(this.tz).locale("fr").weekday(0).startOf("day"),
      this.tz,
    );
  }

  atEndOfWeek(): DateTime {
    return new DateTime(
      this.dayjsDateTime.tz(this.tz).locale("fr").weekday(6).endOf("day"),
      this.tz,
    );
  }

  atStartOfMonth(): DateTime {
    return new DateTime(this.dayjsDateTime.tz(this.tz).locale("fr").startOf("month"), this.tz);
  }

  atEndOfMonth(): DateTime {
    return new DateTime(this.dayjsDateTime.tz(this.tz).locale("fr").endOf("month"), this.tz);
  }

  atStartOfYear(): DateTime {
    return new DateTime(this.dayjsDateTime.tz(this.tz).locale("fr").startOf("year"), this.tz);
  }

  atEndOfYear(): DateTime {
    return new DateTime(this.dayjsDateTime.tz(this.tz).locale("fr").endOf("year"), this.tz);
  }

  plusMinutes(minutes: number): DateTime {
    return new DateTime(this.dayjsDateTime.add(minutes, "minutes"), this.tz);
  }

  plusHours(hours: number): DateTime {
    return new DateTime(this.dayjsDateTime.add(hours, "hours"), this.tz);
  }

  plusDays(days: number): DateTime {
    return new DateTime(this.dayjsDateTime.add(days, "days"), this.tz);
  }

  plusMonths(months: number): DateTime {
    return new DateTime(this.dayjsDateTime.add(months, "months"), this.tz);
  }

  getMinutesDiffFloat(now: DateTime): number {
    return this.dayjsDateTime.diff(now.dayjsDateTime, "minutes", true);
  }

  getDiff(now: DateTime): Duration {
    return Duration.fromMs(this.dayjsDateTime.diff(now.dayjsDateTime, "milliseconds"));
  }

  getMonthsDiffFloat(now: DateTime): number {
    return this.dayjsDateTime.diff(now.dayjsDateTime, "months", true);
  }

  static fromDate(date: Date, tz?: string): DateTime {
    return new DateTime(dayjs(date).locale("fr"), tz || "Europe/Paris");
  }

  static fromDateTime(dateTime: DateTime): DateTime {
    return new DateTime(dayjs(dateTime.dayjsDateTime), dateTime.tz);
  }

  static fromFormattedString(str: string, format: string, tz?: string): DateTime {
    // DayJS doesn't throw if the string is not formatted correctly
    const dayjsDateTime = dayjs(str, format, "fr", false).locale("fr");

    if (!dayjsDateTime.isValid())
      throw new Error(
        `Invalid date : ${str}. Either the format is invalid or the date doesn't exist. Expected format : ${format}`,
      );

    return new DateTime(dayjsDateTime, tz || "Europe/Paris");
  }

  static fromIsoFormattedString(str: string, tz?: string): DateTime {
    return DateTime.fromFormattedString(str, DateTimeFormats["Iso8601"], tz);
  }

  static compare(a: DateTime, b: DateTime) {
    return a.isBefore(b) ? -1 : 1;
  }
}
