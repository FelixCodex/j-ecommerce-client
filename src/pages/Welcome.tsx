import { Link, useNavigate } from 'react-router-dom';
import { IMG_API_URL, LANGUAGE } from '../consts';
import { useAuth } from '../hooks/useAuth';
import { usePreferences } from '../hooks/usePreferences';
import '../App.css';
import { useProduct } from '../hooks/useProduct';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

export default function Welcome() {
	const { logged } = useAuth(); // Asumo que useAuth está definido
	const { preferences } = usePreferences(); // Asumo que usePreferences está definido

	return (
		// Contenedor principal: Altura completa, fondo oscuro con degradado sutil
		<article className=' overflow-x-hidden'>
			<section
				id='welcome'
				className='relative min-h-screen h-screen flex pt-[14vh] md:pt-6 items-start md:items-center justify-center overflow-visible p-6 bg-[--bg_bg_prim]'
			>
				{/* Fondo Decorativo 1 (Esquina superior derecha): Un 'glow' más sutil y angular para un toque moderno */}
				<div
					className='absolute top-0 right-0 w-96 h-96 opacity-15 
                      bg-[--brand_color] transform rotate-45 blur-[100px] 
                      pointer-events-none'
				/>

				{/* Fondo Decorativo 2 (Esquina inferior izquierda): Para equilibrar el diseño */}
				<div
					className='absolute bottom-0 left-0 w-80 h-80 opacity-10 
                      bg-[--brand_color_100] transform -rotate-45 blur-[80px] 
                      pointer-events-none'
				/>

				{/* Contenido principal centrado */}
				<div className='relative z-10 max-w-5xl w-full text-center'>
					{/* Título Principal (Hero Title) */}
					<h1 className='text-6xl sm:text-7xl md:text-8xl font-black leading-tight tracking-tighter'>
						{/* Primera línea: Texto claro y fuerte */}
						<span className='block text-[--light_0]'>
							{/* {LANGUAGE.WELCOME.HERO_WELCOME[preferences.language]} */}
							The Digital Foundry of
						</span>

						{/* Segunda línea (Destacada): Gradiente vibrante y audaz */}
						<span
							className='block text-transparent bg-clip-text 
                           bg-gradient-to-r from-[--brand_color] to-[--brand_color_100]'
						>
							3D ASSETS
						</span>
					</h1>

					{/* Subtítulo / Descripción */}
					<p className='mt-6 text-xl sm:text-2xl text-[--light_200] max-w-3xl mx-auto font-light'>
						{/* {LANGUAGE.WELCOME.HERO_SUBTITLE[preferences.language]} */}
						Get instant access to a curated collection of high-fidelity,
						ready-to-use 3D models. Built with precision for your next game,
						film, or architectural project
					</p>

					{/* Contenedor de Botones (Más profesional y espaciado) */}
					<div className='mt-12 flex flex-wrap gap-5 justify-center'>
						{/* Botón Principal (Destacado y de acción clara) */}
						<Link
							to={logged ? '#store' : '/login'}
							className='group px-10 py-4 rounded-full font-bold text-xl 
                       bg-[--brand_color] text-[--bg_prim] shadow-2xl shadow-[--brand_color]/30
                       hover:bg-[--brand_color_100] hover:shadow-[--brand_color_100]/50
                       transform hover:scale-[1.03] transition-all duration-300 ease-in-out'
						>
							{logged
								? LANGUAGE.WELCOME.HERO_BUTTON_SEE[preferences.language] // "Ver Creaciones"
								: LANGUAGE.WELCOME.HERO_BUTTON_START[preferences.language]}
						</Link>

						{/* Botón Secundario (Estilo 'Ghost' o con borde sutil) */}
						<Link
							to='/contact'
							className='p-4 px-8 flex items-center justify-center rounded-full font-semibold text-xl border border-[--brand_color] 
                       text-[--brand_color] hover:bg-[--brand_color] hover:text-[--bg_prim] 
                       transition-all duration-300'
						>
							{LANGUAGE.WELCOME.HERO_BUTTON_CONTACT[preferences.language]}
						</Link>
					</div>
				</div>
			</section>
			<Store />
		</article>
	);
}

export function Store() {
	const { products } = useProduct();
	const { preferences } = usePreferences();
	const navigate = useNavigate();

	const handleProductClick = (productId: string) => {
		navigate(`/product/${productId}`);
		window.scrollTo({ top: 0 });
	};

	const renderProductGrid = (products: Product[]) => (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
			{products.map(product => (
				<ProductCard
					key={product.id}
					product={product}
					onClick={() => handleProductClick(product.id)}
				/>
			))}
		</div>
	);

	return (
		<section
			id='store'
			className='min-h-screen bg-[--bg_sec] dottedBackground py-8 px-6'
		>
			<div className='max-w-6xl mx-auto'>
				<header className='mb-12 text-center flex items-center justify-center'>
					<h1 className='text-4xl font-bold text-[--light_0] tracking-wide bg-[--bg_prim] w-fit py-4 border-b-2 border-[--brand_color]'>
						{LANGUAGE.STORE.TITLE[preferences.language]}
					</h1>
				</header>

				<section>{products ? renderProductGrid(products) : null}</section>
			</div>
		</section>
	);
}

