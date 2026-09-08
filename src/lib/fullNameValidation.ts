export interface FullNameValidationResult {
  isValid: boolean;
  message: string;
  cleanName: string;
}

/**
 * Validate full name field according to international standards
 */
export function validateFullName(name: string): FullNameValidationResult {
  const raw = name || "";
  const cleanName = raw.trim().replace(/\s+/g, " ");

  if (!cleanName) {
    return {
      isValid: false,
      message: "Please enter your full name.",
      cleanName: "",
    };
  }

  // Reject numbers
  if (/\d/.test(cleanName)) {
    return {
      isValid: false,
      message: "Name cannot contain numbers.",
      cleanName,
    };
  }

  // Reject emojis and invalid special symbols (allow unicode letters, spaces, hyphens -, apostrophes ')
  const invalidCharsRegex = /[^\p{L}\s'-]/u;
  if (invalidCharsRegex.test(cleanName)) {
    return {
      isValid: false,
      message: "Only letters, hyphens, and apostrophes are allowed.",
      cleanName,
    };
  }

  const words = cleanName.split(" ").filter((w) => w.length > 0);

  if (words.length < 2) {
    return {
      isValid: false,
      message: "Enter at least first and last name.",
      cleanName,
    };
  }

  return {
    isValid: true,
    message: "",
    cleanName,
  };
}
