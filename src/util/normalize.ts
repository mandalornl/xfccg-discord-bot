export const normalize = (value: unknown): string => {
  if (!value) {
    return '';
  }

  return String(value)
    .normalize()
    .toLowerCase();
};
