import { ChevronDown, CircleDashed, ShoppingCart } from 'lucide-react';
import { CircleQuestion } from './Elements/CircleQuestion';
import { LANGUAGE } from '../consts';
import { usePreferences } from '../hooks/usePreferences';
import { License, Product } from '../types';
import { useState } from 'react';
import { useCart } from '../hooks/useCart';

function AddButton({
	isInCart,
	loadingSubmit,
	handleAdd,
	handleNow,
}: {
	isInCart: boolean;
	loadingSubmit: boolean;
	handleAdd: () => void;
	handleNow: () => void;
}) {
	const { preferences } = usePreferences();
	return (
		<div className='flex w-full flex-col 2xl:flex-row gap-2 mt-2'>
			<button
				className={`bg-[--button_cart] hover:bg-[--button_cart_hover] items-center w-full justify-center gap-2 px-5 py-3 ${
					isInCart ? 'hidden' : 'flex'
				} text-[--light_900] rounded-xl font-medium transition-colors`}
				onClick={handleAdd}
				disabled={loadingSubmit}
			>
				{loadingSubmit ? (
					<CircleDashed className='h6- w-6 loader'></CircleDashed>
				) : (
					<>
						<ShoppingCart className='h-5 w-5' />
						{LANGUAGE.PRODUCT_BUTTON.ADD[preferences.language]}
					</>
				)}
			</button>
			<button
				className={`bg-[--button_cart_now] hover:bg-[--button_cart_now_hover] items-center w-full justify-center gap-2 px-5 py-3 ${
					isInCart ? 'hidden' : 'flex'
				} text-white rounded-xl font-medium transition-colors`}
				onClick={handleNow}
				disabled={loadingSubmit}
			>
				{loadingSubmit ? (
					<CircleDashed className='h6- w-6 loader'></CircleDashed>
				) : (
					<>
						<ShoppingCart className='h-5 w-5' />
						{LANGUAGE.PRODUCT_BUTTON.NOW[preferences.language]}
					</>
				)}
			</button>
		</div>
	);
}

interface Props {
	isInCart: boolean;
	isInPurchased: boolean;
	loadingSubmit: boolean;
	product: Product;
	license: License;
	cartLicenseSelected: string | undefined | null;
	handleAdd: () => void;
	handleNow: () => void;
}

export function LicenseSelector({
	isInCart,
	isInPurchased,
	loadingSubmit,
	product,
	license,
	cartLicenseSelected,
	handleAdd,
	handleNow,
}: Props) {
	const [detailsOpen, setDetailsOpen] = useState(false);
	const { preferences } = usePreferences();
	const { rate } = useCart();
	const weight = `${
		product.weight > 1000 ? `${product.weight / 1000}GB` : `${product.weight}MB`
	}`;
	return (
		<div
			className={`relative w-full flex-col gap-1 p-4 rounded-xl h-fit bg-[--bg_prim] ${
				isInPurchased
					? 'hidden'
					: product.isFree
					? 'hidden'
					: cartLicenseSelected
					? cartLicenseSelected == license
						? 'flex shadow-md'
						: 'hidden'
					: 'flex'
			}`}
		>
			<div className='flex justify-between items-center'>
				<h2 className='text-xl font-medium text-[--light_50]'>
					{license == 'personal'
						? LANGUAGE.PRODUCT.PERSONAL[preferences.language]
						: LANGUAGE.PRODUCT.PROFESSIONAL[preferences.language]}
				</h2>
				<p className='text-[--light_50] font-bold text-xl'>
					{LANGUAGE.CURRENCIES[preferences.currency]}
					{(preferences.currency == 'USD'
						? rate == 1
							? product[license]
							: product[license] / rate
						: product[license]
					).toFixed(2)}
				</p>
			</div>
			<div className='flex gap-2 mt-1 items-center'>
				<p className='font-medium text-[--light_100]'>
					{LANGUAGE.PRODUCT.LICENSE[preferences.language]}
				</p>
				<div className='h-5 w-5 group relative'>
					<CircleQuestion className='h-5 w-5 text-[--light_100]'></CircleQuestion>
					<span
						id='email-error'
						className='tooltiptext group-hover:visible after:border-transparent max-w-72 !top-[120%] !left-[-10%] shadow-sm shadow-[--light_300] border border-[--brand_color] text-[--light_0] bg-[--bg_prim] after:border-r-[--light_800]'
					>
						{license == 'personal'
							? LANGUAGE.PRODUCT.PERSONAL_LICENSE[preferences.language]
							: LANGUAGE.PRODUCT.PROFESSIONAL_LICENSE[preferences.language]}
					</span>
				</div>
			</div>
			<div>
				<h2
					className='cursor-pointer flex items-center justify-between font-medium text-[--light_100]'
					onClick={() => {
						setDetailsOpen(!detailsOpen);
					}}
				>
					{LANGUAGE.PRODUCT.FILES[preferences.language]}{' '}
					<ChevronDown
						className={`h-5 w-5 ${
							detailsOpen ? 'rotate-180' : 'rotate-0'
						} transition-transform duration-500`}
					></ChevronDown>
				</h2>
				<p
					className={`${
						detailsOpen ? 'max-h-8' : 'max-h-0'
					} transition-[max-height] pl-2 flex w-full font-bold text-[--light_100] justify-between duration-500 overflow-hidden`}
				>
					<span>{product.title}</span>
					<span>.zip / {weight}</span>
				</p>
			</div>
			<div className='flex'>
				<AddButton
					loadingSubmit={loadingSubmit}
					isInCart={isInCart}
					handleAdd={() => handleAdd()}
					handleNow={() => handleNow()}
				/>
			</div>
		</div>
	);
}
