function Person({ size, className = "" }) {
  return (
    <div className={"flex flex-col items-center " + className}>
      <div className="rounded-full bg-ink/25" style={{ width: size * 0.4, height: size * 0.4 }} />
      <div className="rounded-t-full bg-ink/25 mt-1" style={{ width: size * 0.7, height: size * 0.6 }} />
    </div>
  );
}

function SceneCampaign() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-40 h-24 bg-ink/15 rounded-lg flex items-center justify-center float-slow">
        <div className="w-8 h-8 rounded bg-ink/30" />
        <div className="ml-2 space-y-1">
          <div className="w-16 h-1.5 bg-ink/30 rounded" />
          <div className="w-10 h-1.5 bg-ink/20 rounded" />
        </div>
      </div>
      <Person size={44} className="absolute -bottom-2 -left-16 float-medium" />
      <Person size={36} className="absolute -top-4 right-[-70px] float-fast" />
    </div>
  );
}

function SceneQaAlert() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-2xl bg-ink/15 flex items-center justify-center float-slow">
        <div className="w-14 h-14 rounded-lg border-4 border-ink/40 flex items-center justify-center">
          <div className="w-1.5 h-6 bg-ink/50 rounded-full" />
        </div>
      </div>
      <div className="absolute top-6 right-10 w-6 h-6 rounded-full bg-ink/30 float-fast" />
      <div className="absolute bottom-8 left-8 w-4 h-4 rounded-full bg-ink/20 float-medium" />
      <Person size={40} className="absolute bottom-[-30px] right-[-60px] float-medium" />
    </div>
  );
}

function SceneChecklist() {
  const rows = [true, true, false];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-44 bg-ink/15 rounded-xl p-4 space-y-2 float-slow">
        {rows.map((ok, i) => (
          <div key={i} className="flex items-center gap-2 bg-ink/10 rounded px-2 py-1.5">
            <div className={"w-3 h-3 rounded-full " + (ok ? "bg-ink/50" : "bg-ink/25")} />
            <div className="flex-1 h-1.5 bg-ink/20 rounded" />
          </div>
        ))}
      </div>
      <Person size={38} className="absolute top-[-20px] left-[-50px] float-fast" />
    </div>
  );
}

function SceneLaunch() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-ink/15 flex items-center justify-center float-medium">
        <div
          className="w-0 h-0 float-fast"
          style={{
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderBottom: "24px solid rgba(11,15,20,0.4)",
          }}
        />
      </div>
      <Person size={40} className="absolute bottom-[-24px] left-[-56px] float-slow" />
      <Person size={34} className="absolute top-[-16px] right-[-50px] float-medium" />
      <Person size={30} className="absolute bottom-4 right-[-70px] float-fast" />
    </div>
  );
}

const SCENES = [SceneCampaign, SceneQaAlert, SceneChecklist, SceneLaunch];

export default function OnboardingIllustration({ index }) {
  const Scene = SCENES[index] || SceneCampaign;
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <Scene />
    </div>
  );
}
