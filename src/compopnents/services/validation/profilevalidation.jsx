import toast from "react-hot-toast";

export const profileValidation = (formdata) => {
  const { firstName, lastName, city, phoneNumber, role, isVerified } = formdata;

  // Validate firstName (required, letters and spaces, 2–50 characters)
  if (!firstName) {
    throw new Error("First Name is required");
  }
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  if (!nameRegex.test(firstName)) {
    // throw new Error(
    //   "First Name must be 2–50 characters and contain only letters and spaces"
    // );
    toast.error(
      "First Name must be 2–50 characters and contain only letters and spaces"
    );
  }

  // Validate lastName (optional, letters and spaces, 2–50 characters if provided)
  if (lastName && !nameRegex.test(lastName)) {
    throw new Error(
      "Last Name must be 2–50 characters and contain only letters and spaces"
    );
  }

  // Validate city (optional, letters and spaces, 2–100 characters if provided)
  if (city) {
    const cityRegex = /^[a-zA-Z\s]{2,100}$/;
    if (!cityRegex.test(city)) {
      throw new Error(
        "City must be 2–100 characters and contain only letters and spaces"
      );
    }
  }

  // Validate phoneNumber (optional, 10–15 digits with optional + or - if provided)
  if (phoneNumber) {
    const phoneRegex = /^\+?[0-9-]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error(
        "First Name must be 2–50 characters and contain only letters and spaces"
      );
    }
  }

  // Validate role (required, must be "user" or "admin")
  if (!["user", "admin"].includes(role)) {
    throw new Error("Role must be either 'user' or 'admin'");
  }

  // Validate isVerified (required, must be boolean)
  if (typeof isVerified !== "boolean") {
    throw new Error("Verified status must be a boolean");
  }

  return true;
};
