export const API_URL = import.meta.env.VITE_API_URL
export const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

export interface User {
    name: string;
    email: string;
    university: string[];
}

interface Student {
    name: string;
    neptun_code: string;
}

export interface CourseData {
    _id: string;
    name: string;
    university: string;
    students: [Student];
}


export interface AttendanceData {
    name: string;
    has_signed: boolean;
    confidence: number;
    pixel_density: number;
}