import { Point } from "./Point";

export type PointValue<T> = Point & {
  value: T;
};
