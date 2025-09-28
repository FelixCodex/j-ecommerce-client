import { CircleDashed, XCircleIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePreferences } from '../hooks/usePreferences';
import { BRANDNAME, LANGUAGE } from '../consts';
import { createDateTextFromLanguage, getUrlParam } from '../utils';
import { getPaymentRequest } from '../Api/payment';
import { CartProduct } from '../types';

export default function About() {
	const { preferences } = usePreferences();
	const [loadingPayment, setLoadingPayment] = useState(true);
	const [cart, setCart] = useState<CartProduct[]>([] as CartProduct[]);
	const [order, setOrder] = useState<string | null>('');
	const [date, setDate] = useState<string | null>('');
	const [price, setPrice] = useState<string | null>('');
	const [payId, setPayId] = useState<string | null>('');
	const navigate = useNavigate();
	const orderCId = useId();
	const itemsCId = useId();

	useEffect(() => {
		const getPaymentInfo = async () => {
			const reference = getUrlParam('reference');
			const bankOrder = getUrlParam('bankOrderCode');
			if (reference == null) return navigate('/');
			if (bankOrder == null) return navigate('/');

			try {
				const res = await getPaymentRequest(reference);
				if (!res) return;
				if (res.status == 200) {
					setLoadingPayment(false);
					console.log(res);
					if (res.data.state == '2') {
						return navigate(
							`/payment/success?bankOrderCode=${bankOrder}&reference=${reference}`
						);
					}
					setCart(res.data.cart);
					setOrder(bankOrder);
					setDate(res.data.created_at);
					setPrice(res.data.price);
					setPayId(res.data.id);
					return;
				}
				console.log('Payment status not 200, going to home');
				console.log(res);
				return navigate('/');
			} catch (error) {
				console.log('Error fetching payment');
				console.log(error);
				return navigate('/');
			}
		};
		getPaymentInfo();
	}, []);

	return (
		<div className='min-h-screen-minus-64 bg-[--bg_prim] py-12'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='max-w-3xl mx-auto'>
					<div
						className={`bg-[--bg_sec] rounded-lg shadow-md p-8 ${
							loadingPayment && 'py-11'
						}`}
					>
						<div
							className={`${
								loadingPayment ? 'flex' : 'hidden'
							} justify-center items-center gap-3`}
						>
							<CircleDashed className='h-16 w-16 loader text-[--light_0]'></CircleDashed>
							<span className='text-4xl text-[--light_0]'>Loading...</span>
						</div>
						<div className={`${loadingPayment && 'hidden'}`}>
							<p className='text-5xl font-bold text-center mb-4 flex justify-center items-center gap-3'>
								<XCircleIcon className='h-20 w-20 text-[--wrong]'></XCircleIcon>
								<span className='text-[--light_0]'>
									{LANGUAGE.PAY_FAILED.TITLE[preferences.language]}
								</span>
							</p>
							<div className='flex justify-center items-center mb-10'></div>

							<p className='text-lg text-[--light_0] mb-6'>
								{LANGUAGE.PAY_FAILED.TEXT1[preferences.language]}
							</p>
							<p className='text-lg text-[--light_0] mb-6'>
								{LANGUAGE.PAY_FAILED.TEXT2[preferences.language]}
							</p>
							<p className='text-lg font-bold text-[--light_0] mb-6'>
								{LANGUAGE.PAY_FAILED.TEXT3[preferences.language]}
							</p>
							<p className='text-lg font-bold text-[--light_0] mb-6'>
								{LANGUAGE.PAY_FAILED.TEXT4[preferences.language]}
							</p>
							<p className='text-lg text-[--light_0]'>
								{LANGUAGE.PAY_FAILED.GREETINGS[preferences.language]},
							</p>
							<p className='text-lg font-bold text-[--light_0] mb-10'>
								{BRANDNAME}.
							</p>

							<div className='flex flex-col sm:flex-row gap-4 mb-10'>
								<Link
									to='/'
									className='w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-2xl font-medium rounded-md text-[--light_900] bg-[--button] hover:bg-[--button_hover] transition-colors duration-200'
									onClick={() => window.scrollTo({ top: 0 })}
								>
									{LANGUAGE.PAY_FAILED.HOME[preferences.language]}
								</Link>
								<Link
									to='/cart'
									className='w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-2xl font-medium rounded-md text-[--light_900] bg-[--button] hover:bg-[--button_hover] transition-colors duration-200'
									onClick={() => window.scrollTo({ top: 0 })}
								>
									{LANGUAGE.PAY_FAILED.CART[preferences.language]}
								</Link>
							</div>

							<div className='bg-[--bg_prim] p-5 rounded-md'>
								<h2
									key={orderCId}
									className='text-xl text-[--light_0] font-semibold mb-4'
								>
									{LANGUAGE.PAY_FAILED.DETAILS[preferences.language]}
								</h2>
								<div key={'chrc-0' + itemsCId}>
									<h3 className='text-lg font-medium text-[--light_0]'>
										{LANGUAGE.PAY_FAILED.PRODUCTS[preferences.language]}
									</h3>
								</div>
								<div
									key={itemsCId}
									className='border-t border-b border-[--light_400] py-4 my-3'
								>
									{cart.map(prod => {
										return (
											<>
												<div
													key={'chrp-' + prod.id + itemsCId}
													className='flex justify-between items-center'
												>
													<div key={'chrp-0' + prod.id + itemsCId}>
														<h3 className='font-medium text-[--light_0]'>
															{prod.title}
														</h3>
													</div>
													<span
														key={'chrp-1' + prod.id + itemsCId}
														className='font-semibold text-[--light_0]'
													>
														${prod[prod.license]}
													</span>
												</div>
											</>
										);
									})}
								</div>
								<div
									key={'chra-' + itemsCId}
									className='flex justify-between items-center  mb-3'
								>
									<div key={'chra-0' + itemsCId}>
										<h3 className='text-lg font-medium text-[--light_0]'>
											{LANGUAGE.PAY_FAILED.AMOUNT[preferences.language]}
										</h3>
									</div>
									<span
										key={'chra-1' + itemsCId}
										className='font-semibold text-[--light_0]'
									>
										${price}
									</span>
								</div>
								<div
									key={'chro-' + itemsCId}
									className='flex justify-between items-center  mb-3'
								>
									<div key={'chro-0' + itemsCId}>
										<h3 className='text-md sm:text-lg  font-medium text-[--light_0]'>
											{LANGUAGE.PAY_FAILED.ORDER[preferences.language]}
										</h3>
									</div>
									<span
										key={'chro-1' + itemsCId}
										className='font-semibold text-sm sm:text-lg text-[--light_0]'
									>
										{order}
									</span>
								</div>
								<div
									key={'chri-' + itemsCId}
									className='flex justify-between items-center  mb-3'
								>
									<div key={'chri-0' + itemsCId}>
										<h3 className='text-md sm:text-lg  font-medium text-[--light_0]'>
											{LANGUAGE.PAY_SUCCESS.PAY_ID[preferences.language]}
										</h3>
									</div>
									<span
										key={'chri-1' + itemsCId}
										className='font-semibold text-sm sm:text-lg text-[--light_0]'
									>
										{payId}
									</span>
								</div>
								<div
									key={'chrd-' + itemsCId}
									className='flex justify-between items-center  mb-3'
								>
									<div key={'chrd-0' + itemsCId}>
										<h3 className='text-md sm:text-lg  font-medium text-[--light_0]'>
											{LANGUAGE.PAY_FAILED.DATE[preferences.language]}
										</h3>
									</div>
									<span
										key={'chrd-1' + itemsCId}
										className='font-semibold text-sm sm:text-lg text-[--light_0]'
									>
										{createDateTextFromLanguage(
											preferences.language,
											new Date(`${date}`)
										)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
