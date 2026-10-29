import zh from '../i18n/zh.json';
import en from '../i18n/en.json';
export const dictionaries={zh,en} as const;
export type Lang=keyof typeof dictionaries;
export const dictionary=(lang:Lang)=>dictionaries[lang];
