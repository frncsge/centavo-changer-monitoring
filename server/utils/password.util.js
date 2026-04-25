// for password checking (at least 8 characters long)
export function isValidPassword(password) {
  const pattern = /^.{8,}$/;
  return pattern.test(password);
}
