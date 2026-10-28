import { ref } from 'vue';

export default function useParseNumber() {
  const parseNumber = (value) => {
    // Check if the value is already a number
    if (typeof value === 'number') {
      // If it's a number, return it as is
      return value;
    }

    // Check if the value is a string
    if (typeof value !== 'string') {
      // If not a string, return null or handle the case according to your requirements
      return null;
    }

    // Remove spaces from the value
    const trimmedValue = value.replace(/\s/g, '');

    // Convert the string to a number
    const numericValue = parseFloat(trimmedValue);

    return !isNaN(numericValue) ? numericValue : "";
  };

  return {
    parseNumber,
  };
}