import { InputTextSimple } from '../components/form/InputTextSimple';
import { ButtonSubmitSimple } from '../components/form/ButtonSubmitSimple';
import { SectionButton } from '../components/form/SectionButton';
import { Comment as CommentMessage } from '../components/Comment';
import { useState } from 'react';
import { Product, Sections } from '../types';
import { useComment } from '../hooks/useComment';
import { formatDateTime } from '../utils';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CircleDashed, Clock, X } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';
import { LANGUAGE } from '../consts';

export function ProductInformationSection({ product }: { product: Product }) {
	const [section, setSection] = useState<Sections>('info');
	const [message, setMessage] = useState('');
	const { preferences } = usePreferences();
	const {
		comments,
		createComment,
		commentsLoading,
		commentsError,
		loadingComments,
	} = useComment();
	const { user, logged } = useAuth();
	const navigate = useNavigate();

	const handleSubmitComment = (e: React.FormEvent) => {
		e.preventDefault();
		if (!logged) navigate('/login');
		if (!user || !product || message.length == 0) return;

		const dateA = new Date();
		const date = new Date(
			dateA.getFullYear(),
			dateA.getMonth(),
			dateA.getDate(),
			dateA.getHours() + dateA.getTimezoneOffset() / 60,
			dateA.getMinutes() - 1,
			dateA.getSeconds()
		);

		const uuid = window.crypto.randomUUID();

		createComment({
			id: uuid,
			userId: user.id,
			userName: user.username,
			productId: product.id,
			comment: message,
			created_at: `${formatDateTime(date)}`,
		});

		setMessage('');
	};

	const commentsAmount = comments
		? comments.filter(el => el.productId == product.id).length
		: 0;

	const commentFiltered = comments.filter(el => el.productId == product.id);

	const commentsLoadingFiltered = commentsLoading.filter(
		el => el.productId == product.id
	);
	const commentsErrorFiltered = commentsError.filter(
		el => el.productId == product.id
	);

	return (
		<div className='infos'>
			<div
				className='w-full rounded-xl h-16 flex p-2 gap-2 bg-gray-90'
				key={'Sections'}
			>
				<SectionButton
					id='info'
					text={LANGUAGE.PRODUCT.INFORMATION[preferences.language]}
					section={section}
					setSection={setSection}
				></SectionButton>
				<SectionButton
					id='comments'
					text={`${
						LANGUAGE.PRODUCT.COMMENTS[preferences.language]
					} (${commentsAmount})`}
					section={section}
					setSection={setSection}
				></SectionButton>
			</div>

			<div
				key={'Description'}
				className={`${
					section == 'info' ? 'flex' : 'hidden'
				} max-w-none flex-col p-4 mb-8`}
			>
				<h3 className='text-2xl font-bold text-[--light_100] mb-2'>
					{LANGUAGE.PRODUCT.DESCRIPTION[preferences.language]}
				</h3>
				<p className='[--light_0]space-pre-line text-lg font-medium text-[--light_200]'>
					{product.description}
				</p>
			</div>

			<div
				key={'Comments'}
				className={`${
					section == 'comments' ? 'flex' : 'hidden'
				} flex-col gap-4 w-full h-fit p-4 rounded-xl`}
			>
				<div className=''>
					<h3 className='text-2xl font-bold text-[--light_100]'>
						{`${commentsAmount} Comments`}
					</h3>
				</div>
				<div>
					<div className='flex flex-col'>
						<label className='text-md text-[--light_100]'>
							{LANGUAGE.PRODUCT.ADD_COMMENT[preferences.language]}
						</label>
						<form
							className='flex flex-col md:flex-row items-end md:items-center justify-center gap-2'
							onSubmit={handleSubmitComment}
						>
							<InputTextSimple
								className='rounded-xl'
								id='comment'
								value={message}
								setValue={setMessage}
								placeholder={
									LANGUAGE.PRODUCT.WRITE_COMMENT[preferences.language]
								}
							></InputTextSimple>
							<ButtonSubmitSimple
								text={LANGUAGE.PRODUCT.COMMENT[preferences.language]}
								type='submit'
								className='w-full md:w-64 rounded-xl'
								loginRequired
								loginRequiredText='Login to comment'
								logged={logged}
							></ButtonSubmitSimple>
						</form>
					</div>
				</div>
				<div className='flex flex-col gap-4'>
					{loadingComments ? (
						<div className='flex items-center justify-center gap-2'>
							<CircleDashed className='w-6 h-6 loader text-[--light_50]'></CircleDashed>
							<p className='text-center text-xl font-medium text-[--light_100]'>
								{LANGUAGE.PRODUCT.LOADING_COMMENTS[preferences.language]}
							</p>
						</div>
					) : (
						<>
							{commentsErrorFiltered.length != 0 &&
								commentsErrorFiltered.map(c => (
									<CommentMessage
										username={c.userName}
										message={c.comment}
										date={c.created_at}
										icon={<X className='h-5 w-5 text-[--light_200]'></X>}
									></CommentMessage>
								))}
							{commentsLoadingFiltered.length != 0 &&
								commentsLoadingFiltered.map(c => (
									<CommentMessage
										username={c.userName}
										message={c.comment}
										date={c.created_at}
										icon={
											<Clock className='h-5 w-5 text-[--light_200]'></Clock>
										}
									></CommentMessage>
								))}
							{commentFiltered.length != 0 ? (
								commentFiltered.map(c => {
									return (
										<CommentMessage
											username={c.userName}
											message={c.comment}
											date={c.created_at}
										></CommentMessage>
									);
								})
							) : (
								<div>
									<p className='w-full text-center text-xl font-medium mt-2 text-[--light_100]'>
										{LANGUAGE.PRODUCT.NO_COMMENTS[preferences.language]}
									</p>
									<p className='w-full text-center text-xl font-medium text-[--light_100]'>
										{LANGUAGE.PRODUCT.BE_FIRST[preferences.language]}
									</p>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
