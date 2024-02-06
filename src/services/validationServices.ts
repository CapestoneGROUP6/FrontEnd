export type ValidationResponse = {
  status: boolean;
  message?: string;
};

export const validateUserName = (userName: string): ValidationResponse => {
  return {
    status: true,
  };
};

export const validatePassword = (password: string): ValidationResponse => {
  return {
    status: true,
  };
};


export const validateOtp = (otp: string): ValidationResponse => {
  return {
    status: true,
  };
};

export const validateEmail = (email: string): ValidationResponse => {
  return {
    status: true,
  };
};
