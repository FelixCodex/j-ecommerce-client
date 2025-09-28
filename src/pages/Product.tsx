import { useEffect, useState } from 'react';
import { Product as ProductI } from '../types';
import { useLocation } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { ProductLicenseSelector } from '../components/ProductLicenseSelector';
import { ProductGallery } from '../components/ProductGallery';
import { ProductInformationSection } from '../components/ProductInformationSection';
import { AlertCircle } from 'lucide-react';
import { Loading } from './Loading';

export default function Product() {
	const { products, loadingProducts } = useProduct();

	const [product, setProduct] = useState<ProductI | null | undefined>(null);
	const location = useLocation();

	useEffect(() => {
		const id = location.pathname.slice(9);
		if (!products) return;
		const prods = products.find(el => el.id == id) as ProductI;
		const prod = prods ? prods : undefined;
		setProduct(prod);
	}, [location.pathname, products]);

	return (
		<main className={`relative w-full flex justify-center items-center`}>
			<article className='bg-[--bg_prim] h-full w-full max-w-[100rem]'>
				{loadingProducts ? (
					<Loading></Loading>
				) : product ? (
					<section className='p-8 flex w-full gap-2'>
						<div className='w-full grid grid-dis gap-6 grid-cols-1 lg:grid-cols-[1fr,var(--aside_width)]'>
							<ProductGallery product={product}></ProductGallery>

							<ProductInformationSection
								product={product}
							></ProductInformationSection>

							<ProductLicenseSelector
								product={product}
							></ProductLicenseSelector>
						</div>
					</section>
				) : (
					<section className='w-full flex items-center justify-center'>
						<div className='flex flex-col border-4 border-[--brand_color_400] mt-32 w-full md:w-fit p-12 md:p-20 lg:p-28 gap-2 md:gap-9 items-center rounded-full bg-[--bg_sec] justify-center'>
							<div className='flex'>
								<AlertCircle className='w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 text-[--brand_color]'></AlertCircle>
							</div>
							<p className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-[--brand_color]'>
								Sorry. This product doesn't exist
							</p>
						</div>
					</section>
				)}
			</article>
		</main>
	);
}

/*
<button
                      className={`relative w-full flex justify-between items-center p-4 border ${
                        license == null
                          ? licenseOpen
                            ? "border-[--brand_color]"
                            : "border-[--light_400] hover:border-[--light_300]"
                          : "border-[--brand_color]"
                      } rounded-xl`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLicenseOpen(!licenseOpen);
                      }}
                    >
                      <div className="flex flex-col justify-center items-start">
                        <span
                          className={`${
                            license == null
                              ? "text-normal font-bold text-[--light_200]"
                              : "text-normal font-medium text-[--light_200]"
                          } `}
                        >
                          {license == null
                            ? "Select a License"
                            : license == "personal"
                            ? "Personal"
                            : "Professional"}
                        </span>
                        <span
                          className={`${
                            license == null
                              ? "text-normal font-medium text-[--light_300]"
                              : "text-xl font-bold text-[--light_100]"
                          }`}
                        >
                          {license == null
                            ? `(From ${currency + personal} to ${
                                currency + professional
                              })`
                            : license == "personal"
                            ? currency + personal
                            : currency + professional}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-7 w-7 text-[--light_200] transition-transform duration-300 ${
                          licenseOpen && "rotate-180"
                        }`}
                      ></ChevronDown>
                    </button>
                    <div
                      className={`absolute p-2 ${
                        licenseOpen ? "flex" : "hidden"
                      } flex-col gap-2 text-[--light_0] top-[110%] h-fit left-0 border border-[--light_600] rounded-xl w-full bg-[#101625e8]`}
                    >
                      <button
                        className="flex gap-2 p-2 pr-4 items-start justify-center rounded-xl hover:bg-[#374151b0] cursor-pointer"
                        onClick={() => {
                          setLicenseOpen(false);
                          setLicense("personal");
                        }}
                      >
                        <div className="relative mt-[3px] w-5 h-5 flex rounded-full items-center justify-center bg-[--light_700]">
                          <i
                            className={`absolute w-[8px] h-2 ${
                              license == "personal" && "bg-[--brand_color]"
                            } rounded-full flex`}
                          ></i>
                        </div>
                        <div className="w-full rounded-xl flex flex-col items-start">
                          <span className="text-normal font-medium text-[--light_100]">
                            Personal
                          </span>
                          <p className="text-sm font-medium text-[--light_400] text-start">
                            For an individual creator or a small team with no
                            more than 100k of revenue or funding in the past 12
                            months
                          </p>
                          <span className="text-lg font-bold">
                            {currency + personal}
                          </span>
                        </div>
                      </button>
                      <button
                        className="flex gap-2 p-2 pr-4 items-start justify-center rounded-xl hover:bg-[#374151b0] cursor-pointer"
                        onClick={() => {
                          setLicenseOpen(false);
                          setLicense("professional");
                        }}
                      >
                        <div className="relative mt-[3px] w-5 h-5 flex rounded-full items-center justify-center bg-[--light_700]">
                          <i
                            className={`absolute w-[8px] h-2 ${
                              license == "professional" && "bg-[--brand_color]"
                            } rounded-full flex`}
                          ></i>
                        </div>
                        <div className="w-full rounded-xl flex flex-col items-start">
                          <span className="text-normal font-medium text-[--light_100]">
                            Professional
                          </span>
                          <p className="text-sm font-medium text-[--light_400] text-start">
                            For studios or other entities with over 100k of
                            revenue or funding in the past 12 months
                          </p>
                          <span className="text-lg font-bold">
                            {currency + professional}
                          </span>
                        </div>
                      </button>
                    </div>
*/
