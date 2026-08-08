import { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { NAV_LINKS, COMPANY_NAME } from "../lib/constants";
import { scrollToId } from "../lib/smoothScroll";

export default function Navbar({ user, onSignIn, onSignUp, onSignOut, onGoToDashboard }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 text-sm text-white font-medium hover:text-white/70 transition-colors"
            >
              {user.name}
              <ChevronDown size={14} className={"transition-transform " + (menuOpen ? "rotate-180" : "")} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-paper rounded-lg shadow-xl border border-ink/10 overflow-hidden">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onGoToDashboard();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-ink/5 transition-colors text-left"
                >
                  <LayoutDashboard size={14} />
                  Go to dashboard
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-campaign-red hover:bg-campaign-red/5 transition-colors text-left"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            )}
          </div>
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
