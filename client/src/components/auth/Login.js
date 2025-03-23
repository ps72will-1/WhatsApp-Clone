import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { appName, logoPath } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Set page title
    document.title = `Login | ${appName}`;
  }, [isAuthenticated, navigate, appName]);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData);
    
    setLoading(false);
    
    if (result.success) {
      toast.success('Logged in successfully');
      navigate('/');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100 dark:bg-dark-bg">
      <div className="auth-form w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoPath} alt={appName} className="h-16 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{appName}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full mb-4"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Prefer to use your phone?{' '}
            <Link to="/phone-auth" className="text-primary hover:underline">
              Sign in with Phone
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;