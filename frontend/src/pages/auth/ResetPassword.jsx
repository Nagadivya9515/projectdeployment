import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUiStore } from "../../store/ui.store";
import { authApi } from "../../api/auth.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { ROUTES } from "../../constants/routes.js";

// ─── Validation — pure function, outside the component ────────
const validate = (form) => {
    const errors = {};

    if (!form.email.trim()) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = "Enter a valid email address";
    }

    if (!form.otp.trim()) {
        errors.otp = "OTP is required";
    }

    if (!form.newPassword.trim()) {
        errors.newPassword = "New Password is required";
    } else if (form.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters long";
    }

    if (!form.confirmPassword.trim()) {
        errors.confirmPassword = "Confirm Password is required";
    } else if (form.newPassword !== form.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    // const { toast } = useUiStore();
    const toast = useUiStore((state) => state.toast)

    // Unified single form object replaces 4 separate useState hook calls
    const [form, setForm] = useState({
        email: location.state?.email || "",
        otp: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Single scaling handler replacing multiple inline onChange bindings
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = validate(form);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            // Interacts with centralized endpoint layer instead of exposing localized URLs
            await authApi.resetPassword({
                email: form.email,
                otp: form.otp,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword
            });

            toast.success("Password reset successful! Please log in.");
            navigate(ROUTES.LOGIN);
        } catch (error) {
            // Emits the server's custom ApiError payload strings directly to a global Toast
            toast.error(error.response?.data?.message || "Password reset failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                    <p className="text-sm text-gray-500 mt-1">Provide your details to update your access credentials</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <Input
                        label="OTP"
                        name="otp"
                        type="text"
                        placeholder="Enter OTP"
                        value={form.otp}
                        onChange={handleChange}
                        error={errors.otp}
                    />

                    <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={form.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                    />

                    <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                    />

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full mt-2"
                    >
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
