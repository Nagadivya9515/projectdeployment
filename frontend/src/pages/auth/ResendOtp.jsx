import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { ROUTES } from "../../constants/routes.js";
import { Link, useNavigate } from "react-router-dom";
import { useUiStore } from "../../store/ui.store";

const validate = (form) => {
    const errors = {};

    if(!form.email.trim())
        errors.email = "Email required";
    else if(!/\S+@\S+\.\S+/.test(form.email))
        errors.email = "Enter valid email address"

    return errors;
};

export default function ResendOtp () {

    const [form, setForm] = useState({
        email: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // const { toast } = useUiStore();
    const toast = useUiStore((state) => state.toast)
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));

        if(errors[name])
            setErrors((prev) => ({...prev, [name]: ""}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate(form);
        if(Object.keys(validationErrors).length){
            setErrors(validationErrors);
            return;
        }
        setLoading(true);

    try {
        await authApi.resendOtp({
            email:form.email
        });

        toast.success("OTP sent succefully");
        navigate(ROUTES.VERIFY_OTP, {state: {email: form.email}});
    }
    catch(err)
    {
        toast.error(err.response?.data?.message || "Resnd otp failed. try again");
    }
    finally {
        setLoading(false);
    }
}

return (
 
         <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">
                <div className = "mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Resend OTP</h2>
                </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    error={errors.email}
                />

                <Button 
                    type="submit" 
                    className='w-full mt-2'>
                    Resend OTP
                    </Button>
            </form>
            <p className="text-sm text-center text-gray-500 mt-6">
                Remembered your choice?{" "}
                <Link
                to={ROUTES.VERIFY_OTP}
                state={{email: form.email}}
                >
                    Back to verification
                </Link>
            </p>
        </div>
        </div>
)

}