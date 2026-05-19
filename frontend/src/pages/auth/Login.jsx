// pages/auth/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUiStore } from "../../store/ui.store";
import Button from "../../components/ui/Button";
import Input  from "../../components/ui/Input";
import { ROUTES } from "../../constants/routes.js";

export default function Login() {
  const { login } = useAuth();
  // const { toast } = useUiStore();
  const toast = useUiStore((state) => state.toast)
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.email)    errs.email    = "Email is required";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await login(form); // hook handles navigation + toast
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Sign in
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to={ROUTES.REGISTER} className="text-indigo-600 font-medium hover:underline">
            Register
          </Link>
        </p>

        <p className="text-sm text-center text-gray-500 mt-2">
          Forgot your password?{" "}
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-indigo-600 font-medium hover:underline">
            Reset password
          </Link>
        </p>
      </div>
    </div>
  );
};

