import { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function TopBar({ user, setUser }) {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const menuRef = useRef(null);

    // Close dropdown if click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const url = isRegister
                ? "http://127.0.0.1:8000/api/register"
                : "http://127.0.0.1:8000/api/login";

            const payload = isRegister
                ? { name, email, password }
                : { email, password };

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Invalid credentials");

            const data = await res.json();
            localStorage.setItem("token", data.token);
            setUser(data.user);
            setShowAuthModal(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("token");
        setMenuOpen(false);
    };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <h1 className="title">Vyom's AI Chatbot</h1>
            </div>

            <div className="topbar-right">
                <button className="icon" onClick={toggleTheme}>
                    {theme === "dark" ? "☀️" : "🌙"}
                </button>

                {!user ? (
                    <button
                        className="login"
                        onClick={() => {
                            setShowAuthModal(true);
                            setIsRegister(false);
                        }}
                    >
                        Login
                    </button>
                ) : (
                    <div className="user-wrapper" ref={menuRef}>
                        <div
                            className="user-info"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <div className="avatar">👤</div>
                            <span className="username">{user.name}</span>
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                className="caret-icon"
                            >
                                <path
                                    d="M6 9L12 15L18 9"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        {menuOpen && (
                            <div className="dropdown">
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* AUTH MODAL */}
            {showAuthModal && (
                <div className="auth-modal-backdrop">
                    <div className="auth-modal">
                        <h3>{isRegister ? "Register" : "Login"}</h3>

                        <form onSubmit={handleLogin}>
                            {isRegister && (
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            )}

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button type="submit">
                                {isRegister ? "Register" : "Login"}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <span>
                                {isRegister
                                    ? "Already have an account?"
                                    : "Don't have an account?"}
                            </span>
                            <button
                                type="button"
                                className="switch-auth-btn"
                                onClick={() => setIsRegister(!isRegister)}
                            >
                                {isRegister ? "Login" : "Register"}
                            </button>
                        </div>

                        <button
                            className="cancel-btn"
                            onClick={() => setShowAuthModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
