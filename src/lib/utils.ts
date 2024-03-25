import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE_URL = 'http://localhost:5050';

export default axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
