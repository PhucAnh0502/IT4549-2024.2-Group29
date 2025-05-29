import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ActivateAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGettingCode, setIsGettingCode] = useState(false);
  const [receivedCode, setReceivedCode] = useState("");

  const API_PATH = import.meta.env.VITE_API_PATH;

  // Initialize data from location state and display email and password fields
  useEffect(() => {
    if (location.state && location.state.email && location.state.password) {
      setEmail(location.state.email);
      setPassword(location.state.password);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "activationCode") {
      setActivationCode(value);
    }
    setError("");
  };

  const getActivationCode = async () => {
    try {
      setIsGettingCode(true);
      setLoading(true);
      const response = await axios.post(`${API_PATH}/Auth/request-active`, {
        email,
        password
      });

      setReceivedCode(response.data.activeCode);
      setSuccess(`Activation code has been generated: ${response.data.activeCode}`);
      setIsGettingCode(false);
      setLoading(false);
    } catch (err) {
      setIsGettingCode(false);
      setLoading(false);
      if (err.response && err.response.data && err.response.data.Message) {
        setError(err.response.data.Message);
      } else {
        setError("Failed to get activation code. Please try again.");
      }
    } finally {
      setIsGettingCode(false);
    }
  };

  const activateAccount = async () => {
    try {
      if (!activationCode) {
        setError("Please enter the activation code");
        return;
      }

      setLoading(true);
      await axios.post(`${API_PATH}/Auth/activate-account`, {
            activeCode: activationCode
      });

      setSuccess("Account activated successfully! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.Message) {
        setError(err.response.data.Message);
      } else {
        setError("Failed to activate account. Please check your code and try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
          Activate Your Account
        </h2>

        {!receivedCode && !isGettingCode && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled
              />
            </div>

            {/* Get Activation Code Button */}
            <button
              className={`w-full bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={getActivationCode}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Get Activation Code'}
            </button>
          </>
        )}

        {/* Show Activation Code if received */}
        {receivedCode && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700 mb-2 font-bold">Your activation code:</p>
            <p className="text-blue-700 text-xl font-mono text-center">{receivedCode}</p>
          </div>
        )}

        {/* Enter Activation Code if received */}
        {receivedCode && (
          <>
            <div className="mb-4 mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Enter Activation Code</label>
              <input
                type="text"
                name="activationCode"
                placeholder="Enter your activation code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={activationCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              className={`w-full bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={activateAccount}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Activate Account'}
            </button>
          </>
        )}

        {/* Display error or success messages */}
        {error && <div className="text-red-500 text-left mt-4">{error}</div>}
        {success && <div className="text-green-500 text-left mt-4">{success}</div>}

        <p className="mt-4 text-center text-gray-600">
          <button
            onClick={() => navigate("/login")}
            className="text-red-500 font-semibold hover:underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ActivateAccount;