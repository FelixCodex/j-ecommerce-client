import {
	CheckCircle,
	CircleDashed,
	Download,
	ShoppingCart,
} from 'lucide-react';
import { License, Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LANGUAGE } from '../consts';
import { useAuth } from '../hooks/useAuth';
import { usePreferences } from '../hooks/usePreferences';
import { formatDateString } from '../utils';
import { LicenseSelector } from './LicenseSelector';
import { getFreeRequest } from '../Api/cart';

export function ProductLicenseSelector({ product }: { product: Product }) {
	const { state: cart, purchased, addToCart, addPurchase } = useCart();
	const [isInCart, setIsInCart] = useState<boolean>(false);
	const [isInPurchased, setIsInPurchased] = useState<boolean>(false);
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
	const { logged } = useAuth();
	const { preferences } = usePreferences();

	const checkProductInCart = useCallback(
		(product: Product) => {
			return cart.some(item => item.id == product.id);
		},
		[cart]
	);
	const checkProductInPurchased = useCallback(
		(product: Product) => {
			return purchased.some(item => item.id == product.id);
		},
		[purchased]
	);

	useEffect(() => {
		if (!product) return;
		setIsInCart(checkProductInCart(product));
		setIsInPurchased(checkProductInPurchased(product));
	}, [cart, checkProductInCart, checkProductInPurchased, product]);
	const navigate = useNavigate();

	useEffect(() => {
		if (isInCart) {
			if (loadingSubmit) {
				setLoadingSubmit(false);
			}
		}
	}, [isInCart, loadingSubmit]);

	const handleProductAdd = (
		id: string,
		isInCart: boolean,
		isInPurchased: boolean,
		license: License,
		setLoadingSubmit: (b: boolean) => void
	) => {
		if (!logged) {
			navigate(`/login?path=-product-${product.id}`);
			return;
		}
		if (isInPurchased) {
			navigate('/dashboard');
			window.scrollTo({ top: 0 });
			return;
		}
		if (isInCart) {
			navigate('/cart');
			window.scrollTo({ top: 0 });
			return;
		}
		if (!license) return;
		addToCart(id, license);
		setLoadingSubmit(true);
	};

	const handleProductNow = (license: License) => {
		navigate(`/checkout?i=${product.id}&l=${license}`);
	};

	const handleFree = async () => {
		if (!logged) {
			navigate(`/login?path=-product-${product.id}`);
			return;
		}
		setLoadingSubmit(true);
		try {
			const res = await getFreeRequest(product.id);
			if (!res) throw new Error('Get free request failed');
			if (res.status == 200) {
				addPurchase({
					id: res.data.productId,
					title: res.data.title,
					image: res.data.image,
					purchased_at: res.data.purchased_at,
				});
			} else {
				console.error('Error purchasing free product');
			}
		} catch (error) {
			console.log('Error fetching get free', error);
		} finally {
			setLoadingSubmit(false);
		}
	};

	const cartLicenseSelected = isInCart
		? cart.find(el => el.id == product.id)?.license
		: null;

	const weight = `${
		product.weight > 1000 ? `${product.weight / 1000}GB` : `${product.weight}MB`
	}`;

	return (
		<aside
			className={`bg-[--bg_sec] rounded-xl h-fit w-[--aside_width] [--aside_width:100%] lg:[--aside_width:21.25rem] xl:[--aside_width:25.12rem] 2xl:[--aside_width:30rem] flex lg:sticky lg:top-[5.5rem] flex-col aside`}
		>
			<div className='flex p-9 py-7 gap-3 flex-col items-start justify-between border-b border-[--bg_prim]'>
				<h2 className='text-3xl font-bold text-[--text_light_50] mb-2'>
					{product.title}
				</h2>

				<LicenseSelector
					handleAdd={() =>
						handleProductAdd(
							product.id,
							isInCart,
							isInPurchased,
							'personal',
							setLoadingSubmit
						)
					}
					handleNow={() => {
						handleProductNow('personal');
					}}
					cartLicenseSelected={cartLicenseSelected}
					isInCart={isInCart}
					isInPurchased={isInPurchased}
					loadingSubmit={loadingSubmit}
					license='personal'
					product={product}
				/>
				<LicenseSelector
					handleAdd={() =>
						handleProductAdd(
							product.id,
							isInCart,
							isInPurchased,
							'professional',
							setLoadingSubmit
						)
					}
					handleNow={() => {
						handleProductNow('professional');
					}}
					cartLicenseSelected={cartLicenseSelected}
					isInCart={isInCart}
					isInPurchased={isInPurchased}
					loadingSubmit={loadingSubmit}
					license='professional'
					product={product}
				/>

				<button
					className={`items-center w-full justify-center gap-2 px-6 py-3 ${
						isInPurchased
							? 'hidden'
							: product.isFree
							? 'bg-[--button_cart] hover:bg-[--button_cart_hover] flex'
							: 'hidden'
					} text-[--text_light_900] rounded-xl  transition-colors`}
					disabled={loadingSubmit}
					onClick={handleFree}
				>
					{loadingSubmit ? (
						<>
							<CircleDashed className='h-5 w-5 loader' />
						</>
					) : (
						LANGUAGE.PRODUCT_BUTTON.ACQUIRE[preferences.language]
					)}
				</button>
				<div className='items-center w-full justify-center'>
					<p
						className={`mb-2 ml-2 gap-2 items-center justify-start ${
							isInPurchased ? 'flex' : 'hidden'
						}`}
					>
						<CheckCircle className='h-7 w-7 text-[--good]'></CheckCircle>{' '}
						<span className='text-xl font-medium text-[--text_light_100]'>
							{LANGUAGE.PRODUCT_BUTTON.SAVED_DASH[preferences.language]}
						</span>
					</p>
					<button
						className={`items-center w-full justify-center gap-2 px-6 py-3 ${
							isInPurchased
								? 'bg-[--button_purchased] hover:bg-[--button_purchased_hover] flex'
								: product.isFree
								? 'hidden'
								: isInCart
								? 'bg-[--button_cart] hover:bg-[--button_cart_hover] flex'
								: 'hidden'
						} text-[--text_light_900] rounded-xl  transition-colors`}
						onClick={() => {
							if (isInPurchased) {
								navigate('/dashboard');
								window.scrollTo({ top: 0 });
								return;
							}
							if (isInCart) {
								navigate('/cart');
								window.scrollTo({ top: 0 });
								return;
							}
						}}
					>
						{isInPurchased ? (
							<>
								<Download className='h-5 w-5' />{' '}
								{LANGUAGE.PRODUCT_BUTTON.DOWNLOAD[preferences.language]}
							</>
						) : loadingSubmit ? (
							<>
								<CircleDashed className='h-5 w-5 loader' />
							</>
						) : isInCart ? (
							<>
								<ShoppingCart className='h-5 w-5' />{' '}
								{LANGUAGE.PRODUCT_BUTTON.GO_TO_CART[preferences.language]}
							</>
						) : (
							<></>
						)}
					</button>
				</div>
			</div>

			<div className='p-9 pt-7'>
				<h2 className='text-2xl font-bold text-[--text_light_100] mb-3'>
					{LANGUAGE.PRODUCT.DETAILS[preferences.language]}
				</h2>
				<div className='flex flex-col gap-1'>
					<div className='text-[--text_light_0] text-lg flex justify-between items-center'>
						<span>{LANGUAGE.PRODUCT.PUBLISHED_AT[preferences.language]}</span>
						<span>
							{formatDateString(product.created_at, preferences.language)}
						</span>
					</div>
					<div className='text-[--text_light_0] text-lg flex justify-between items-center'>
						<span>{LANGUAGE.PRODUCT.WEIGHT[preferences.language]}</span>
						<div className='rounded-lg py-1 '>{weight}</div>
					</div>
					<div className='text-[--text_light_0] text-lg flex justify-between items-center'>
						<span>{LANGUAGE.PRODUCT.FORMATS[preferences.language]}</span>
						<div className='rounded-lg py-1 bg-[--bg_prim] shadow-md px-3'>
							.stl
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}

// const [personal, setPersonal] = useState<number>(0);
// const [professional, setProfessional] = useState<number>(0);
// const [currency, setCurrency] = useState<string>("€");
// useEffect(() => {
//   if (!product) return;
//   setCurrency(LANGUAGE.CURRENCIES[preferences.currency]);
//   const pers =
//     preferences.currency == "USD"
//       ? rate == 1
//         ? product.personal
//         : Math.floor((product.personal / rate) * 100) / 100
//       : product.personal;

//   const prof =
//     preferences.currency == "USD"
//       ? rate == 1
//         ? product.professional
//         : Math.floor((product.professional / rate) * 100) / 100
//       : product.professional;

//   setProfessional(prof);
//   setPersonal(pers);
// }, [preferences.currency, product, rate]);

// useEffect(() => {
//   if (!product) return;
//   setCurrency(LANGUAGE.CURRENCIES[preferences.currency]);
// }, [preferences.currency, product]);
