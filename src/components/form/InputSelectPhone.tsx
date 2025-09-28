import { useState } from 'react';

interface InputInterface {
	label: string;
	id: string;
	name: string;
	disabled: boolean;
	required: boolean;
	value: string;
	setValue: (values: string) => void;
	setCallingCode: (values: string) => void;
	countries: { id: number; slug: string; slugn: string; callingCode: number }[];
}

export function InputSelectPhone({
	label,
	id,
	name,
	required,
	disabled,
	value,
	setValue,
	setCallingCode,
	countries,
}: InputInterface) {
	const [slugnValue, setSlugN] = useState(countries[0].slugn);
	return (
		<div>
			<label
				htmlFor={id}
				className='block text-sm font-medium text-[--light_100] '
			>
				{label} {required && <span className='text-red-500'>*</span>}
			</label>
			<div className='flex flex-row'>
				<select
					id={id}
					name={name}
					className='w-1/6 min-w-[5.75rem] px-3 py-2 border-t border-l border-b bg-[--bg_prim] border-[--light_500] text-[--light_0] appearance-none rounded-tl-md rounded-bl-md focus:z-50 focus:outline-none focus:ring-2 focus:ring-[--brand_color]'
					value={slugnValue}
					disabled={disabled}
					onChange={e => {
						const code =
							countries.find(el => el.slugn == e.target.value)?.callingCode ??
							1;
						setCallingCode(`${code}`);
						setSlugN(e.target.value);
					}}
				>
					{countries
						.sort((a, b) => a.slug.localeCompare(b.slug))
						.map(country => (
							<option
								key={'spnc-chr-' + country.id}
								value={`${country.slugn}`}
								className='flex justify-between'
							>
								{country.slug} +{country.callingCode}
							</option>
						))}
				</select>
				<input
					type='number'
					value={value}
					required={required}
					disabled={disabled}
					onChange={e => {
						setValue(e.target.value);
					}}
					className={`w-full px-3 py-2 bg-[--bg_prim] border-[--light_500] text-[--light_0]  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield] border rounded-tr-md rounded-br-md  focus:outline-none focus:ring-2 focus:ring-[--brand_color] `}
					placeholder='2125844128..'
					maxLength={6}
				/>
			</div>
		</div>
	);
}
