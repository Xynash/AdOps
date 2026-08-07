import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { COMPANY_NAME } from "../lib/constants";

function deriveNameFromEmail(email) {
  const local = email.split("@")[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export default function AuthPage({ mode, onSuccess, onSwitchMode, onBack }) {
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayConnected, setStayConnected] = useState(false);
  const [googleNote, setGoogleNote] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const displayName = isSignup && name ? name : deriveNameFromEmail(email);
    onSuccess({ name: displayName, email });
  }

  function handleGoogleClick() {
    setGoogleNote(true);
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="px-6 md:px-10 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate hover:text-ink transition-colors"
        >
          <ArrowLeft size={15} />
          Back to site
        </button>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 pb-16">
        <div className="w-full max-w-sm bg-white border border-ink/10 rounded-2xl shadow-sm p-8 mt-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-11 h-11 rounded-xl bg-ink flex items-center justify-center mb-4">
              <span className="text-paper font-display font-bold text-lg">
                {COMPANY_NAME.charAt(0)}
              </span>
            </div>
            <h1 className="font-display text-2xl font-semibold">
              {isSignup ? "Create your account" : "Log in"}
            </h1>
            {!isSignup && <p className="text-slate text-sm mt-1">Sign in to your desk.</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignup && (
              <div>
                <label className="text-xs font-medium text-slate mb-1.5 block">Your name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate mb-1.5 block">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate mb-1.5 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
              />
            </div>

            {!isSignup && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stayConnected}
                    onChange={(e) => setStayConnected(e.target.checked)}
                    className="rounded border-ink/20"
                  />
                  Stay connected
                </label>
                <span className="text-xs text-ink hover:underline cursor-pointer">
                  Forgot your password?
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-ink text-paper py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a2129] transition-colors mt-2"
            >
              {isSignup ? "Create account" : "Log in"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-ink/10" />
            <span className="text-xs text-slate">Or</span>
            <div className="flex-1 h-px bg-ink/10" />
          </div>

          <button
            onClick={handleGoogleClick}
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-ink/15 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/5 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {googleNote && (
            <p className="text-xs text-slate text-center mt-3">
              Google sign-in isn't wired up in this demo yet — try email/password above.
            </p>
          )}

          <p className="text-slate text-xs mt-6 text-center">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <span
              onClick={() => onSwitchMode(isSignup ? "login" : "signup")}
              className="text-ink font-medium cursor-pointer hover:underline"
            >
              {isSignup ? "Log in" : "Create one for free!"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
