type Currency = "EUR" | "USD";
type CurrencyLocale = "fr-FR" | "en-US";

type MoneyFormat = "Text" | "Input";

export class Money {
  constructor(
    readonly cents: number,
    private readonly currency: Currency,
    private readonly currencyLocale: CurrencyLocale,
  ) {}

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  format(format: MoneyFormat = "Text"): string {
    return new Intl.NumberFormat(this.currencyLocale, {
      style: format === "Text" ? "currency" : "decimal",
      useGrouping: format === "Text",
      currency: this.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(this.toUnit());
  }

  toUnit(): number {
    return this.cents / 100;
  }

  static fromCents(
    cents: number,
    currency: Currency = "EUR",
    locale: CurrencyLocale = "fr-FR",
  ): Money {
    return new Money(cents, currency, locale);
  }

  static fromUnit(
    units: number,
    currency: Currency = "EUR",
    locale: CurrencyLocale = "fr-FR",
  ): Money {
    return Money.fromCents(Math.round(units * 100), currency, locale);
  }

  static fromInputString(
    str: string,
    currency: Currency = "EUR",
    locale: CurrencyLocale = "fr-FR",
  ) {
    return Money.fromCents(
      Math.round(+str.replace(/\s/g, "").replace(",", ".") * 100),
      currency,
      locale,
    );
  }
}
