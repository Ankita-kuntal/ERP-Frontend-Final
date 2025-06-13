import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../app/routes";
import { Loader, GraduationCap, User } from "lucide-react";
import { useAuth } from "./store/customHooks";
import { showError } from "../../utils/toast";
import type { LoginPayload } from "../../types/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<LoginPayload['type']>("scholar");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(Response);

    if (!username || !password) {
      showError("Please enter both username and password");
      return;
    }

    try {
      await login({ username, password, type: loginType });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700">
        <div className="flex flex-col items-center">
          <GraduationCap className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Welcome to ERP Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Please select your login type
          </p>
        </div>

        {/* Sliding Toggle */}
        <div className="relative flex justify-center mb-6">
          <div className="relative inline-flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1">
            <button
              onClick={() => setLoginType("scholar")}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
                loginType === "scholar"
                  ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Student</span>
              </div>
            </button>
            <button
              onClick={() => setLoginType("faculty")}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
                loginType === "faculty"
                  ? "bg-purple-600 dark:bg-purple-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Faculty</span>
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {loginType === "scholar" ? "Student ID" : "Faculty ID"}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                loginType === "scholar"
                  ? "focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  : "focus:ring-purple-500 dark:focus:ring-purple-400"
              }`}
              placeholder={
                loginType === "scholar"
                  ? "Enter Student ID"
                  : "Enter Faculty ID"
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                loginType === "scholar"
                  ? "focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  : "focus:ring-purple-500 dark:focus:ring-purple-400"
              }`}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                loginType === "scholar"
                  ? "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600"
                  : "bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600"
              }`}
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to={ROUTES.RESET_PASSWORD}
              className={`text-sm ${
                loginType === "scholar"
                  ? "text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                  : "text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300"
              }`}
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