export function ProductCard({
	product,
	onClick,
}: {
	product: Product;
	onClick: () => void;
}) {
	const { rate } = useCart();
	const { preferences } = usePreferences();

	return (
		<div
			onClick={onClick}
			className='group cursor-pointer flex flex-col rounded-xl overflow-hidden 
                 bg-[--bg_thir] shadow-[--light_500] hover:shadow-xl 
                 transform hover:-translate-y-1 transition-all duration-300'
		>
			{/* Imagen */}
			<div className='aspect-video bg-[--light_700]'>
				<img
					src={`${IMG_API_URL}${product.image}.webp`}
					alt={product.title}
					className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
				/>
			</div>

			{/* Contenido */}
			<div className='p-4 flex h-full justify-between items-center'>
				<h3 className='font-semibold text-lg text-[--light_0] group-hover:text-[--brand_color] transition-colors'>
					{product.title}
				</h3>
				<div className='text-right font-bold text-[--brand_color]'>
					{product.isFree ? (
						<span>{LANGUAGE.PRODUCT_BUTTON.FREE[preferences.language]}</span>
					) : (
						<>
							<span className='block text-sm text-[--light_200]'>
								{LANGUAGE.PRODUCT_BUTTON.FROM[preferences.language]}
							</span>
							<span className='text-lg'>
								{LANGUAGE.CURRENCIES[preferences.currency]}
								{(preferences.currency === 'USD'
									? product.personal / rate
									: product.personal
								).toFixed(2)}
							</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

// export default function Welcome() {
// 	const { logged } = useAuth();
// 	const { preferences } = usePreferences();

// 	const handleScroll = () => {
// 		if (logged) {
// 			const welcomeElement = document.querySelector('#welcome');
// 			if (welcomeElement) {
// 				scrollToPosition(welcomeElement.clientHeight);
// 			}
// 		} else {
// 			scrollToPosition(0);
// 		}
// 	};

// 	const scrollToPosition = (position: number) => {
// 		window.scrollTo({
// 			behavior: 'smooth',
// 			top: position,
// 		});
// 	};

// 	return (
// 		<main>
// 			<section
// 				id='welcome'
// 				className='bg-gradient-to-br h-[30rem] sm:h-[40rem] flex items-center justify-center from-amber-100 via-[--bg_prim] to-orange-100'
// 			>
// 				<div className='max-w-7xl flex items-center justify-center mx-auto px-4 sm:px-6 lg:px-8'>
// 					<article className='text-center'>
// 						{/* Hero Header */}
// 						<header>
// 							<h1 className='text-4xl font-extrabold text-[--light_0] sm:text-5xl md:text-6xl'>
// 								<span className='block'>
// 									{LANGUAGE.WELCOME.HERO_WELCOME[preferences.language]}
// 								</span>
// 							</h1>
// 							<p className='text-[11rem] sm:text-[18rem] md:text-[21rem] lg:text-[26rem] leading-[10rem] sm:leading-[16rem] md:leading-[22rem] font-bold text-[--light_300] max-w-7xl mx-auto'>
// 								<span className='v1 fill-transp bg-clip-text bg-cover font-sans'>
// 									A
// 								</span>
// 								<span className='v2 fill-transp bg-clip-text bg-cover font-sans'>
// 									R
// 								</span>
// 								<span className='v3 fill-transp bg-clip-text bg-cover font-sans'>
// 									T
// 								</span>
// 							</p>
// 						</header>

// 						{/* Call to Action Buttons */}
// 						<nav className='mt-6 flex justify-center gap-3'>
// 							<div className='relative'>
// 								{!logged && (
// 									<div className='rounded-full w-full grow-2 h-full top-0 px-6 md:px-4 py-2 flex z-20 bg-[--button] absolute' />
// 								)}
// 								<Link
// 									to={logged ? '#store' : '/login'}
// 									className={`
//                     inline-flex group items-center relative px-6 py-3 border z-40
//                     border-transparent text-base font-medium rounded-full
//                     text-[--light_900] bg-[--button] hover:bg-[--button_hover]
//                     transition-colors duration-200
//                     ${!logged ? 'palpite-1' : ''}
//                   `}
// 									onClick={handleScroll}
// 								>
// 									{logged ? (
// 										<>
// 											{LANGUAGE.WELCOME.HERO_BUTTON_SEE[preferences.language]}
// 											<ArrowDown className='ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300' />
// 										</>
// 									) : (
// 										<>
// 											{LANGUAGE.WELCOME.HERO_BUTTON_START[preferences.language]}
// 											<ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300' />
// 										</>
// 									)}
// 								</Link>
// 							</div>
// 							<Link
// 								to='/contact'
// 								className='inline-flex items-center px-6 py-3 border
//                   border-[--light_300] text-base font-medium rounded-full
//                   text-[--light_100] bg-[--light_900] hover:bg-[--light_700]
//                   transition-colors duration-200'
// 							>
// 								{LANGUAGE.WELCOME.HERO_BUTTON_CONTACT[preferences.language]}
// 							</Link>
// 						</nav>
// 					</article>
// 				</div>
// 			</section>
// 			<Store></Store>
// 		</main>
// 	);
// }
