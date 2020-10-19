// 8 characters including at least 1 uppercase, 1 lowercase and 1 special character including numbers
export const passwordRegex =
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$';
