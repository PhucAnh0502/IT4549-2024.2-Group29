import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(""); // State for error message
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const API_PATH = import.meta.env.VITE_API_PATH

  function handleLogin() {
    axios.post(`${API_PATH}/Auth/login`, {
      email: email,
      password: password
    })
    .then(res => {
      localStorage.setItem("token", res.data.token); 
      localStorage.setItem("accountRole", res.data.account.role)
      localStorage.setItem("userId", res.data.account.userId)
      const role = res.data.account.role;
      if(role === "Admin"){
        navigate("/admin-dashboard")
      } else if(role === "Manager") {
        localStorage.setItem("department", res.data.account.department)
        navigate("/manager-dashboard")
      } else if(role === "Trainer") {
        navigate("/trainer-dashboard")
      } else {
        navigate("/member-dashboard")
      }
    })
    .catch(err => {
      // Handle errors from the API
      if (err.response && err.response.data && err.response.data.Message) {
        setError(err.response.data.Message); // Display the error message from the API
      } else {
        setError("An unexpected error occurred. Please try again."); // Fallback for unexpected errors
      }
    });
  }

  useEffect(() => {
    setIsVisible(true);
  }, []); 
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }

  // Function to handle navigation to register
  const goToRegister = () => {
    handleClose();
    navigate('/register');
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => e.target === e.currentTarget && handleClose()} 
    >
      <div className={`bg-white p-6 rounded-lg shadow-lg w-96 relative transform transition-transform duration-500 ${isVisible ? "translate-y-0" : "translate-y-[-20px]"}`}
      >
        {/* Nút Close (X) */} 
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold transition duration-200"
        >
          X
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-red-500">Login</h2>

        {/* Input Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value = {email}
          onChange = {e => setEmail(e.target.value) && setError("")} // Update email state on change
          
        />

        {/* Input Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />

        {/* Login Button */}
        <button className="w-full bg-red-500 text-white px-4 py-2 rounded-lg mt-6 hover:bg-red-600 transition duration-200" onClick={handleLogin}>
          Login
        </button>

        {error && <div className="text-red-500 text-left mt-2">{error}</div>}

        <p className="mt-4 text-center text-gray-600">
          You don't have an account?{" "}
          <button
            onClick={goToRegister}
            className="text-red-500 font-semibold hover:underline"
          >
            Create Account
          </button>
        </p>
        {/* Forgot Password Link */}
        <p className="mt-2 text-center text-gray-600">
          Forgot your password?{" "}
          <Link
            to="/forgot-password"
            className="text-red-500 font-semibold hover:underline"
          >
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
