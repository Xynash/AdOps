import { useState } from "react";
import { X, Check } from "lucide-react";
import Button from "./Button";
import AuthIllustration from "./AuthIllustration";

const PLANS = [
  { key: "starter", name: "Starter", price: "Free" },
  { key: "growth", name: "Growth", price: "$39/mo" },
  { key: "scale", name: "Scale", price: "Custom" },
];

function deriveNameFromEmail(email) {
  const local = email.split("@")[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export default function AuthModal({ onClose, onSuccess, initialMode = "signup" }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("growth");

  function handleSubmit(e) {
    e.preventDefault();
    const displayName = mode === "signup" && name ? name : deriveNameFromEmail(email);
    onSuccess({ name: displayName, email });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-paper rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden fade-up-visible grid md:grid-cols-2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors md:text-slate md:hover:text-ink"
        >
          <X size={18} />
        </button>

        <div className="hidden md:block h-full min-h-[520px]">
          <AuthIllustration />
        </div>

        <div className="p-8 md:p-10">
          <div className="flex gap-1 bg-ink/5 rounded-full p-1 mb-6 w-fit">
            <button
              onClick={() => setMode("signup")}
              className={
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 " +
                (mode === "signup" ? "bg-ink text-paper" : "text-slate")
              }
            >
              Sign up
            </button>
            <button
              onClick={() => setMode("signin")}
              className={
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 " +
                (mode === "signin" ? "bg-ink text-paper" : "text-slate")
              }
            >
              Sign in
            </button>
          </div>

          <h3 className="font-display text-2xl font-semibold mb-2">
            {mode === "signup" ? "Try AdSquadOps free" : "Welcome back"}
          </h3>
          <p className="text-slate text-sm mb-6">
            {mode === "signup"
              ? "No card required. Set up your first campaign in minutes."
              : "Sign in to your desk."}
          </p>

          {mode === "signup" && (
            <div className="mb-6">
              <p className="text-xs font-medium text-slate mb-2">Choose a plan</p>
              <div className="grid grid-cols-3 gap-2">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.key;
                  return (
                    <button
                      key={plan.key}
                      type="button"
                      onClick={() => setSelectedPlan(plan.key)}
                      className={
                        "relative rounded-lg border-2 p-3 text-left transition-all duration-200 " +
                        (isSelected ? "border-campaign-blue bg-campaign-blue/5" : "border-ink/10 hover:border-ink/20")
                      }
                    >
                      {isSelected && (
                        <Check size={13} className="absolute top-2 right-2 text-campaign-blue" />
                      )}
                      <div className="font-display text-sm font-semibold">{plan.name}</div>
                      <div className="text-xs text-slate mt-0.5">{plan.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
              />
            )}
            <input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
            />

            {mode === "signin" && (
              <div className="text-right">
                <span className="text-xs text-slate hover:text-ink cursor-pointer transition-colors">
                  Forgot password?
                </span>
              </div>
            )}

            <div className="pt-2">
              <Button variant="dark" type="submit">
                {mode === "signup" ? "Create free account" : "Sign in"}
              </Button>
            </div>
          </form>

          <p className="text-slate text-xs mt-5 text-center">
            {mode === "signup" ? "Already have an account? " : "New here? "}
            <span
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="text-ink font-medium cursor-pointer hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
