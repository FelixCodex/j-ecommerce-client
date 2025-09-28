import { CheckCircle2, CircleDashed } from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useAuth } from '../hooks/useAuth';
import { LANGUAGE } from '../consts';
import { usePreferences } from '../hooks/usePreferences';
import { ODivisor } from '../components/ODivisor';
import { GoogleButton } from '../components/GoogleButton';
import { InputText } from '../components/form/InputTextAuth';
import { InputPasswordRepeat } from '../components/form/InputPasswordRepeat';

interface RegisterFormData {
	email: string;
	username: string;
	password: string;
	password2: string;
}

interface ValidationState {
	username: boolean | null;
	email: boolean | null;
	password: boolean | null;
}

interface ShakeState {
	username: boolean;
	email: boolean;
	password: boolean;
}

interface SignUpResponse {
	status: number;
	response?: {
		data: string[];
	};
}

export default function Register() {
	const [formData, setFormData] = useState<RegisterFormData>({
		email: '',
		username: '',
		password: '',
		password2: '',
	});

	const [validation, setValidation] = useState<ValidationState>({
		username: null,
		email: null,
		password: null,
	});

	const [shakeState, setShakeState] = useState<ShakeState>({
		username: false,
		email: false,
		password: false,
	});

	const [errors, setErrors] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [rememberMe, setRememberMe] = useState<boolean>(false);

	const { signUp, logged, user } = useAuth();
	const navigate = useNavigate();
	const { preferences } = usePreferences();

	const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const { username, email, password } = validation;

		if (username && email && password) {
			setIsLoading(true);

			try {
				const response = (await signUp({
					username: formData.username,
					email: formData.email,
					password: formData.password,
					remember: rememberMe,
				})) as SignUpResponse;

				if (response.status === 200) {
					setIsSuccess(true);
					resetForm();
				} else if (response.response?.data) {
					setErrors(response.response.data);
				}
			} catch (error) {
				console.error('Registration error:', error);
			} finally {
				setIsLoading(false);
			}
		} else {
			triggerValidationFeedback();
		}
	};

	const triggerValidationFeedback = () => {
		const newShakeState = { ...shakeState };
		const newValidation = { ...validation };

		if (!validation.username) {
			newShakeState.username = true;
			newValidation.username = false;
		}

		if (!validation.email) {
			newShakeState.email = true;
			newValidation.email = false;
		}

		if (!validation.password) {
			newShakeState.password = true;
			newValidation.password = false;
		}

		setShakeState(newShakeState);
		setValidation(newValidation);

		// Reset shake animations after they complete
		setTimeout(() => {
			setShakeState({
				username: false,
				email: false,
				password: false,
			});
		}, 500);
	};

	useEffect(() => {
		if (logged) navigate('/');
	}, [logged, navigate]);

	const validateUsername = (value: string) => {
		const isValid = value.length >= 3;
		setValidation(prev => ({ ...prev, username: isValid }));
		return isValid;
	};

	const validateEmail = (value: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValid = emailRegex.test(value);
		setValidation(prev => ({ ...prev, email: isValid }));
		return isValid;
	};

	const validatePassword = (value: string, value2: string) => {
		const isValid = value.length >= 6 && value2.length >= 6 && value === value2;
		setValidation(prev => ({ ...prev, password: isValid }));
		return isValid;
	};

	// Reset form to initial state
	const resetForm = () => {
		setFormData({
			email: '',
			username: '',
			password: '',
			password2: '',
		});

		setValidation({
			username: null,
			email: null,
			password: null,
		});
	};

	const handleInputChange = (field: keyof RegisterFormData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));

		// Validate the field as it changes
		if (field === 'username') {
			validateUsername(value);
		} else if (field === 'email') {
			validateEmail(value);
		} else if (field === 'password' || field === 'password2') {
			validatePassword(formData.password, formData.password2);
		}
	};

	const isSubmitDisabled =
		isSuccess ||
		isLoading ||
		!validation.username ||
		!validation.email ||
		!validation.password;

	return (
		<div className='min-h-screen-minus-64 dottedBackground flex justify-center py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-lg w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-[--light_0]'>
						{LANGUAGE.REGISTER.TITLE[preferences.language]}
					</h2>
				</div>
				<div className='rounded-lg shadow-md p-7 bg-[--bg_sec]'>
					<form className='space-y-7'>
						<div className={`rounded-md shadow-sm -space-y-px `}>
							<InputText
								label={LANGUAGE.REGISTER.USERNAME[preferences.language]}
								id='username'
								name='username'
								type='text'
								required
								value={formData.username}
								setValue={value => handleInputChange('username', value)}
								validateValue={validateUsername}
								shake={shakeState.username}
								valValue={validation.username}
								val_valid={
									LANGUAGE.REGISTER.USERNAME_VALID[preferences.language]
								}
								val_not_valid={
									LANGUAGE.REGISTER.USERNAME_NOT_VALID[preferences.language]
								}
							/>
							<InputText
								label={LANGUAGE.REGISTER.EMAIL[preferences.language]}
								id='email-address'
								name='email'
								type='email'
								required
								value={formData.email}
								setValue={value => handleInputChange('email', value)}
								validateValue={validateEmail}
								shake={shakeState.email}
								valValue={validation.email}
								val_valid={LANGUAGE.REGISTER.EMAIL_VALID[preferences.language]}
								val_not_valid={
									LANGUAGE.REGISTER.EMAIL_NOT_VALID[preferences.language]
								}
							/>

							<InputPasswordRepeat
								label1={LANGUAGE.REGISTER.PASS[preferences.language]}
								id1='password'
								name1='password'
								label2={LANGUAGE.REGISTER.REPEAT_PASS[preferences.language]}
								id2='password2'
								name2='password2'
								password1={formData.password}
								password2={formData.password2}
								setPassword1={value => handleInputChange('password', value)}
								setPassword2={value => handleInputChange('password2', value)}
								validatePassword={validatePassword}
								shake={shakeState.password}
								valPassword={validation.password}
								pass_valid={LANGUAGE.REGISTER.PASS_VALID[preferences.language]}
								pass_not_valid={
									LANGUAGE.REGISTER.PASS_NOT_VALID[preferences.language]
								}
								pass_not_match={
									LANGUAGE.REGISTER.PASS_NOT_MATCH[preferences.language]
								}
							/>
						</div>

						{errors.length > 0 && (
							<div className='flex items-center justify-between'>
								<div className='flex items-center flex-col justify-start'>
									{errors.map((error, index) => (
										<p
											key={`error-${index}`}
											className='block text-sm w-full'
											style={{ color: 'var(--wrong)' }}
										>
											{error}
										</p>
									))}
								</div>
							</div>
						)}

						<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between'>
							<div className='flex items-center'>
								<input
									id='remember-me'
									name='remember-me'
									type='checkbox'
									onChange={() => setRememberMe(!rememberMe)}
									className='h-4 w-4 text-[--brand_color] focus:ring-[--brand_color] border-[--light_300] rounded'
								/>
								<label
									htmlFor='remember-me'
									className='ml-2 block text-md text-[--light_100]'
								>
									{LANGUAGE.REGISTER.REMEMBERME[preferences.language]}
								</label>
							</div>

							<div className='text-md'>
								<Link
									to='/login'
									className='font-medium text-[--button] hover:text-[--button_hover]'
								>
									{user
										? LANGUAGE.REGISTER.ALREADY_ACCOUNT[
												user.preferences.language
										  ]
										: LANGUAGE.REGISTER.ALREADY_ACCOUNT.en}
								</Link>
							</div>
						</div>

						<div>
							<button
								type='submit'
								disabled={isSubmitDisabled}
								className={`${
									isSubmitDisabled
										? 'cursor-not-allowed bg-[--button_not_allowed]'
										: 'bg-[--button] hover:bg-[--button_hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--brand_color]'
								} group relative h-12 w-full items-center flex justify-center gap-2 py-2 px-4 border border-transparent text-md font-medium rounded-md text-[--light_900]`}
								onClick={e => {
									handleSubmit(e);
								}}
							>
								{isLoading ? (
									<CircleDashed className='loader' />
								) : (
									<span>{LANGUAGE.REGISTER.SIGNUP[preferences.language]}</span>
								)}
								{isSuccess && <CheckCircle2 className='text-[--light_0]' />}
							</button>
						</div>
					</form>

					<ODivisor></ODivisor>

					<GoogleButton
						text={LANGUAGE.LOGIN.SIGNIN_GOOGLE[preferences.language]}
						url={`https://3dcute.up.railway.app/app/auth/google`}
						disabled={isLoading}
					></GoogleButton>
				</div>
			</div>
		</div>
	);
}

