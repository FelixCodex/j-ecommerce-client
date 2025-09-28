import { useState } from 'react';
import { CartProduct, Preferences } from '../types';
import { IMG_API_URL, LANGUAGE } from '../consts';
import { CircleDashed, Trash2 } from 'lucide-react';

export function CartProductItem({
	product,
	preferences,
	rate,
	handleRemoveElement,
}: {
	product: CartProduct;
	preferences: Preferences;
	rate: number;
	handleRemoveElement: (id: string) => void;
}) {
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

	const calculatePrice = () => {
		return `${
			LANGUAGE.CURRENCIES[preferences.currency]
		}${(preferences.currency == 'USD'
			? product[product.license] / rate
			: product[product.license]
		).toFixed(2)}`;
	};

	return (
		<div className='w-full flex flex-row shadow-md p-4 bg-[--bg_sec] rounded-lg'>
			<div>
				<img
					src={`${IMG_API_URL}${product.image}.webp`}
					alt={product.title}
					className='h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 text-[8px] aspect-video object-cover rounded-md border-2 border-[--light_500] text-[--light_900]'
				/>
			</div>
			<div className='w-full ml-4 flex flex-row justify-between'>
				<p className='w-full text-lg md:text-2xl flex items-start text-[--light_50]'>
					{product.title}
				</p>
				<div className='flex flex-col-reverse justify-between items-end'>
					<button
						className='w-20 h-7 px-1 flex flex-row items-center justify-center gap-1 text-sm font-medium rounded-md text-[--light_400] border border-[--light_400] hover:text-[--light_200] hover:border-[--light_200] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
						onClick={() => {
							handleRemoveElement(product.id);
							setLoadingSubmit(true);
						}}
					>
						{loadingSubmit ? (
							<CircleDashed className='h-4 w-4 loader text-[--light_100]' />
						) : (
							<>
								<Trash2 className='h-4 w-4'></Trash2>
								{LANGUAGE.CART.DELETE[preferences.language]}
							</>
						)}
					</button>
					<p className='text-lg font-bold flex items-center text-[--light_200]'>
						{calculatePrice()}
					</p>
				</div>
			</div>
		</div>
	);
}
