import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import universities from "./universites";

export function getUniversityName(abbreviation: string): string | null {
    return universities[abbreviation]?.name || null;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
      .split(" ") // Split the string by spaces
      .map(word => word.charAt(0).toUpperCase()) // Get the first letter of each word and uppercase it
      .join(""); // Join them back into a single string
}