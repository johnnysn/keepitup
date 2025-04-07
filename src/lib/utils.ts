import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { browser } from '$app/environment';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function atStartOfDay(date: Date): Date {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function dateFromDateStr(dateStr: string) {
	const [yearStr, monthStr, dayStr] = dateStr.split('-');
	const [year, month, day] = [parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr)];

	return new Date(Date.UTC(year, month, day));
}

export function dateStrFromDate(date: Date) {
	const year = date.getUTCFullYear();
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-indexed, so add 1
	const day = date.getUTCDate().toString().padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function formatDate(date: Date) {
	let lang = 'en';
	if (browser) {
		lang = navigator.language;
	}

	const formatter = new Intl.DateTimeFormat(lang, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone: 'UTC'
	});
	return formatter.format(date);
}
