import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import universities from "./universites";
import { format } from "date-fns";

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

export const base64ToFile = (base64String: string, fileName: string, mimeType: string): File => {
  const base64Data = base64String.split(",")[1];
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    const byteNumbers = new Array(slice.length);

    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }

    byteArrays.push(new Uint8Array(byteNumbers)); 
  }

  const blob = new Blob(byteArrays, { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
};

export const createExportName = (courseName: string, date: Date): string => {
  // Replace Hungarian characters
  const hungarianToAscii: { [key: string]: string } = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ö': 'o', 'ő': 'o', 'ú': 'u', 'ü': 'u', 'ű': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ö': 'O', 'Ő': 'O', 'Ú': 'U', 'Ü': 'U', 'Ű': 'U'
  };

  // Replace Hungarian characters and convert to lowercase
  const normalizedName = courseName
    .split('')
    .map(char => hungarianToAscii[char] || char)
    .join('')
    .toLowerCase();

  // Replace spaces with hyphens
  const formattedName = normalizedName.replace(/\s+/g, '-');

  // Format date
  const formattedDate = format(date, 'yyyy-MM-dd');

  return `${formattedName}_${formattedDate}_jelenleti_iv.xlsx`;
};