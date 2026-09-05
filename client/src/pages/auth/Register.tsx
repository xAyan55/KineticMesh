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
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        // Not a JSON response
      }

      if (response.ok && data?.success) {
        window.location.href = "/dashboard";
        return;
      }

      setError(data?.error || "Invalid username or password.");
    } catch (err: any) {
      setError(err.message || "A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    setError("Self-registration is restricted. Please contact your system administrator to provision an account, or log in with Discord.");
  };

  const handleDiscordClick = async () => {
    try {
      setError(null);
      const res = await fetch("/api/discord-auth-url");
      const data = await res.json().catch(() => null);
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError(data?.error || "Discord authentication is not configured on this server.");
      }
    } catch {
      setError("Failed to connect to Discord authentication service.");
    }
  };

  const handleGoogleClick = () => {
    setError("Google single sign-on is not configured on this server.");
  };

  return (
    <AuthSectionThree
      isLoginMode={false}
      onLoginSubmit={handleLoginSubmit}
      onRegisterSubmit={handleRegisterSubmit}
      onDiscordClick={handleDiscordClick}
      onGoogleClick={handleGoogleClick}
      error={error}
      loading={loading}
    />
  );
};
