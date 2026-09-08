import { parsePhoneNumber, validatePhoneNumberLength, CountryCode } from "libphonenumber-js";

export interface PhoneValidationResult {
  isValid: boolean;
  message: string;
  formattedDisplay: string;
  canonicalValue: string;
}

export function getCountryFlagEmoji(countryCode: string): string {
  if (!countryCode) return "🌐";
  const upper = countryCode.toUpperCase();
  if (upper === "DZ") return "🇩🇿";
  try {
    const codePoints = upper
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
}

// Algerian Landline area codes
const ALGERIA_LANDLINE_AREA_CODES = new Set([
  "21", "23", "24", "25", "26", "27", "29",
  "31", "32", "33", "34", "35", "36", "37", "38",
  "41", "43", "45", "46", "48", "49",
]);

/**
 * Validate phone number using libphonenumber-js for country-specific numbering metadata
 */
export function validatePhoneNumber(phone: string, countryCode: string = "DZ", dialCode: string = "213"): PhoneValidationResult {
  const raw = phone ? phone.trim() : "";

  if (!raw) {
    return {
      isValid: false,
      message: "Please enter your phone number.",
      formattedDisplay: "",
      canonicalValue: "",
    };
  }

  // Reject letters, emojis, or invalid special characters
  if (/[a-zA-Z\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/u.test(raw)) {
    return {
      isValid: false,
      message: "Please enter a valid phone number.",
      formattedDisplay: raw,
      canonicalValue: raw,
    };
  }

  const digitsOnly = raw.replace(/\D/g, "");

  if (!digitsOnly) {
    return {
      isValid: false,
      message: "Please enter a valid phone number.",
      formattedDisplay: raw,
      canonicalValue: raw,
    };
  }

  const countryUpper = (countryCode || "DZ").toUpperCase() as CountryCode;
  const cleanDialCode = dialCode ? dialCode.replace(/\D/g, "") : "213";

  // Pre-process for libphonenumber parsing
  let inputToParse = raw;

  if (!raw.startsWith("+")) {
    if (digitsOnly.startsWith(cleanDialCode) && digitsOnly.length > cleanDialCode.length + 5) {
      inputToParse = `+${digitsOnly}`;
    } else {
      inputToParse = raw;
    }
  }

  try {
    const phoneNumber = parsePhoneNumber(inputToParse, countryUpper);

    if (phoneNumber && phoneNumber.isValid()) {
      const e164 = phoneNumber.number;
      const national = phoneNumber.formatNational();

      return {
        isValid: true,
        message: "",
        formattedDisplay: national,
        canonicalValue: e164,
      };
    }
  } catch {
    // Parse error ignored, fallback to length checking
  }

  // Check length error specifically with libphonenumber-js
  try {
    const lengthError = validatePhoneNumberLength(inputToParse, countryUpper);
    if (lengthError === "TOO_SHORT") {
      return {
        isValid: false,
        message: "This phone number is too short.",
        formattedDisplay: raw,
        canonicalValue: cleanDialCode ? `+${cleanDialCode}${digitsOnly}` : `+${digitsOnly}`,
      };
    }
    if (lengthError === "TOO_LONG") {
      return {
        isValid: false,
        message: "This phone number is too long.",
        formattedDisplay: raw,
        canonicalValue: cleanDialCode ? `+${cleanDialCode}${digitsOnly}` : `+${digitsOnly}`,
      };
    }
  } catch {
    // Length check error ignored
  }

  // Fallback for Algeria strict local rules (05, 06, 07 or landline)
  if (countryUpper === "DZ" || cleanDialCode === "213") {
    let nat = digitsOnly;
    if (nat.startsWith("213") && nat.length >= 11) {
      nat = nat.slice(3);
    }
    let base = nat;
    if (base.startsWith("0")) base = base.slice(1);

    if (base.length > 0) {
      const firstChar = base.charAt(0);
      if (firstChar === "5" || firstChar === "6" || firstChar === "7") {
        if (base.length < 9) {
          return {
            isValid: false,
            message: "This phone number is too short.",
            formattedDisplay: raw,
            canonicalValue: `+213${base}`,
          };
        }
        if (base.length > 9) {
          return {
            isValid: false,
            message: "This phone number is too long.",
            formattedDisplay: raw,
            canonicalValue: `+213${base}`,
          };
        }
        return {
          isValid: true,
          message: "",
          formattedDisplay: `0${base}`,
          canonicalValue: `+213${base}`,
        };
      }
      if (firstChar === "2" || firstChar === "3" || firstChar === "4") {
        const areaCode = base.slice(0, 2);
        if (ALGERIA_LANDLINE_AREA_CODES.has(areaCode)) {
          if (base.length < 8) {
            return {
              isValid: false,
              message: "This phone number is too short.",
              formattedDisplay: raw,
              canonicalValue: `+213${base}`,
            };
          }
          if (base.length > 9) {
            return {
              isValid: false,
              message: "This phone number is too long.",
              formattedDisplay: raw,
              canonicalValue: `+213${base}`,
            };
          }
          return {
            isValid: true,
            message: "",
            formattedDisplay: `0${base}`,
            canonicalValue: `+213${base}`,
          };
        }
      }
    }
  }

  return {
    isValid: false,
    message: "Please enter a valid phone number.",
    formattedDisplay: raw,
    canonicalValue: cleanDialCode ? `+${cleanDialCode}${digitsOnly}` : `+${digitsOnly}`,
  };
}

/**
 * Formats stored phone numbers (e.g. +213661234567 or +21620123456) into local national display format for orders/admin display.
 */
export function formatPhoneForDisplay(phone: string, countryCode: string = "DZ"): string {
  if (!phone) return "";
  const raw = phone.trim();
  try {
    const phoneNumber = parsePhoneNumber(raw, countryCode.toUpperCase() as CountryCode);
    if (phoneNumber) {
      return phoneNumber.formatNational();
    }
  } catch {
    // fallback
  }

  // Fallback for Algerian numbers
  if (raw.startsWith("+213") || raw.startsWith("213")) {
    const digits = raw.replace(/\D/g, "");
    let nat = digits.startsWith("213") ? digits.slice(3) : digits;
    if (nat.startsWith("0")) nat = nat.slice(1);
    if (nat.length >= 8) {
      return `0${nat}`;
    }
  }
  return raw;
}


