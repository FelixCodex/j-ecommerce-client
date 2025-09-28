import { useId, useState } from 'react';
import { CheckCircle2, CircleDashed, SettingsIcon } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { useAuth } from '../hooks/useAuth';
import { preferencesRequest } from '../Api/auth';
import { Currency, Language } from '../types';
import { usePreferences } from '../hooks/usePreferences';
import { saveInLocalStorage } from '../utils';
import { LANGUAGE } from '../consts';
import { useNavigate } from 'react-router-dom';
import { Toggle } from '../components/Toggle';

interface SubmitClickProps {
	e: React.MouseEvent;
}

type SettingsProps =
	| { preference: 'language'; value: Language }
	| { preference: 'notifications'; value: boolean }
	| { preference: 'currency'; value: Currency };

export default function Settings() {
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [errors, setErrors] = useState<[]>([]);
	const [saved, setSaved] = useState(false);
	const errorIdPrefix = useId();
	const { setUserPreferences } = useAuth();
	const { preferences, setPreferences } = usePreferences();
	const navigate = useNavigate();

	const handleSubmit = async ({ e }: SubmitClickProps) => {
		e.preventDefault();
		if (loadingSubmit) return;
		setLoadingSubmit(true);
		setSaved(false);
		try {
			const response = await preferencesRequest(preferences);
			if (!response) return;
			if (response.status == 200) {
				setSaved(true);
			} else {
				setErrors(response.data.error || ['Unknown error occurred']);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingSubmit(false);
		}
	};

	const handleSettingChange = ({ preference, value }: SettingsProps) => {
		const newState = { ...preferences, [preference]: value };
		setPreferences(newState);
		setUserPreferences(newState);
		saveInLocalStorage({ item: 'language', value: preferences.language });
		setSaved(false);
	};

	return (
		<main className='min-h-screen-minus-64 dottedBackground py-12'>
			<article className='max-w-7xl mx-auto px-4'>
				<section className='max-w-3xl mx-auto'>
					<h1 className='text-3xl font-bold text-center text-[--light_0] mb-8'>
						{LANGUAGE.SETTINGS.TITLE[preferences.language]}
					</h1>

					<div className='space-y-6'>
						<SettingsSection
							icon={<SettingsIcon className='h-6 w-6' />}
							title={LANGUAGE.SETTINGS.USER_PREF_TITLE[preferences.language]}
							description={
								LANGUAGE.SETTINGS.USER_PREF_DESCRIPTION[preferences.language]
							}
						>
							<div className='grid grid-cols-1 gap-6'>
								{/* Language Selection */}
								<div>
									<label className='block text-sm font-medium text-[--light_100] mb-1'>
										{LANGUAGE.SETTINGS.LANGUAGE[preferences.language]}
									</label>
									<select
										value={preferences.language}
										onChange={e =>
											handleSettingChange({
												preference: 'language',
												value: e.target.value as Language,
											})
										}
										className='w-full px-3 py-2 border border-[--light_500] bg-[--bg_prim] text-[--light_0] rounded-md focus:outline-none focus:ring-2 focus:ring-[--brand_color]'
									>
										<option value='en'>English</option>
										<option value='es'>Español</option>
									</select>
								</div>

								{/* Currency Selection */}
								<div>
									<label className='block text-sm font-medium text-[--light_100] mb-1'>
										{LANGUAGE.SETTINGS.CURRENCY[preferences.language]}
									</label>
									<select
										value={preferences.currency}
										onChange={e =>
											handleSettingChange({
												preference: 'currency',
												value: e.target.value as Currency,
											})
										}
										className='w-full px-3 py-2 border border-[--light_500] bg-[--bg_prim] text-[--light_0] rounded-md focus:outline-none focus:ring-2 focus:ring-[--brand_color]'
									>
										<option value='USD'>USD ($)</option>
										<option value='EUR'>EUR (€)</option>
									</select>
								</div>

								{/* Notifications Toggle */}
								<div className='space-y-4'>
									<Toggle
										label={LANGUAGE.SETTINGS.EMAIL[preferences.language]}
										description={
											LANGUAGE.SETTINGS.EMAIL_DESCRIPTION[preferences.language]
										}
										checked={preferences.notifications}
										onChange={() =>
											handleSettingChange({
												preference: 'notifications',
												value: !preferences.notifications,
											})
										}
									/>
								</div>
							</div>
						</SettingsSection>
					</div>

					{/* Error Messages */}
					{errors.length > 0 && (
						<div className='mt-4'>
							<div className='flex flex-col gap-1'>
								{errors.map((error, index) => (
									<p
										key={`${errorIdPrefix}-${index}`}
										className='text-sm'
										style={{ color: 'var(--wrong)' }}
									>
										{error}
									</p>
								))}
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className='mt-8 flex justify-end gap-3'>
						<button
							type='button'
							className='px-5 py-2 border border-transparent text-sm font-medium rounded-md text-[--light_900] bg-[--button] hover:bg-[--button_hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--bg_prim] focus:ring-[--brand_color]'
							onClick={() => {
								navigate('/dashboard');
							}}
						>
							{LANGUAGE.SETTINGS.BACK[preferences.language]}
						</button>
						<button
							type='button'
							className='px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[--light_900] bg-[--button] hover:bg-[--button_hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--bg_prim] focus:ring-[--brand_color]'
							onClick={e => {
								handleSubmit({ e });
							}}
							disabled={loadingSubmit}
						>
							{loadingSubmit ? (
								<CircleDashed className='loader w-4 h-4' />
							) : (
								<span className='flex flex-row justify-center items-center gap-1'>
									{LANGUAGE.SETTINGS.SAVE[preferences.language]}
									{saved && (
										<CheckCircle2 className='h-4 w-4 text-[--good]'></CheckCircle2>
									)}
								</span>
							)}
						</button>
					</div>
				</section>
			</article>
		</main>
	);
}
