const JWT_ALGORITHM = 'HS256';
const JWT_MAX_AGE = '12 hours';

enum UserValidity {
  NameMinLength = 1,
  NameMaxLength = 15,
  PasswordMinLength = 6,
  PasswordMaxLength = 12
}

export {
  UserValidity,
  JWT_ALGORITHM,
  JWT_MAX_AGE
};