/*
export default function Register() {
  // Group related state together for better organization
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    password: "",
    password2: "",
  });

  const [validation, setValidation] = useState<ValidationState>({
    username: null,
    email: null,
    password: null,
  });

  const [shakeState, setShakeState] = useState<ShakeState>({
    username: false,
    email: false,
    password: false,
  });

  const [requestErrors, setRequestErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const { signUp, logged, user } = useAuth();
  const navigate = useNavigate();
  const { preferences } = usePreferences();

  // Handle form submission
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { username, email, password } = validation;

    if (username && email && password) {
      setIsLoading(true);

      try {
        const response = (await signUp({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          remember: rememberMe,
        })) as SignUpResponse;

        if (response.status === 200) {
          setIsSuccess(true);
          resetForm();
        } else if (response.response?.data) {
          setRequestErrors(response.response.data);
        }
      } catch (error) {
        console.error("Registration error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      triggerValidationFeedback();
    }
  };

  // Trigger visual feedback for invalid fields
  const triggerValidationFeedback = () => {
    const newShakeState = { ...shakeState };
    const newValidation = { ...validation };

    if (!validation.username) {
      newShakeState.username = true;
      newValidation.username = false;
    }

    if (!validation.email) {
      newShakeState.email = true;
      newValidation.email = false;
    }

    if (!validation.password) {
      newShakeState.password = true;
      newValidation.password = false;
    }

    setShakeState(newShakeState);
    setValidation(newValidation);

    // Reset shake animations after they complete
    setTimeout(() => {
      setShakeState({
        username: false,
        email: false,
        password: false,
      });
    }, 500);
  };

  // Field validation functions
  const validateUsername = (value: string) => {
    const isValid = value.length >= 3;
    setValidation((prev) => ({ ...prev, username: isValid }));
    return isValid;
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    setValidation((prev) => ({ ...prev, email: isValid }));
    return isValid;
  };

  const validatePassword = (value: string, value2: string) => {
    const isValid = value.length >= 6 && value2.length >= 6 && value === value2;
    setValidation((prev) => ({ ...prev, password: isValid }));
    return isValid;
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      password: "",
      password2: "",
    });

    setValidation({
      username: null,
      email: null,
      password: null,
    });
  };

  // Handle input changes
  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate the field as it changes
    if (field === "username") {
      validateUsername(value);
    } else if (field === "email") {
      validateEmail(value);
    } else if (field === "password" || field === "password2") {
      validatePassword(formData.password, formData.password2);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (logged) {
      navigate("/");
    }
  }, [logged, navigate]);

  // Determine if submit button should be disabled
  const isSubmitDisabled =
    isSuccess ||
    isLoading ||
    !validation.username ||
    !validation.email ||
    !validation.password;

  return (
    <div className="min-h-screen-minus-64 dottedBackground flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[--light_0]">
            {LANGUAGE.REGISTER.TITLE[preferences.language]}
          </h2>
        </div>
        <div className="rounded-lg shadow-md p-7 bg-[--bg_sec]">
          <form className="space-y-7">
            <div className="rounded-md shadow-sm -space-y-px">
              <InputText
                label={LANGUAGE.REGISTER.USERNAME[preferences.language]}
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                setValue={(value) => handleInputChange("username", value)}
                validateValue={validateUsername}
                shake={shakeState.username}
                valValue={validation.username}
                val_valid={
                  LANGUAGE.REGISTER.USERNAME_VALID[preferences.language]
                }
                val_not_valid={
                  LANGUAGE.REGISTER.USERNAME_NOT_VALID[preferences.language]
                }
              />

              <InputText
                label={LANGUAGE.REGISTER.EMAIL[preferences.language]}
                id="email-address"
                name="email"
                type="email"
                required
                value={formData.email}
                setValue={(value) => handleInputChange("email", value)}
                validateValue={validateEmail}
                shake={shakeState.email}
                valValue={validation.email}
                val_valid={LANGUAGE.REGISTER.EMAIL_VALID[preferences.language]}
                val_not_valid={
                  LANGUAGE.REGISTER.EMAIL_NOT_VALID[preferences.language]
                }
              />

              <InputPasswordRepeat
                label1={LANGUAGE.REGISTER.PASS[preferences.language]}
                id1="password"
                name1="password"
                label2={LANGUAGE.REGISTER.REPEAT_PASS[preferences.language]}
                id2="password2"
                name2="password2"
                password1={formData.password}
                password2={formData.password2}
                setPassword1={(value) => handleInputChange("password", value)}
                setPassword2={(value) => handleInputChange("password2", value)}
                validatePassword={validatePassword}
                shake={shakeState.password}
                valPassword={validation.password}
                pass_valid={LANGUAGE.REGISTER.PASS_VALID[preferences.language]}
                pass_not_valid={
                  LANGUAGE.REGISTER.PASS_NOT_VALID[preferences.language]
                }
                pass_not_match={
                  LANGUAGE.REGISTER.PASS_NOT_MATCH[preferences.language]
                }
              />
            </div>

            {requestErrors.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-col justify-start">
                  {requestErrors.map((error, index) => (
                    <p
                      key={`error-${index}`}
                      className="block text-sm w-full"
                      style={{ color: "var(--wrong)" }}
                    >
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-[--brand_color] focus:ring-[--brand_color] border-[--light_300] rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-md text-[--light_100]"
                >
                  {LANGUAGE.REGISTER.REMEMBERME[preferences.language]}
                </label>
              </div>

              <div className="text-md">
                <Link
                  to="/login"
                  className="font-medium text-[--button] hover:text-[--button_hover]"
                >
                  {user
                    ? LANGUAGE.REGISTER.ALREADY_ACCOUNT[
                        user.preferences.language
                      ]
                    : LANGUAGE.REGISTER.ALREADY_ACCOUNT.en}
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`
                  ${
                    isSubmitDisabled
                      ? "cursor-not-allowed bg-[--button_not_allowed]"
                      : "bg-[--button] hover:bg-[--button_hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--brand_color]"
                  } 
                  group relative h-12 w-full items-center flex justify-center gap-2 py-2 px-4 
                  border border-transparent text-md font-medium rounded-md text-[--light_900]
                `}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <CircleDashed className="loader" />
                ) : (
                  <span>{LANGUAGE.REGISTER.SIGNUP[preferences.language]}</span>
                )}
                {isSuccess && (
                  <CheckCircle2 className="text-[--light_0]" />
                )}
              </button>
            </div>
          </form>

          <ODivisor />

          <GoogleButton
            text={LANGUAGE.LOGIN.SIGNIN_GOOGLE[preferences.language]}
            url="https://3dcute.up.railway.app/app/auth/google"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
*/
