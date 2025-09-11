export const Validation = (formdata) => {
  const { email, password } = formdata;

  if (!email || !password) {
    throw new Error("All Fields are Required");
  }

  const emailregx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailregx.test(email)) {
    throw new Error("Enter a valid email address");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  return true;
};
