import { useEffect, useRef, useState } from 'react';
import { Product } from '../types';
import { IMG_API_URL } from '../consts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ProductGallery({ product }: { product: Product }) {
	const [currentImage, setCurrentImage] = useState<string | null>(null);
	const galleryScroll = useRef<HTMLDivElement | null>(null);

	const handleMouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
		if (currentImage != e.currentTarget.src) {
			setCurrentImage(e.currentTarget.src);
		}
	};

	const handleGalleryScrollLeft = () => {
		if (galleryScroll.current == null) return;
		galleryScroll.current.scrollLeft -= 173;
	};

	const handleGalleryScrollRight = () => {
		if (galleryScroll.current == null) return;
		galleryScroll.current.scrollLeft += 173;
	};

	useEffect(() => {
		if (product) {
			setCurrentImage(`${IMG_API_URL}${product.image}.webp`);
		}
	}, [product]);

	return (
		<div className='w-full medias'>
			<div className='relative aspect-video bg-[--bg_sec] rounded-lg overflow-hidden group border-2 border-[--light_500]'>
				<img
					src={product.gallery ? `${currentImage}` : ''}
					alt={product.title}
					className='w-full h-full object-cover'
				/>
			</div>
			<div className='flex'>
				<div className='flex justify-center items-center md:p-2'>
					<button onClick={handleGalleryScrollLeft}>
						<ChevronLeft className='w-9 h-9 p-1 text-[--light_0] border border-transparent hover:hover:bg-[--bg_sec] hover:hover:border-[--light_400] transition-colors rounded-full'></ChevronLeft>
					</button>
				</div>
				<div
					ref={galleryScroll}
					style={{ scrollBehavior: 'smooth' }}
					className='w-full flex flex-row overflow-hidden max-w-full gap-2 mt-2'
				>
					<div className='h-24 aspect-video bg-[--bg_sec]'>
						<img
							key={'main-image'}
							src={`${IMG_API_URL}${product.image}.webp`}
							alt={`Preview main-image`}
							onMouseEnter={handleMouseEnter}
							className='object-contain aspect-video rounded-md border-2 border-[--light_500]'
						/>
					</div>

					{product.gallery ? (
						product.gallery.map((image, index) => (
							<div className='h-24 aspect-video bg-[--bg_sec]'>
								<img
									key={index}
									src={`${IMG_API_URL}${image}.webp`}
									alt={`Preview ${index + 1}`}
									onMouseEnter={handleMouseEnter}
									className='w-full h-full object-cover aspect-video rounded-md border-2 border-[--light_500]'
								/>
							</div>
						))
					) : (
						<></>
					)}
				</div>
				<div className='flex justify-center items-center md:p-2'>
					<button onClick={handleGalleryScrollRight}>
						<ChevronRight className='w-9 h-9 p-1 text-[--light_0] transition-colors border border-transparent hover:hover:bg-[--bg_sec] hover:hover:border-[--light_400] rounded-full'></ChevronRight>
					</button>
				</div>
			</div>
		</div>
	);
}
