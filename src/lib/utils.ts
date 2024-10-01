import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

export function numberToWords(num: number): string {
  const scales = ["", "Thousand", "Million", "Billion", "Trillion"];
  if (num === 0) return "Zero";

  let word = "";

  // Process each group of 3 digits, starting from the right (e.g. billion, million, thousand, etc.)
  for (let i = 0, unit = num; unit > 0; i++, unit = Math.floor(unit / 1000)) {
    const group = unit % 1000;
    if (group > 0) {
      word = `${convertThreeDigits(group)} ${scales[i]} ${word}`.trim();
    }
  }

  return word.trim();
}

function convertThreeDigits(num: number): string {
  let result = "";

  if (num >= 100) {
    result += `${ones[Math.floor(num / 100)]} Hundred `;
    num %= 100;
  }

  if (num >= 20) {
    result += `${tens[Math.floor(num / 10)]} `;
    num %= 10;
  }

  if (num > 0) {
    result += `${ones[num]} `;
  }

  return result.trim();
}
