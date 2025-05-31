import { ArrowDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LANGUAGE } from '../consts';
import { useAuth } from '../hooks/useAuth';
import { usePreferences } from '../hooks/usePreferences';
import { Store } from './Store';
import '../App.css';

export default function Welcome() {
	const { logged } = useAuth();
	const { preferences } = usePreferences();

	const handleScroll = () => {
		if (logged) {
			const welcomeElement = document.querySelector('#welcome');
			if (welcomeElement) {
				scrollToPosition(welcomeElement.clientHeight);
			}
		} else {
			scrollToPosition(0);
		}
	};

	const scrollToPosition = (position: number) => {
		window.scrollTo({
			behavior: 'smooth',
			top: position,
		});
	};

	return (
		<main>
			<section
				id='welcome'
				className='bg-gradient-to-br h-[30rem] sm:h-[40rem] flex items-center justify-center from-amber-100 via-[--bg_prim] to-orange-100'
			>
				<div className='max-w-7xl flex items-center justify-center mx-auto px-4 sm:px-6 lg:px-8'>
					<article className='text-center'>
						{/* Hero Header */}
						<header>
							<h1 className='text-4xl font-extrabold text-[--text_light_0] sm:text-5xl md:text-6xl'>
								<span className='block'>
									{LANGUAGE.WELCOME.HERO_WELCOME[preferences.language]}
								</span>
							</h1>
							<p className='text-[11rem] sm:text-[18rem] md:text-[21rem] lg:text-[26rem] leading-[10rem] sm:leading-[16rem] md:leading-[22rem] font-bold text-[--text_light_300] max-w-7xl mx-auto'>
								<span className='v1 fill-transp bg-clip-text bg-cover font-sans'>
									A
								</span>
								<span className='v2 fill-transp bg-clip-text bg-cover font-sans'>
									R
								</span>
								<span className='v3 fill-transp bg-clip-text bg-cover font-sans'>
									T
								</span>
							</p>
						</header>

						{/* Call to Action Buttons */}
						<nav className='mt-6 flex justify-center gap-3'>
							<div className='relative'>
								{!logged && (
									<div className='rounded-full w-full grow-2 h-full top-0 px-6 md:px-4 py-2 flex z-20 bg-[--button] absolute' />
								)}
								<Link
									to={logged ? '#store' : '/login'}
									className={`
                    inline-flex group items-center relative px-6 py-3 border z-40 
                    border-transparent text-base font-medium rounded-full 
                    text-[--text_light_900] bg-[--button] hover:bg-[--button_hover] 
                    transition-colors duration-200
                    ${!logged ? 'palpite-1' : ''}
                  `}
									onClick={handleScroll}
								>
									{logged ? (
										<>
											{LANGUAGE.WELCOME.HERO_BUTTON_SEE[preferences.language]}
											<ArrowDown className='ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300' />
										</>
									) : (
										<>
											{LANGUAGE.WELCOME.HERO_BUTTON_START[preferences.language]}
											<ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300' />
										</>
									)}
								</Link>
							</div>
							<Link
								to='/contact'
								className='inline-flex items-center px-6 py-3 border 
                  border-[--border_light_300] text-base font-medium rounded-full 
                  text-[--text_light_100] bg-[--bg_light_900] hover:bg-[--bg_light_700] 
                  transition-colors duration-200'
							>
								{LANGUAGE.WELCOME.HERO_BUTTON_CONTACT[preferences.language]}
							</Link>
						</nav>
					</article>
				</div>
			</section>
			<Store></Store>
		</main>
	);
}
