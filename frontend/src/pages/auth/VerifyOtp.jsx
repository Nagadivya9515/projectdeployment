import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
// import { useLoading } from '../context/LoadingContext';
// import Loader from "./Loader";
import { Link, useNavigate } from "react-router";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/routes.js";
import { authApi } from "../../api/auth.api.js";
import { useUiStore } from "../../store/ui.store";
const validate = (form) => {
    const errors = {};

    if(!form.email.trim())
        errors.email = "Email is required";
    else if(!/\S+@\S+\.\S+/.test(form.email))
        errors.email = "Enter a valid email address";

    if(!form.otp.trim())
        errros.otp = "OTP is required";
    return errors;
}

export default function Verifyotp() {
    const [form, setForm] = useState({
        otp: "",
        email: "",
    });

    
    const [ loading, setLoading ] = useState(false);
    const [errors, setErrors] = useState({});

    // const { toast } = useUiStore();
    const toast = useUiStore((state) => state.toast)
    const navigate = useNavigate();

    const handleChange = async (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));

        if(errors[name])
            setErrors((prev) => ({...prev, [name]: ""}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate(form);
        if(Object.keys(validationErrors).length)
        {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            
            await authApi.verifyOtp({ 
                email: form.email, 
                otp: form.otp 
            });

            toast.success("Account verified! please login");

            // localStorage.setItem("verified", response.data.verified);
            navigate(ROUTES.LOGIN, { state: {email: form.email}});
        }
        catch (error) {
            
            toast.error(error.response?.data?.message || "OTP verification failed:");

            setTimeout(() => {
                navigate(ROUTES.RESEND_OTP, { state: { email: form.email }});
            }, 5000);
        }
        finally {
            setLoading(false);
        }

    }
    return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Verify account</h1>
                        {/* <p className="text-sm text-gray-500 mt-1"></p> */}
                    </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            error={errors.email}
                        />
                        
                        <Input
                            label="Otp"
                            name="otp"
                            type="text"
                            value={form.otp}
                            placeholder="Enter OTP"
                            onChange={handleChange}
                            error={errors.otp}
                        />
                        
                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full mt-2">
                                Verify account
                        </Button>
                    </form>

                    <p className="text-sm text-center text-gray-500 mt-6">
                        Didn't receive otp?{" "}
                        <Link to={ROUTES.RESEND_OTP} className="text-indigo-600 font-medium hover:underline">
                            Resend otp
                        </Link>
                    </p>
                </div>
            </div>
    )
}