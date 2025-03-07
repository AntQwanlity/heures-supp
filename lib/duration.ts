import dayjs, { Dayjs } from "dayjs";
import duration, { Duration as DayjsDuration } from "dayjs/plugin/duration";

dayjs.extend(duration);

export class Duration {
  constructor(private dayjsDuration: DayjsDuration) {}

  get hours(): number {
    return this.dayjsDuration.asHours();
  }

  get days(): number {
    return this.dayjsDuration.asDays();
  }

  plus(duration: Duration): Duration {
    return new Duration(this.dayjsDuration.add(duration.dayjsDuration));
  }

  minus(duration: Duration): Duration {
    return new Duration(this.dayjsDuration.subtract(duration.dayjsDuration));
  }

  formatDays(): string {
    return this.dayjsDuration.format("D [j]");
  }

  formatHoursMinutes(): string {
    const numHours = this.dayjsDuration.asHours();
    const numHoursString = new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numHours);

    let str = `${numHoursString} h`;

    if (numHoursString !== Math.floor(numHours).toString())
      str += ` (${Math.floor(numHours)} h ${this.dayjsDuration.format("mm")})`;

    return str;
  }

  static fromZero(): Duration {
    return new Duration(dayjs.duration(0));
  }

  static fromMs(ms: number): Duration {
    return new Duration(dayjs.duration(ms, "milliseconds"));
  }

  static fromHours(hours: number): Duration {
    return Duration.fromMs(Math.round(hours * 60 * 60 * 1000));
  }

  static fromDays(days: number): Duration {
    return new Duration(dayjs.duration(days, "days"));
  }
}
