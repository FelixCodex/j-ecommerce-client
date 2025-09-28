interface ButtonSubmitInterface {
	hideInMoblie: boolean;
	loadingSubmit: boolean;
	type: 'submit' | 'reset' | 'button' | undefined;
	form?: string;
	success?: boolean;
	loading: boolean;
	onclick?: () => void;
	disabled: boolean;
	text: string;
}

export function ButtonSubmitCheckOut({
	hideInMoblie,
	loadingSubmit,
	type,
	form,
	onclick,
	success,
	loading,
	disabled,
	text,
}: ButtonSubmitInterface) {
	return (
		<button
			form={form}
			type={type}
			className={`w-full bg-[--button] ${
				hideInMoblie ? 'hidden md:flex' : 'flex md:!hidden'
			} text-[--light_900] py-3 mt-3 rounded-lg hover:bg-[--button_hover]  items-center justify-center ${
				loading && 'cursor-not-allowed bg-[--button_not_allowed]'
			}`}
			disabled={disabled}
			onClick={onclick}
		>
			{loadingSubmit ? (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					className='loader'
				>
					<path d='M10.1 2.182a10 10 0 0 1 3.8 0'></path>
					<path d='M13.9 21.818a10 10 0 0 1-3.8 0'></path>
					<path d='M17.609 3.721a10 10 0 0 1 2.69 2.7'></path>
					<path d='M2.182 13.9a10 10 0 0 1 0-3.8'></path>
					<path d='M20.279 17.609a10 10 0 0 1-2.7 2.69'></path>
					<path d='M21.818 10.1a10 10 0 0 1 0 3.8'></path>
					<path d='M3.721 6.391a10 10 0 0 1 2.7-2.69'></path>
					<path d='M6.391 20.279a10 10 0 0 1-2.69-2.7'></path>
				</svg>
			) : success ? (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					className='lucide lucide-check-circle2 h-6 w-6 text-[--good]'
				>
					<circle
						cx='12'
						cy='12'
						r='10'
					></circle>
					<path d='m9 12 2 2 4-4'></path>
				</svg>
			) : (
				<span className='flex row align-center'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='h-5 w-5 mr-2'
					>
						<rect
							width='20'
							height='14'
							x='2'
							y='5'
							rx='2'
						></rect>
						<line
							x1='2'
							x2='22'
							y1='10'
							y2='10'
						></line>
					</svg>

					{text}
				</span>
			)}
		</button>
	);
}
