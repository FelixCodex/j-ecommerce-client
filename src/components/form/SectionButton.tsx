import { Sections } from '../../types';

export function SectionButton({
	id,
	text,
	section,
	setSection,
}: {
	id: Sections;
	text: string;
	section: Sections;
	setSection: React.Dispatch<React.SetStateAction<Sections>>;
}) {
	return (
		<button
			className={`${
				section == id ? 'bg-[--brand_color] text-[--light_800]' : ''
			} w-40 h-full rounded-lg text-lg border border-[--brand_color] text-[--light_0]`}
			onClick={() => {
				setSection(id);
			}}
		>
			{text}
		</button>
	);
}
