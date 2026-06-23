import { useState } from "react";
import axios from "axios";
import { LogIn, UserPlus, GraduationCap, BookOpen, Pencil, Calculator, Award } from "lucide-react";
import ShinyText from "./ui/ShinyText";

function LoginPage({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleAuth = (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!username || !password) {
            setError("Please fill in all fields.");
            return;
        }

        const endpoint = isRegister ? "/register" : "/login";

        axios.post(`http://localhost:8080${endpoint}`, {
            username,
            password
        })
        .then(response => {
            if (isRegister) {
                setSuccessMessage("Registered successfully! Please log in.");
                setIsRegister(false);
                setPassword("");
            } else {
                onLogin(response.data);
            }
        })
        .catch(err => {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Something went wrong. Please try again.");
            }
        });
    };

    const floatingIcons = [
        // Left Side Icons
        { Icon: GraduationCap, top: "10%", left: "6%", delay: "0s" },
        { Icon: BookOpen, top: "30%", left: "8%", delay: "2s" },
        { Icon: Pencil, top: "50%", left: "5%", delay: "4s" },
        { Icon: Calculator, top: "70%", left: "7%", delay: "1.5s" },
        { Icon: Award, top: "88%", left: "6%", delay: "3s" },
        // Right Side Icons
        { Icon: GraduationCap, top: "15%", right: "6%", delay: "1s" },
        { Icon: BookOpen, top: "35%", right: "8%", delay: "3s" },
        { Icon: Pencil, top: "55%", right: "5%", delay: "0.5s" },
        { Icon: Calculator, top: "75%", right: "7%", delay: "2.5s" },
        { Icon: Award, top: "85%", right: "6%", delay: "4s" }
    ];

    return (
        <div className="login-page">
            <div className="floating-icons-container">
                {floatingIcons.map(({ Icon, top, left, right, bottom, delay }, idx) => (
                    <div 
                        key={idx}
                        className="floating-academic-icon"
                        style={{
                            top,
                            left,
                            right,
                            bottom,
                            animationDelay: delay
                        }}
                    >
                        <Icon size={46} strokeWidth={1.5} />
                    </div>
                ))}
            </div>

            <div className="login-header-section">
                <h1>
                    <ShinyText text="Student Academic Dashboard" speed={3.5} />
                </h1>
                <p className="login-description">
                    This platform focuses on providing efficient student management, semester-wise performance analysis, real-time leaderboards, and seamless academic tracking. It empowers educators with administrative control, graphical summaries, and quick data insights in a premium, responsive environment.
                </p>
            </div>

            <div className="login-card">
                <p className="eyebrow">{isRegister ? "Join us" : "Welcome back"}</p>
                <h2>{isRegister ? "Create Account" : "Login"}</h2>

                <form onSubmit={handleAuth}>
                    <div className="field-group">
                        <label>Username</label>
                        <input
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="field-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="primary-action login-icon" type="submit">
                        {isRegister ? (
                            <>
                                <UserPlus className="button-icon" aria-hidden="true" />
                                Register
                            </>
                        ) : (
                            <>
                                <LogIn className="button-icon" aria-hidden="true" />
                                Login
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-toggle">
                    {isRegister ? (
                        <p>
                            Already have an account?{" "}
                            <span className="toggle-link" onClick={() => { setIsRegister(false); setError(""); setSuccessMessage(""); }}>
                                Login here
                            </span>
                        </p>
                    ) : (
                        <p>
                            Don't have an account?{" "}
                            <span className="toggle-link" onClick={() => { setIsRegister(true); setError(""); setSuccessMessage(""); }}>
                                Register here
                            </span>
                        </p>
                    )}
                </div>

                {successMessage && <p className="success-message">{successMessage}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default LoginPage;
