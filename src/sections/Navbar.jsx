import { NAV_LINKS, COMPANY_NAME } from "../lib/constants";
import { scrollToId } from "../lib/smoothScroll";

export default function Navbar({ user, onSignIn, onSignUp, onSignOut }) {
  return (
    <nav className="sticky top-0 z-50 bg-ink px-6 md:px-10 py-4 flex items-center justify-between border-b border-white/10">
      <div className="font-display font-semibold text-paper text-lg tracking-tight">
        {COMPANY_NAME}
      </div>

      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => {
          const id = link.href.replace("#", "");
          return (
            <button
              key={link.label}
              onClick={() => scrollToId(id, 900)}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <button
            onClick={onSignOut}
            className="text-sm text-white font-medium hover:text-white/70 transition-colors"
            title="Click to sign out"
          >
            {user.name}
          </button>
        ) : (
          <>
            <button
              onClick={onSignIn}
              className="text-sm text-white/70 hover:text-white transition-colors hidden md:block"
            >
              Sign in
            </button>
            <button
              onClick={onSignUp}
              className="text-sm bg-signal-green text-paper px-4 py-2 rounded-md font-medium hover:bg-[#166339] transition-colors"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
