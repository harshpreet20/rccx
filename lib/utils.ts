import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SOCIAL_LINKS = {
  whatsapp: 'https://chat.whatsapp.com/KeznsK95pHK1JKT4nqpcsv',
  instagram: 'https://www.instagram.com/racquetsclubcommunity',
  facebook: 'https://www.facebook.com/share/1CP9eke83b/?mibextid=wwXIfr',
};

export const BRAND = {
  name: 'Racquets Club Community',
  shortName: 'RCC',
  tagline: "Delhi's Invite-Only Badminton Community",
  subTagline: 'Smash. Connect. Compete.',
  location: 'Delhi, India',
};
