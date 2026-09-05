"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { FlutedGlass } from "@paper-design/shaders-react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

const formFields = [
  {
    label: "First name",
    value: "Harshit",
    type: "text",
    placeholder: "Harshit",
  },
  { label: "Last name", value: "Sharma", type: "text", placeholder: "Sharma" },
];

const termsText = (
  <>
    By creating an account, you agree to our{" "}
    <a
      href="#"
      className="font-medium text-black/55 underline underline-offset-2 dark:text-white/55"
    >
      Terms of Service
    </a>{" "}
    and{" "}
    <a
      href="#"
      className="font-medium text-black/55 underline underline-offset-2 dark:text-white/55"
    >
      Privacy Policy
    </a>
  </>
);

export default function AuthSectionThree({
  onLoginSubmit,
  onRegisterSubmit,
  isLoginMode = false,
  error,
  loading = false,
}: {
  onLoginSubmit?: (data: any) => void;
  onRegisterSubmit?: (data: any) => void;
  isLoginMode?: boolean;
  error?: string | null;
  loading?: boolean;
}) {
  const [isLogin, setIsLogin] = useState(isLoginMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (onLoginSubmit) onLoginSubmit({ username, password });
    } else {
      if (onRegisterSubmit) onRegisterSubmit({ username, email, password });
    }
  };

  return (
    <section className="min-h-screen bg-white p-3 text-black antialiased [font-synthesis:none] dark:bg-[#050505] dark:text-white">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        {/* Left Side - SignUp/Login Form */}
        <div className="flex min-h-[760px] items-center justify-center rounded-md border border-black/10 bg-white px-6 py-12 dark:border-white/5 dark:bg-[#0a0a0c] lg:min-h-0 lg:px-14 lg:py-20 xl:px-20">
          <div className="mx-auto w-full max-w-[460px]">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/arix/logo.png" alt="KineticMesh" className="h-8 w-8 object-contain" />
                <span className="font-header font-bold text-lg text-black dark:text-white">KineticMesh</span>
              </div>
              <h1 className="text-3xl font-medium tracking-tight sm:text-4xl text-black dark:text-white">
                {isLogin ? "Sign in to account" : "Create an account"}
              </h1>
              <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                {isLogin
                  ? "Welcome back to KineticMesh VPS infrastructure plane."
                  : "Deploy high performance QEMU/KVM virtual machines instantly."}
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg text-xs bg-red-500/10 border border-red-500/30 text-red-500 font-medium">
                {error}
              </div>
            )}

            {/* Social Signup Buttons */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
              <a
                href="/auth/discord"
                className="flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-black/[0.02] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <DiscordIcon />
                <span className="whitespace-nowrap">Sign in with Discord</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/auth/discord";
                }}
                className="flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-black/[0.02] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <GoogleIcon />
                <span className="whitespace-nowrap">Sign up with Google</span>
              </button>
            </div>

            <div className="my-6 flex items-center gap-4 text-xs font-medium text-black/40 dark:text-white/30">
              <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
              or continue with credentials
              <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Username"
                value={username}
                onChangeValue={setUsername}
                placeholder="Enter your username or email"
                type="text"
                required
              />

              {!isLogin && (
                <InputField
                  label="Email"
                  value={email}
                  onChangeValue={setEmail}
                  placeholder="name@kinetichost.com"
                  type="email"
                  required
                />
              )}

              <InputField
                label="Password"
                value={password}
                onChangeValue={setPassword}
                placeholder="Enter password"
                type="password"
                required
              />

              {!isLogin && (
                <div className="space-y-3 pt-2 text-xs leading-5 text-black/45 dark:text-white/40 sm:text-[13px]">
                  <CheckboxLine>
                    I agree to the hypervisor service terms and automated backups policy.
                  </CheckboxLine>
                  <CheckboxLine>{termsText}</CheckboxLine>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex h-11 w-full items-center justify-center rounded-lg border border-black/40 bg-black text-sm font-medium text-white transition-colors hover:bg-black/85 dark:border-white/40 dark:bg-white dark:text-black dark:hover:bg-white/85 disabled:opacity-50"
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Submit Registration"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs text-black/60 dark:text-white/60 hover:underline"
                >
                  {isLogin
                    ? "Don't have an account? Create one now"
                    : "Already have an account? Sign in instead"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Marketing Testimonial and Mockup */}
        <div className="relative flex min-h-[720px] flex-col overflow-hidden rounded-md bg-gradient-to-b from-black to-white p-8 text-white dark:to-[#050505] sm:p-12 lg:min-h-0 lg:p-16">
          {/* Background Shader */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <FlutedGlass
              size={0.89}
              shape="lines"
              angle={0}
              distortionShape="prism"
              distortion={0.5}
              shift={0}
              blur={0}
              edges={0.25}
              stretch={0}
              scale={1.11}
              fit="cover"
              highlights={0.1}
              shadows={0.2}
              grainMixer={0.1}
              grainOverlay={0.1}
              colorBack="#00000000"
              colorHighlight="#FFFFFF"
              colorShadow="#000000"
              className="w-full h-full bg-transparent"
            />
          </div>

          <div className="relative z-10 h-full w-full">
            <div className="max-w-[460px] lg:pt-12">
              <motion.div
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="Charlotte"
                  className="size-10 shrink-0 rounded-full border border-white/20 object-cover"
                />
                <div>
                  <div className="font-semibold leading-tight text-white">
                    Charlotte
                  </div>
                  <div className="mt-0.5 text-xs text-white/60">
                    Infrastructure Design Engineer
                  </div>
                </div>
              </motion.div>
              <motion.blockquote
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.8,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-7 text-2xl font-light leading-tight tracking-[-0.035em] text-white/90 sm:text-3xl lg:text-[34px]"
              >
                “Every VM control block had the restraint and polish we usually spend weeks
                refining.”
              </motion.blockquote>
            </div>

            <div className="mt-10 w-full translate-y-[24%] overflow-hidden rounded-2xl border border-white/15 bg-black/70 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:translate-y-[22%] lg:absolute lg:left-[12%] lg:-bottom-28 lg:mt-0 lg:w-[105%] lg:max-w-none lg:origin-bottom-left lg:translate-y-0 lg:-rotate-3 xl:left-[14%] xl:-bottom-[150px] xl:w-[108%] 2xl:-bottom-[170px] 2xl:w-[112%]">
              <motion.div
                initial={{ opacity: 0, y: 72, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 1,
                  delay: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="overflow-hidden rounded-xl border border-white/10 bg-black"
              >
                <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/40 px-4 py-3 select-none">
                  <div className="size-2 rounded-full bg-white/35" />
                  <div className="size-2 rounded-full bg-white/25" />
                  <div className="size-2 rounded-full bg-white/15" />
                  <span className="ml-4 text-[9px] font-mono tracking-wider text-white/40">
                    kineticmesh.io/control-plane
                  </span>
                </div>
                <img
                  src="/arix/background-login.png"
                  alt="KineticMesh Control Plane Mockup"
                  className="h-auto w-full object-cover object-top opacity-95"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChangeValue,
  required = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChangeValue?: (val: string) => void;
  required?: boolean;
}) {
  const [val, setVal] = useState(value);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 text-left w-full">
      <label className="text-xs font-semibold text-black/60 dark:text-white/60">
        {label}
      </label>
      <div className="relative flex h-11 items-center rounded-lg border border-black/15 bg-white px-3.5 dark:border-white/10 dark:bg-white/5">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={onChangeValue ? value : val}
          onChange={(e) => {
            if (onChangeValue) {
              onChangeValue(e.target.value);
            } else {
              setVal(e.target.value);
            }
          }}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/30"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function CheckboxLine({ children }: { children: ReactNode }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <span className="relative mt-1 size-3.5 shrink-0">
        <input
          type="checkbox"
          className="peer size-full cursor-pointer appearance-none rounded-[3px] border border-black/25 bg-white checked:border-black checked:bg-black dark:border-white/30 dark:bg-white/5 dark:checked:border-white dark:checked:bg-white"
        />
        <svg
          viewBox="0 0 12 12"
          className="pointer-events-none absolute inset-0 hidden size-full p-0.5 text-white peer-checked:block dark:text-black"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 6.2 5 8.1 9 3.9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EB4335"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="#5865F2"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
