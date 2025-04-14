import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { browser } from '$app/environment';
import type { TransitionConfig } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

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

export function formatWeekDay(startingStr: string, pos: number, value: boolean) {
	let wd = '0000000';
	if (startingStr && startingStr.length === 7) wd = startingStr;

	wd = wd.slice(0, pos) + (value ? '1' : '0') + (pos < 6 ? wd.slice(pos + 1) : '');

	return wd;
}
