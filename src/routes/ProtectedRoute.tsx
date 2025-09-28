import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import { replaceString } from '../utils.ts';
import { Loading } from '../pages/Loading.tsx';

// function BG_Loader() {
//   return (
//     <div
//       title="Loading..."
//       className="w-full h-44 bg-[--protected_loading] bg-loader rounded-2xl"
//     ></div>
//   );
// }

export default function ProtectedRoute() {
	const { logged, loadingLog } = useAuth();
	const location = useLocation();
	const path = replaceString(location.pathname, '/', '-');

	if (loadingLog) return <Loading></Loading>;
	if (!loadingLog && !logged)
		return (
			<Navigate
				to={`/login?path=${path}`}
				replace
			></Navigate>
		);

	return <Outlet></Outlet>;
}
