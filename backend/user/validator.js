const validateUsername = (username) => {
  if (!username || typeof username !== "string" || username.length < 3) {
    return "Username must be a valid string with at least 3 characters";
  }
  return null;
};

export { validateUsername };
