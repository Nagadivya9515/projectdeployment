
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUiStore } from "../../store/ui.store";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { ROUTES } from "../../constants/routes.js";
import { authApi } from "../../api/auth.api.js";

// ─── Validation — pure function, outside the component ────────
// Pure functions outside the component = never recreated on re-render
const validate = (form) => {
  const errors = {};

  if (!form.name.trim())
    errors.name = "Name is required";

  if (!form.email.trim())
    errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(form.email))
    errors.email = "Enter a valid email address";

  if (!form.password)
    errors.password = "Password is required";
  else if (form.password.length < 6)
    errors.password = "Password must be at least 6 characters";

  if (!form.confirmPassword)
    errors.confirmPassword = "Please confirm your password";
  else if (form.password !== form.confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  return errors;
};
export default function Register () {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // const { toast } = useUiStore();
    const toast = useUiStore((state) => state.toast)
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));

        if(errors[name]) setErrors((prev) => ({...prev, [name]: ""}));
    };

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
            await authApi.register({
                name: form.name,
                email: form.email,
                password: form.password,
            });

            toast.success("Account created! check your email for OTP");
            navigate(ROUTES.VERIFY_OTP, { state: {email: form.email } });
        }
        catch (err) {
            // ✅ user sees the error — not just console
            toast.error(err.response?.data?.message || "Registration failed. Try again.");
        } 
        finally {
            setLoading(false);
        }
    }

    return (
        <div className = "min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
                    <p className="text-sm text-gray-500 mt-1">Join us to book your perfect event</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Full Name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={handleChange}
                        error={errors.name}
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Your email address"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Atleast 6 characters"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Repeat your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                    />
                    
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full mt-2"
                    >
                        Create Account
                    </Button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                    Already registered?{" "}
                    <Link to={ROUTES.LOGIN} className="text-indigo-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

// export default function Register() {

//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [passwordConfirm, setPasswordConfirm] = useState("");
//     const { setLoading } = useLoading();
//     const [errors, setErrors] = useState({});
//     const [submitted, setSubmitted] = useState(false);

//     const validate = () => {
//         const newErrors = {};
//         if(!name.trim()) newErrors.username = "Username is required";

//         if(!email.trim()) newErrors.email = "Email is required";
//         else if(!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

//         if(!password) newErrors.password = "Password is required";
//         else if(password.length < 6) newErrors.password = "Password must be at least 6 characters";

//         if (!passwordConfirm) {
//       newErrors.passwordConfirm = "Please confirm your password";
//     } else if(password !== passwordConfirm) newErrors.passwordConfirm = "Passwords do not match";

//         setErrors(newErrors);

//         return Object.keys(newErrors).length === 0;
//     }
//     const navigate = useNavigate();

//     async function handleSubmit(event) {
//         event.preventDefault();

//         setSubmitted(true);
//         if (!validate()) return;

//         try {
//             setLoading(true);
//             const det = await axios.post("http://localhost:4000/auth/register", { name, email, password });
//             console.log(det.data);
//             navigate("/verify-otp", { state: { email } });
//         }
//         catch (error) {
//             console.log("Registration failed:", error);
//         }
//         finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="flex justify-center items-center h-screen bg-gray-100">
//             <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
//                 <h2 className="text-2xl font-bold mb-6 text-center">Register an Account</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
//                         <input
//                             type="text"
//                             id="username"
//                             onChange = {e => {setName(e.target.value); setErrors(prev => ({...prev, username: ""}))}}
//                             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
//                             placeholder="Enter your username"
//                         />
//                         {submitted && errors.username && (
//                             <p className="text-red-500 text-sm mt-1">{errors.username}</p>
//                         )}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
//                         <input
//                             type="email"
//                             id="email"
//                             onChange = {e => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ""}))}}
//                             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
//                             placeholder="Enter your email"
//                         />
//                         {submitted && errors.email && (
//                             <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                         )}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             id="password"
//                             onChange={e => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ""}))}}
//                             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
//                             placeholder="Enter your password"
//                         />
//                         {submitted && errors.password && (
//                             <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//                         )}
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
//                         <input
//                             type="password"
//                             id="confirmPassword"
//                             onChange={e => { setPasswordConfirm(e.target.value); setErrors(prev => ({...prev, passwordConfirm: ""}))}}
//                             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
//                             placeholder="Confirm your password"
//                         />
//                         {submitted && errors.passwordConfirm && (
//                             <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>
//                         )}
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
//                     >
//                         Register
//                     </button>
//                     <p className="block text-center my-3 text-sm">Already Registered? <NavLink to="/resend-otp" className="text-blue-600 hover:underline">Verify here</NavLink></p>
//                 </form>
//             </div>
//         </div>
//     );
// }

