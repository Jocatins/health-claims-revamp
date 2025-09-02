import React from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import HimisLogo from "../assets/himis-logo";
import Button from "../components/ui/Button";

const Login: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center space-x-2">
          <HimisLogo />
          <h1 className="text-green-900 font-bold text-lg">HIMIS</h1>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-green-900 font-semibold mb-6">LOGIN</h2>

        <Input label="Email" type="email" />
        <Input label="Password" type="password" />

        <div className="flex items-center mb-4">
          <input type="checkbox" id="remember" className="mr-2" />
          <label htmlFor="remember" className="text-sm text-gray-600">
            Remember me
          </label>
        </div>

        <Button
          className="w-full bg-green-900 text-white py-2 rounded-md hover:bg-green-800 transition-colors"
          onClick={() => navigate("/dashboard")}
        >
          Login
        </Button>

        <p className="text-center mt-4 text-sm text-gray-600 cursor-pointer hover:underline">
          Forgot your password?
        </p>
      </div>
    </div>
  );
};

export default Login;
