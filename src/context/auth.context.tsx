import { createContext, useEffect, useState } from 'react';
import {
	loginRequest,
	logoutRequest,
	registerRequest,
	verifyTokenRequest,
} from '../Api/auth';
import { Preferences, UserInterface } from '../types';
import { useSocket } from '../hooks/useSocket';

interface AuthContextType {
	user: UserInterface | null;
	logged: boolean;
	loadingLog: boolean;
	signUp: (user: {
		password: string;
		username: string;
		email: string;
		remember: boolean;
	}) => Promise<void | unknown>;
	signIn: (user: {
		password: string;
		email: string;
		remember: boolean;
	}) => Promise<void | unknown>;
	signOut: () => void;
	setUserPreferences: (pref: Preferences) => void;
}

interface AuthProviderProps {
	children: import('react').ReactElement;
}

export const AuthContext = createContext<AuthContextType>({
	user: null,
	logged: false,
	loadingLog: true,
	signUp: async () => {},
	signIn: async () => {},
	signOut: async () => {},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setUserPreferences: async (pref: Preferences) => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<UserInterface | null>(null);
	const [logged, setLogged] = useState(false);
	const [loadingLog, setLoadingLog] = useState(true);
	const { connectUserToMessageChannel } = useSocket();

	const signUp = async (user: {
		password: string;
		username: string;
		email: string;
		remember: boolean;
	}) => {
		try {
			const res = await registerRequest(user);
			if (!res) throw new Error('Register request failed');
			setUser(res.data);
			setLogged(true);
			return res;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	const signIn = async (user: {
		password: string;
		email: string;
		remember: boolean;
	}) => {
		try {
			const res = await loginRequest(user);
			console.log(res);
			if (!res) throw new Error('Request failed');
			if (res.status == 200) {
				setUser(res.data);
				setLogged(true);
			}
			return res;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	const signOut = async () => {
		try {
			await logoutRequest();
			setUser(null);
			setLogged(false);
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	const verifyToken = async () => {
		try {
			const res = await verifyTokenRequest();
			if (!res) throw new Error('Request failed');

			if (!res.data) {
				setUser(null);
				setLoadingLog(false);
				return setLogged(false);
			}
			setUser({ ...res.data, preferences: res.data.preferences });
			connectUserToMessageChannel(res.data);
			setLogged(true);
			setLoadingLog(false);
		} catch (error) {
			console.log(error);
			setLogged(false);
			setUser(null);
			setLoadingLog(false);
		}
	};

	const setUserPreferences = (pref: Preferences) => {
		if (user) {
			const newState = {
				username: user.username,
				email: user.email,
				id: user.id,
				preferences: pref,
			};
			setUser(newState);
		}
	};

	useEffect(() => {
		verifyToken();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUserPreferences,
				loadingLog,
				logged,
				signUp,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
