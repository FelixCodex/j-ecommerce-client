import { LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import PurchasedProducts from './PurchasedProducts.tsx';
import { LANGUAGE } from '../consts.ts';
import { usePreferences } from '../hooks/usePreferences.tsx';
import { useChat } from '../hooks/useChat.tsx';

export default function Dashboard() {
	const { user, signOut } = useAuth();
	const { clearCart, clearPurchased } = useCart();
	const { preferences } = usePreferences();
	const { setIsChatOpen, clearChat } = useChat();

	const handleLogOutClick = () => {
		signOut();
		clearCart();
		clearPurchased();
		setIsChatOpen(false);
		clearChat();
	};

	return (
		<main className='min-h-screen-minus-64 dottedBackground'>
			<article className='max-w-7xl mx-auto px-4 py-8'>
				<section className='grid grid-cols-1 gap-6'>
					<div className='lg:col-span-1'>
						<div className='bg-[--bg_sec] flex gap-4 md:gap-0 justify-between flex-col md:flex-row items-start md:items-center rounded-lg shadow-md p-7'>
							<div className='flex flex-col items-start gap-1'>
								<h2
									className={`${
										user
											? user.username.length > 10
												? user.username.length > 18
													? 'text-lg md:text-xl'
													: 'text-xl md:text-3xl'
												: 'text-4xl'
											: 'text-4xl'
									} font-semibold text-[--light_0]`}
								>
									Hola, {user ? user.username : 'Default Calaboca de CApain'}
								</h2>
								<p className='text-[--light_200] text-xl'>
									{user ? user.email : 'defaultemail@gmail.com'}
								</p>
							</div>
							<nav className=' flex flex-row-reverse md:flex-col w-full md:w-44 gap-3'>
								<Link
									to='/dashboard/settings'
									className='flex w-full justify-center border border-[--light_400] items-center px-4 py-2 text-[--light_200]  hover:bg-[--bg_prim] rounded-lg'
								>
									<Settings className='h-5 w-5 mr-3' />
									<>{LANGUAGE.DASHBOARD.SETTINGS[preferences.language]}</>
								</Link>
								<Link
									to='/login'
									className='flex w-full justify-center border border-[--light_400] items-center px-4 py-2 text-[--light_200] hover:bg-[--bg_prim] rounded-lg'
									onClick={handleLogOutClick}
								>
									<LogOut className='h-5 w-5 mr-3' />
									<>{LANGUAGE.DASHBOARD.LOGOUT[preferences.language]}</>
								</Link>
							</nav>
						</div>
					</div>
					<PurchasedProducts />
				</section>
			</article>
		</main>
	);
}
