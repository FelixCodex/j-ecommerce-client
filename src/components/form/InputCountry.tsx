interface InputInterface {
	label: string;
	id: string;
	name: string;
	disabled: boolean;
	required: boolean;
	value: number;
	loadingSubmit?: boolean;
	setValue: (values: number) => void;
	countries: { id: number; name: string }[];
}

export function InputCountry({
	label,
	id,
	name,
	required,
	disabled,
	value,
	setValue,
	countries,
	loadingSubmit,
}: InputInterface) {
	return (
		<div>
			<label
				htmlFor={id}
				className='block text-sm font-medium text-[--light_100]'
			>
				{label} {required && <span className='text-red-500'>*</span>}
			</label>
			<select
				id={id}
				name={name}
				value={value}
				disabled={disabled}
				onChange={e => setValue(Number(e.target.value))}
				className={`w-full px-3 py-2 border bg-[--bg_prim] border-[--light_500] text-[--light_0] rounded-md focus:outline-none focus:ring-2 focus:ring-[--brand_color] ${
					loadingSubmit ? 'appearance-none' : ''
				}`}
			>
				{countries
					.sort((a, b) => a.name.localeCompare(b.name))
					.map(country => (
						<option
							key={'sc-chr-' + country.id}
							value={country.id}
						>
							{country.name}
						</option>
					))}
			</select>
		</div>
	);
}
