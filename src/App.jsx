import { useState, useEffect } from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import AdOpsOverview from "./sections/AdOpsOverview";
import ProblemStrip from "./sections/ProblemStrip";
import CampaignNews from "./sections/CampaignNews";
import ProductWalkthrough from "./sections/ProductWalkthrough";
import HowItWorks from "./sections/HowItWorks";
import FinalCTA from "./sections/FinalCTA";
import Footer from "./sections/Footer";
import Dashboard from "./sections/Dashboard";
import PersonaSelect from "./sections/PersonaSelect";
import AuthPage from "./sections/AuthPage";

const USER_STORAGE_KEY = "adsquadops_user";
const PERSONA_STORAGE_KEY = "adsquadops_persona";

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadStoredPersona() {
  return localStorage.getItem(PERSONA_STORAGE_KEY);
}

const VIEW_PATHS = {
  landing: "/",
  dashboard: "/dashboard",
  persona: "/persona",
  login: "/login",
  signup: "/register",
};

function App() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(loadStoredUser);
  const [persona, setPersona] = useState(loadStoredPersona);

  useEffect(() => {
    window.history.replaceState({ view: "landing" }, "", window.location.pathname);

    function handlePopState(e) {
      setView(e.state?.view || "landing");
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigateTo(nextView) {
    setView(nextView);
    window.history.pushState({ view: nextView }, "", VIEW_PATHS[nextView] || "/");
  }

  function handleAuthSuccess(userData) {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    navigateTo("landing");
  }

  function handleSignOut() {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  function goToDemo() {
    if (persona) {
      navigateTo("dashboard");
    } else {
      navigateTo("persona");
    }
  }

  function handlePersonaSelect(chosenPersona) {
    setPersona(chosenPersona);
    localStorage.setItem(PERSONA_STORAGE_KEY, chosenPersona);
    navigateTo("dashboard");
  }

  return (
    <>
      {view === "login" && (
        <AuthPage
          mode="login"
          onSuccess={handleAuthSuccess}
          onSwitchMode={navigateTo}
          onBack={() => navigateTo("landing")}
        />
      )}

      {view === "signup" && (
        <AuthPage
          mode="signup"
          onSuccess={handleAuthSuccess}
          onSwitchMode={navigateTo}
          onBack={() => navigateTo("landing")}
        />
      )}

      {view === "persona" && (
        <PersonaSelect onSelect={handlePersonaSelect} onBack={() => navigateTo("landing")} />
      )}

      {view === "dashboard" && (
        <Dashboard onExit={() => navigateTo("landing")} persona={persona} user={user} />
      )}

      {view === "landing" && (
        <div className="min-h-screen bg-paper text-ink font-body">
          <Navbar
            user={user}
            onSignIn={() => navigateTo("login")}
            onSignUp={() => navigateTo("signup")}
            onSignOut={handleSignOut}
            onGoToDashboard={goToDemo}
          />
          <Hero onRequestDemo={goToDemo} />
          <AdOpsOverview />
          <ProblemStrip />
          <CampaignNews />
          <ProductWalkthrough />
          <HowItWorks />
          <FinalCTA onTryDashboard={user ? goToDemo : () => navigateTo("signup")} />
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
