import { useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/routes.js";
import { authApi } from "../../api/auth.api";
import { useUiStore } from "../../store/ui.store";


const validate = (form) => {
    const errors = {};

    if(!form.email.trim())
        errors.email = "Email is required";
    else if(!/\S+@\S+\.\S+/.test(form.email))
        errors.email = "Enter a valid email address";

    return errors;
    
}
export default function ForgotPassword() {

    const [form, setForm] = useState({
        email: "",
    });
    const toast = useUiStore((state) => state.toast)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));

        if(errors[name])
            setErrors((prev) => ({...prev, [name]: ""}));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate(form);
        if(Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        } 
        setLoading(true);
        try {
            
            await authApi.forgotPassword( { email: form.email } );

            toast.success("Password reset Otp successfully sent to email");
            navigate(ROUTES.RESET_PASSWORD, {state: {email: form.email}});
        }
        catch(error) {
            toast.error(error.response?.data?.message || "Password reset failed:");
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                        placeholder="Enter your email"
                        error={errors.email}
                        />
                        <Button
                            type="submit"
                            className="w-full mt-2"
                        >
                            Reset Password
                        </Button>
                </form>
                <p className="text-sm text-center text-gray-500 mt-6">
                    Remembered password?{" "}
                    <Link
                    to={ROUTES.LOGIN}
                    state={{email: form.email}}
                >
                    Back to login
                    </Link>
                </p>
            </div>
        </div>
    )
}