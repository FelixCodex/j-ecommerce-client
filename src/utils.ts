import { LANGUAGE, monthsEn, monthsEs } from './consts';
import { Language, Preferences } from './types';

export function replaceString(
	text: string | null,
	replace: string,
	replaceFor: string
) {
	if (text == null) return '';
	let newString = '';
	for (let i = 0; i < text.length; i++) {
		if (text[i] == replace) newString += replaceFor;
		else newString += text[i];
	}
	return newString;
}

export function filterADifferenceB<T>(A: Array<T>, B: Array<T>) {
	const difference = A.filter(itemA => {
		const index = B.findIndex(itemB => itemB == itemA);
		if (index == -1) return true;
		return false;
	});
	return difference;
}

export function removeDoubles<T>(arrays: Array<T>) {
	const masterArray = [] as Array<T>;
	arrays.forEach(element => {
		masterArray.concat(element);
	});

	const newArr = [] as Array<T>;
	const finalArr = masterArray.filter(item => {
		const find = newArr.find(itemN => itemN == item);
		if (find) return false;
		newArr.push(item);
		return true;
	});

	return finalArr;
}

export function formatDiffToSince(
	diff: number,
	preferences: Preferences
): string {
	const s = diff > 1 ? 's' : '';
	if (diff < 60)
		return `${diff.toFixed(0)} ${
			LANGUAGE.TIME.SECOND[preferences.language]
		}${s}`;
	if (diff < 3600)
		return `${(diff / 60).toFixed(0)} ${
			LANGUAGE.TIME.MINUTE[preferences.language]
		}${s}`;
	if (diff < 86400)
		return `${(diff / 3600).toFixed(0)} ${
			LANGUAGE.TIME.HOUR[preferences.language]
		}${s}`;
	if (diff < 604800)
		return `${(diff / 86400).toFixed(0)} ${
			LANGUAGE.TIME.DAY[preferences.language]
		}${s}`;
	if (diff < 18144000)
		return `${(diff / 604800).toFixed(0)} ${
			LANGUAGE.TIME.WEEK[preferences.language]
		}${s}`;
	if (diff < 217728000)
		return `${(diff / 18144000).toFixed(0)} ${
			LANGUAGE.TIME.MONTH[preferences.language]
		}${s}`;

	return `${(diff / 217728000).toFixed(0)} ${
		LANGUAGE.TIME.YEAR[preferences.language]
	}${s}`;
}

export function formatDateTime(date: Date): string {
	const pad = (num: number) => String(num).padStart(2, '0');

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1); // Meses empiezan desde 0
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDateString(str: string, lang: 'es' | 'en') {
	const date = new Date(str);
	if (lang == 'es') {
		return `${date.getDate()} de ${
			monthsEs[date.getMonth() - 1]
		}, ${date.getFullYear()}`;
	}
	return `${date.getDate()} ${
		monthsEn[date.getMonth() - 1]
	}, ${date.getFullYear()}`;
}

export function formatDateTimeToUTC(date: Date): string {
	const pad = (num: number) => String(num).padStart(2, '0');

	const year = date.getUTCFullYear();
	const month = pad(date.getUTCMonth() + 1); // Meses empiezan desde 0
	const day = pad(date.getUTCDate());
	const hours = pad(date.getUTCHours());
	const minutes = pad(date.getUTCMinutes());
	const seconds = pad(date.getUTCSeconds());

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDateTimeToLocal(str: string): Date {
	return new Date(convertToLocalTime(str));
}

export function convertToLocalTime(serverDate: string): string {
	const utcDate = new Date(serverDate + ' UTC');

	return utcDate
		.toLocaleString('es-ES', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		})
		.replace(/\//g, '-')
		.replace(',', '');
}

export function formatMinutes(num: number) {
	if (num < 10) {
		return '0' + num;
	}
	return num;
}

export function formatHours(num: number) {
	if (num > 12) {
		return num - 12;
	}
	if (num == 0) {
		return 12;
	}
	return num;
}

export function whichMeridian(num: number) {
	if (num > 12) {
		return 'pm';
	}
	return 'am';
}

export function saveInLocalStorage({
	item,
	value,
}: {
	item: string;
	value: string;
}) {
	localStorage.setItem(item, value);
}

export function getUrlParam(param: string) {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	return urlParams.get(param);
}

export function createDateTextFromLanguage(lang: Language, date: Date) {
	if (lang == 'es') {
		return `${date.getDate()} de ${
			monthsEs[date.getMonth()]
		}, ${date.getFullYear()}`;
	} else if (lang == 'en') {
		return `${
			monthsEn[date.getMonth()]
		} ${date.getDate()}, ${date.getFullYear()}`;
	}
}

export function scrollToElem(id: string): void {
	const elem = document.getElementById(id);
	if (elem) window.scrollTo({ top: elem?.offsetTop - 78 });
}
