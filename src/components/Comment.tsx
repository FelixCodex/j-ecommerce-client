import { ReactNode } from 'react';
import { usePreferences } from '../hooks/usePreferences';
import { LANGUAGE } from '../consts';
import { formatDiffToSince } from '../utils';

export function Comment({
	username,
	date,
	message,
	icon,
}: {
	username: string;
	date: string;
	message: string;
	icon?: ReactNode;
}) {
	const initiDate = new Date(date);
	const published = new Date(
		initiDate.getFullYear(),
		initiDate.getMonth(),
		initiDate.getDate(),
		initiDate.getHours() - initiDate.getTimezoneOffset() / 60,
		initiDate.getMinutes() + 1,
		initiDate.getSeconds()
	);
	const actual = new Date();
	const diff = (actual.getTime() - published.getTime()) / 1000;
	const { preferences } = usePreferences();
	const sinceDate = formatDiffToSince(diff, preferences);
	return (
		<div className='flex flex-col p-4 pt-3 bg-[--bg_sec] shadow-md shadow-[--brand_color_800] rounded-3xl'>
			<div className='flex items-center justify-between'>
				<span className='text-[--light_0] text-xl font-medium'>{username}</span>
				<div className='flex gap-2'>
					<span className='text-[--light_400] text-sm font-medium'>{`${
						LANGUAGE.PRODUCT.SINCE[preferences.language]
					} ${sinceDate} ${preferences.language == 'en' ? 'ago' : ''}`}</span>
					{icon}
				</div>
			</div>
			<p className='text-[--light_0] ml-2'>{message}</p>
		</div>
	);
}
