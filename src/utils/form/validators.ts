function isValidRepoUrl({ value }: { value: string }): {
  isValid: boolean;
  errorMessage: string;
} {
  const regex = /^https:\/\/github\.com\/([a-zA-Z0-9-_]+)\/([a-zA-Z0-9-_]+)$/;
  const isValid = regex.test(value);
  return {
    isValid,
    errorMessage: isValid ? "" : "Invalid repository URL",
  };
}

interface validatorsInput {
  value: string;
}

interface FormValidators {
  [key: string]: (value: validatorsInput) => {
    isValid: boolean;
    errorMessage: string;
  };
}

export const formValidators: FormValidators = {
  isValidRepoUrl,
};
