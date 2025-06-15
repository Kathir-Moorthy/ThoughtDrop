import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { forgotPassword } from '../../utils/api';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      newPassword: Yup.string()
        .required('Required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await forgotPassword(values.email, values.newPassword);
        toast.success('Password updated successfully');
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.error || 'Password reset failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Password requirement checks
  const hasMinLength = formik.values.newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(formik.values.newPassword);
  const hasLowerCase = /[a-z]/.test(formik.values.newPassword);
  const hasNumber = /[0-9]/.test(formik.values.newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formik.values.newPassword);
  const passwordsMatch = formik.values.newPassword === formik.values.confirmPassword && formik.values.confirmPassword.length > 0;

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
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
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                  className={`appearance-none block w-full px-3 py-2 border ${formik.errors.newPassword && formik.touched.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
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
                <div className={`flex items-center ${hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                  {hasMinLength ? <FiCheck className="mr-1" /> : <FiX className="mr-1" />}
                  At least 8 characters
                </div>
                <div className={`flex items-center ${hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                  {hasUpperCase ? <FiCheck className="mr-1" /> : <FiX className="mr-1" />}
                  At least one uppercase letter
                </div>
                <div className={`flex items-center ${hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                  {hasLowerCase ? <FiCheck className="mr-1" /> : <FiX className="mr-1" />}
                  At least one lowercase letter
                </div>
                <div className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  {hasNumber ? <FiCheck className="mr-1" /> : <FiX className="mr-1" />}
                  At least one number
                </div>
                <div className={`flex items-center ${hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                  {hasSpecialChar ? <FiCheck className="mr-1" /> : <FiX className="mr-1" />}
                  At least one special character
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className={`appearance-none block w-full px-3 py-2 border ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                />
                <div className={`mt-1 text-xs flex items-center ${passwordsMatch ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordsMatch ? <FiCheck className="mr-1" /> : <FiX className="mr-1" />}
                  Passwords match
                </div>
                {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="font-medium text-primary hover:text-primary-dark text-sm"
            >
              Remember your password? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;