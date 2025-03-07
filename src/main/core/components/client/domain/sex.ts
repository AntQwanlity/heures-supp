export const Sexes = ["male", "female"] as const;
export type Sex = (typeof Sexes)[number];
