export type BetterRequired<T> = {
  [key in keyof T]-?: NonNullable<T[key]>;
};

export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & BetterRequired<Pick<T, K>>;
