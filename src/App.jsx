import { useState, useEffect } from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import AdOpsOverview from "./sections/AdOpsOverview";
import ProblemStrip from "./sections/ProblemStrip";
import CampaignNews from "./sections/CampaignNews";
import ProductWalkthrough from "./sections/ProductWalkthrough";
import HowItWorks from "./sections/HowItWorks";
import Pricing from "./sections/Pricing";
import FinalCTA from "./sections/FinalCTA";
import Footer from "./sections/Footer";
import AuthModal from "./components/AuthModal";
import Dashboard from "./sections/Dashboard";
import PersonaSelect from "./sections/PersonaSelect";
import PageTransition from "./components/PageTransition";

const USER_STORAGE_KEY = "adsquadops_user";
const PERSONA_STORAGE_KEY = "adsquadops_persona";

const FADE_IN_MS = 300;
const HOLD_MS = 1400;
const FADE_OUT_MS = 300;

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

function App() {
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(loadStoredUser);
  const [persona, setPersona] = useState(loadStoredPersona);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    window.history.replaceState({ view: "landing" }, "", window.location.pathname);

    function handlePopState(e) {
      setView(e.state?.view || "landing");
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigateTo(nextView) {
    setIsTransitioning(true);
    setOverlayVisible(true);

    setTimeout(() => {
      setView(nextView);
      const path = nextView === "dashboard" ? "/dashboard" : nextView === "persona" ? "/persona" : "/";
      window.history.pushState({ view: nextView }, "", path);
    }, FADE_IN_MS);

    setTimeout(() => {
      setOverlayVisible(false);
    }, FADE_IN_MS + HOLD_MS);

    setTimeout(() => {
      setIsTransitioning(false);
    }, FADE_IN_MS + HOLD_MS + FADE_OUT_MS);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) setShowModal(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [user]);

  function openModal(mode) {
    setAuthMode(mode);
    setShowModal(true);
  }

  function handleAuthSuccess(userData) {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setShowModal(false);
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
      {isTransitioning && <PageTransition visible={overlayVisible} />}

      {view === "persona" && (
        <PersonaSelect onSelect={handlePersonaSelect} onBack={() => navigateTo("landing")} />
      )}

      {view === "dashboard" && (
        <Dashboard onExit={() => navigateTo("landing")} persona={persona} />
      )}

      {view === "landing" && (
        <div className="min-h-screen bg-paper text-ink font-body">
          <Navbar
            user={user}
            onSignIn={() => openModal("signin")}
            onSignUp={() => openModal("signup")}
            onSignOut={handleSignOut}
          />
          <Hero onRequestDemo={goToDemo} />
          <AdOpsOverview />
          <ProblemStrip />
          <CampaignNews />
          <ProductWalkthrough />
          <HowItWorks />
          <Pricing />
          <FinalCTA onTryDashboard={user ? goToDemo : () => openModal("signup")} />
          <Footer />

          {showModal && (
            <AuthModal onClose={() => setShowModal(false)} onSuccess={handleAuthSuccess} initialMode={authMode} />
          )}
        </div>
      )}
    </>
  );
}

export default App;
