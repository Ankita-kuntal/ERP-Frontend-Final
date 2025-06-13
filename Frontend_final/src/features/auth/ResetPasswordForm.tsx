import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '../../app/routes';
import { useAuth } from './store/customHooks';
import { z } from 'zod';

// Defining password validation schema using zod
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[0-9]/, 'Password must include a number')
  .regex(/[^A-Za-z0-9]/, 'Password must include a special character');

export const ResetPasswordForm = () => {
  const { userId, token } = useParams<{ userId: string; token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate new password using Zod
    const result = passwordSchema.safeParse(formData.newPassword);
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    // Confirm password match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call and use userId/token
      console.log('Sending:', { userId, token, ...formData });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message then redirect
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          {user && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Reset password for {user.email}
            </p>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 p-3 rounded-md text-sm">
              Password reset successful! Redirecting...
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full rounded-lg px-3 py-2 border bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            {['oldPassword', 'newPassword', 'confirmPassword'].map(field => {
              const isOld = field === 'oldPassword';
              const isNew = field === 'newPassword';
              const isConfirm = field === 'confirmPassword';
              const fieldLabel = isOld
                ? 'Old Password'
                : isNew
                ? 'New Password'
                : 'Confirm New Password';
              const toggleKey = isOld ? 'old' : isNew ? 'new' : 'confirm';
              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {fieldLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword[toggleKey] ? 'text' : 'password'}
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={fieldLabel}
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility(toggleKey)}
                      className="absolute right-2 top-2 text-gray-500 dark:text-gray-400"
                    >
                      {showPassword[toggleKey] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none disabled:opacity-50"
            >
              {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
