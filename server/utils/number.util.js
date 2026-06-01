export const isValidNumber = (value) =>
  value !== "" && !Number.isNaN(Number(value));
