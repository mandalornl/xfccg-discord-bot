import { normalize } from '#src/util/normalize';

export const slugify = (value: unknown): string => (
  normalize(value).replace(/[^0-9a-z-]+/g, '-')
);
