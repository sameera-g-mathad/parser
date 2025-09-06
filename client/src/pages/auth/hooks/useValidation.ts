type validation = {
  isEmailValid: (inp: string) => boolean;
  isPasswordValid: (inp: string) => boolean;
  isPasswordSame: (inp1: string, inp2: string) => boolean;
};

export const useValidation = (): validation => {
  const emailRegex =
    /^[0-9a-zA-Z]+(\.?[0-9a-zA-Z+_])*@[0-9a-zA-Z]+\.(edu|com|org)$/;
  const passwordRegex = /^((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])).{15,30}$/;
  const isEmailValid = (email: string): boolean => {
    return emailRegex.test(email);
  };

  const isPasswordValid = (password: string): boolean => {
    return passwordRegex.test(password);
  };

  const isPasswordSame = (password: string, confirmPassword: string): boolean =>
    password === confirmPassword;

  return {
    isEmailValid,
    isPasswordValid,
    isPasswordSame,
  };
};
