// repository/validator.js

const validateRepoName = (repoName) => {
  if (!repoName || typeof repoName !== "string" || repoName.length < 3) {
    return "Repository name must be a valid string with at least 3 characters";
  }
  return null;
};

export { validateRepoName };
