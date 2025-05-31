import { Suspense, lazy } from 'react';
import { useHandleLoad } from '../hooks/useHandleLoad.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from '../components/Navbar.tsx';
import { LoadingBarWrapper } from '../components/Elements/LoadingBarWrapper.tsx';
import { LoadingWrapper } from '../components/Elements/LoadingWrapper.tsx';
import { Footer } from '../components/Footer.tsx';
import { usePreferences } from '../hooks/usePreferences.tsx';
import { Chat } from '../components/Chat.tsx';

const Welcome = lazy(() => import('../pages/Welcome.tsx'));
const Dashboard = lazy(() => import('../pages/Dashboard.tsx'));
const PaymentSuccess = lazy(() => import('../pages/PaymentSuccess.tsx'));
const PaymentFailed = lazy(() => import('../pages/PaymentFailed.tsx'));
const Settings = lazy(() => import('../pages/Settings.tsx'));
const Login = lazy(() => import('../pages/Login.tsx'));
const Register = lazy(() => import('../pages/Register.tsx'));
const Checkout = lazy(() => import('../pages/Checkout.tsx'));
const Contact = lazy(() => import('../pages/Contact.tsx'));
const Cart = lazy(() => import('../pages/Cart.tsx'));
const ProtectedRoute = lazy(() => import('../routes/ProtectedRoute.tsx'));
const Product = lazy(() => import('../pages/Product.tsx'));
const Redirect = lazy(() => import('../pages/Redirect.tsx'));

export function AppRouter() {
	const { handleLoad } = useHandleLoad();
	usePreferences();

	return (
		<Router>
			<main className='min-h-screen mt-16'>
				<Navbar />
				<Chat />
				<Suspense fallback={<LoadingBarWrapper />}>
					<Routes>
						<Route
							path='/'
							element={
								<LoadingWrapper onMount={handleLoad}>
									<Welcome />
								</LoadingWrapper>
							}
						/>
						<Route
							path='/login'
							element={
								<LoadingWrapper onMount={handleLoad}>
									<Login />
								</LoadingWrapper>
							}
						/>
						<Route
							path='/register'
							element={
								<LoadingWrapper onMount={handleLoad}>
									<Register />
								</LoadingWrapper>
							}
						/>
						<Route
							path='/product/:id'
							element={
								<LoadingWrapper onMount={handleLoad}>
									<Product />
								</LoadingWrapper>
							}
						/>
						<Route
							path='/app/auth/google/callback'
							element={
								<LoadingWrapper onMount={handleLoad}>
									<Redirect />
								</LoadingWrapper>
							}
						/>
						<Route
							path='/contact'
							element={
								<LoadingWrapper onMount={handleLoad}>
									<Contact />
								</LoadingWrapper>
							}
						/>
						<Route
							path='/payment/success'
							element={
								<LoadingWrapper onMount={handleLoad}>
									<PaymentSuccess />
								</LoadingWrapper>
							}
						/>
						<Route
							path='/payment/failed'
							element={
								<LoadingWrapper onMount={handleLoad}>
									<PaymentFailed />
								</LoadingWrapper>
							}
						/>

						<Route element={<ProtectedRoute />}>
							<Route
								path='/dashboard/*'
								element={
									<LoadingWrapper onMount={handleLoad}>
										<Dashboard />
									</LoadingWrapper>
								}
							/>
							<Route
								path='/dashboard/settings'
								element={
									<LoadingWrapper onMount={handleLoad}>
										<Settings />
									</LoadingWrapper>
								}
							/>
							<Route
								path='/checkout'
								element={
									<LoadingWrapper onMount={handleLoad}>
										<Checkout />
									</LoadingWrapper>
								}
							/>
							<Route
								path='/cart'
								element={
									<LoadingWrapper onMount={handleLoad}>
										<Cart />
									</LoadingWrapper>
								}
							/>
						</Route>
					</Routes>
				</Suspense>
			</main>
			<Footer></Footer>
		</Router>
	);
}
