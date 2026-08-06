import { User, Users } from "lucide-react";

export default function PersonaToggle({ persona, setPersona }) {
  return (
    <div className="inline-flex items-center gap-1 bg-white/5 rounded-full p-1.5">
      <button
        onClick={() => setPersona("individual")}
        className={
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 " +
          (persona === "individual" ? "bg-paper text-ink" : "text-white/50")
        }
      >
        <User size={14} />
        Individual
      </button>
      <button
        onClick={() => setPersona("team")}
        className={
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 " +
          (persona === "team" ? "bg-paper text-ink" : "text-white/50")
        }
      >
        <Users size={14} />
        Team
      </button>
    </div>
  );
}
