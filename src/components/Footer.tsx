import { BRANDNAME } from '../consts';

export function Footer() {
	const date = new Date();
	return (
		<footer className='bg-[--bg_sec] text-[--light_0] py-8'>
			<div className='container mx-auto px-4'>
				<div className='flex flex-col md:flex-row justify-between items-center'>
					<div className='flex flex-col max-w-[75%] items-center md:items-start my-2'>
						<span className='text-xl font-bold'>{BRANDNAME}</span>
						<span className='text-md'>
							<span>© </span>
							<span className='text-sm '>
								{date.getFullYear() > 2025
									? `2025-${date.getFullYear()}`
									: date.getFullYear()}{' '}
								{BRANDNAME}{' '}
							</span>
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
