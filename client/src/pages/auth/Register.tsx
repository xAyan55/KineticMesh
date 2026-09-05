import React, { useState } from "react";
import AuthSectionThree from "@/components/ui/auth-section-3";

export const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async ({ username, password }: any) => {
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

  const handleRegisterSubmit = async ({ username, email, password }: any) => {
    if (!username || !password || !email) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        const text = await response.text();
        setError(text || "Registration failed. Please contact the administrator.");
      }
    } catch (err: any) {
      setError(err.message || "A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSectionThree
      isLoginMode={false}
      onLoginSubmit={handleLoginSubmit}
      onRegisterSubmit={handleRegisterSubmit}
      error={error}
      loading={loading}
    />
  );
};
