import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../../components/form/Input";
import { useForm } from "react-hook-form";
import HimisLogo from "../../assets/himis-logo";
import Button from "../../components/ui/Button";
import type { LoginForm } from "../../types/LoginForm";
import { useAuth } from "../../hooks/useAuth";
import type { LocationWithState } from "../../types/route";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const { login, isAuthenticated, loading, clearError } = useAuth();

  const location = useLocation() as LocationWithState;

  const [showPassword, setShowPassword] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();

    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    return () => {
      clearError();
    };
  }, [isAuthenticated, navigate, from, clearError]);

  const onSubmit = async (data: LoginForm) => {
    // console.log(data);
    const result = await login(data);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  if (isAuthenticated) {
    return null; // or a loading spinner since navigation will happen immediately
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center space-x-2">
            <HimisLogo />
            <h1 className="text-green-900 font-bold text-lg">HIMIS</h1>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-center text-green-900 font-semibold mb-6">
            LOGIN
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 mb-2">
                {errors.email.message}
              </p>
            )}
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
              endAdornment={
                <span onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              }
            />

            <div className="flex items-center mb-4">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-900 text-white py-2 rounded-md hover:bg-green-800 transition-colors"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600 cursor-pointer hover:underline">
            Forgot your password?
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
