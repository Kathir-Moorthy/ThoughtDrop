import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { signUp } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidation(validations);
    return validations;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      gender: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
      gender: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { confirmPassword, ...userData } = values;
        const response = await signUp(userData);
        
        if (!response?.data?.user || !response?.data?.token) {
          throw new Error('Invalid response from server - missing user or token');
        }

        authLogin(response.data.user, response.data.token);
        toast.success('Account created successfully');
        navigate('/home');
      } catch (error) {
        console.error('Signup error:', error);
        const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Signup failed';
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePasswordChange = (e) => {
    formik.handleChange(e);
    validatePassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    formik.handleChange(e);
    setPasswordsMatch(e.target.value === formik.values.password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className={`appearance-none block w-full px-3 py-2 border ${formik.errors.name && formik.touched.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                />
                {formik.errors.name && formik.touched.name && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`appearance-none block w-full px-3 py-2 border ${formik.errors.email && formik.touched.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <span className="ml-1 text-xs text-gray-500">(India +91)</span>
              </div>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength="10"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  className={`appearance-none block w-full px-3 py-2 border ${formik.errors.phone && formik.touched.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                />
                {formik.errors.phone && formik.touched.phone && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <div className="mt-1 space-y-2">
                {['Male', 'Female', 'Prefer not to say'].map((gender) => (
                  <div key={gender} className="flex items-center">
                    <input
                      id={gender.toLowerCase()}
                      name="gender"
                      type="radio"
                      value={gender}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.gender === gender}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor={gender.toLowerCase()} className="ml-2 block text-sm text-gray-700">
                      {gender}
                    </label>
                  </div>
                ))}
                {formik.errors.gender && formik.touched.gender && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.gender}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={handlePasswordChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`appearance-none block w-full px-3 py-2 border ${formik.errors.password && formik.touched.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <p className={passwordValidation.length ? 'text-green-600' : ''}>
                  {passwordValidation.length ? '✓' : '•'} At least 8 characters
                </p>
                <p className={passwordValidation.uppercase ? 'text-green-600' : ''}>
                  {passwordValidation.uppercase ? '✓' : '•'} At least one uppercase letter
                </p>
                <p className={passwordValidation.lowercase ? 'text-green-600' : ''}>
                  {passwordValidation.lowercase ? '✓' : '•'} At least one lowercase letter
                </p>
                <p className={passwordValidation.number ? 'text-green-600' : ''}>
                  {passwordValidation.number ? '✓' : '•'} At least one number
                </p>
                <p className={passwordValidation.specialChar ? 'text-green-600' : ''}>
                  {passwordValidation.specialChar ? '✓' : '•'} At least one special character
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={handleConfirmPasswordChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className={`appearance-none block w-full px-3 py-2 border ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                />
                {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                ) : (
                  passwordsMatch && (
                    <p className="mt-2 text-sm text-green-600">✓ Passwords match</p>
                  )
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;