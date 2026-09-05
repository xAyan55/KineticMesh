import React, { useState } from "react";
import { UserCircleIcon, KeyIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { FaDiscord } from "react-icons/fa";
import { Field } from "@/components/theme/elements/Field";
import { Button } from "@/components/theme/elements/Button";
import { Alert } from "@/components/theme/elements/Alert";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [eyeOpen, setEyeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please provide both username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        const text = await response.text();
        setError(text || "Invalid username or password.");
      }
    } catch (err: any) {
      setError(err.message || "A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const navigate = (url: string) => {
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div
      className="min-h-screen h-full bg-center bg-no-repeat bg-cover z-10 relative flex flex-col justify-between"
      style={{ backgroundImage: "url(/arix/background-login.png)" }}
    >
      {/* Background Radial Gradient */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--gray800) 45%, transparent) 0%, var(--gray800) 100%)",
        }}
      />

      {/* Top Bar */}
      <div className="flex items-center justify-between p-6">
        <div className="flex gap-x-2 items-center font-semibold text-lg text-gray-50">
          <img src="/arix/logo.png" alt="logo" className="h-8 w-8 object-contain" />
          <span className="font-header tracking-tight">KineticMesh</span>
        </div>
        <div className="flex items-center gap-x-6 text-sm text-gray-300">
          <a
            href="https://discord.gg/invite"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-gray-100 duration-200"
          >
            <FaDiscord className="w-4 h-4 text-arix" />
            <span>Discord</span>
          </a>
        </div>
      </div>

      {/* Center Box: Form */}
      <div className="my-auto mx-auto w-full max-w-[450px] px-4">
        {error && <Alert type="error" className="mb-4">{error}</Alert>}

        <div className="bg-gray-700 backdrop rounded-box border border-gray-600/70 p-7 shadow-2xl">
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-gray-600/50">
            <img src="/arix/logo.png" alt="logo" className="h-9 w-9 object-contain" />
            <div>
              <h2 className="text-xl font-header font-bold text-gray-100">Sign in to KineticMesh</h2>
              <p className="text-xs text-gray-400">High-Density Infrastructure Control Plane</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field
              id="username"
              name="username"
              type="text"
              label="Username or Email"
              placeholder="admin or tenant@example.com"
              icon={UserCircleIcon}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-gray-300 font-normal">Password</label>
                <a
                  href="/auth/password"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Please contact the panel administrator to reset your credentials.");
                  }}
                  className="text-xs text-gray-400 hover:text-gray-200 underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Field
                  id="password"
                  name="password"
                  type={eyeOpen ? "text" : "password"}
                  placeholder="••••••••••••"
                  icon={KeyIcon}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-200"
                  onClick={() => setEyeOpen(!eyeOpen)}
                >
                  {eyeOpen ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" isLoading={loading} className="w-full mt-2 font-semibold py-2.5">
              Login
            </Button>
          </form>

          {/* Discord OAuth Integration */}
          <div className="mt-5 pt-5 border-t border-gray-600/60">
            <a
              href="/auth/discord"
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center justify-center gap-2 py-2.5 rounded-component text-sm font-medium transition duration-150 shadow-md"
            >
              <FaDiscord className="w-5 h-5" />
              <span>Login with Discord</span>
            </a>
          </div>

          <div className="mt-5 text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-arix hover:underline font-medium"
            >
              Register here
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-neutral-400">
        <p>KineticMesh Control Plane &copy; 2026</p>
        <p className="mt-0.5">KineticHost - You Dream, We Host.</p>
      </footer>
    </div>
  );
};

export default Login;
