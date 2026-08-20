import ParticleField from "./ParticleField";
import KingVideo from "./KingVideo";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen w-full flex items-center overflow-hidden">
      {/* ── Background video ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* ── Layered Vignette Overlays for Contrast & Atmosphere ── */}
      <div className="absolute inset-0 bg-[#0B0F19]/60 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/95 via-[#0B0F19]/60 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-[#0B0F19]/70 z-[1]" />

      {/* ── Floating Embers ── */}
      <ParticleField count={45} />

      {/* ── Main Container: Split-Screen Layout ── */}
      <div className="relative z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-12 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center w-full">
          
          {/* ── Left Column: Content & CTAs (Columns 1-7) ── */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-30">
            {/* Realm Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 backdrop-blur-md mb-5 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FDE047] animate-ping" />
              <span className="text-xs sm:text-sm font-bold tracking-[0.35em] uppercase text-[#FDE047] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                REALM OF AURA-7F
              </span>
            </div>

            {/* Main Title - CoC Bold Fantasy Typography */}
            <h1 className="font-[family-name:var(--font-cinzel)] font-black text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.08] select-none mb-5">
              <span className="text-coc-gold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                FORGING LEGENDS
              </span>
              <br />
              <span className="text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] text-[0.85em] tracking-normal">
                IN THE{" "}
              </span>
              <span className="text-coc-gold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                DIGITAL VOID
              </span>
            </h1>

            {/* Description - High contrast & crystal clear */}
            <p className="text-amber-100/90 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mb-8 font-sans font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              A fellowship of code-wizards and digital architects. We craft
              legendary software artifacts through unity and forbidden technologies.
            </p>

            {/* Action Buttons (Row) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center w-full sm:w-auto">
              <a
                href="#guild"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm sm:text-base font-extrabold tracking-wider uppercase font-[family-name:var(--font-cinzel)] cursor-pointer"
              >
                ENTER THE GUILD
              </a>
              <a
                href="#quests"
                className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm sm:text-base font-bold tracking-wider uppercase font-[family-name:var(--font-cinzel)] cursor-pointer"
              >
                VIEW QUESTS
              </a>
            </div>

            {/* Clan Stats / Social Proof */}
            <div className="flex items-center gap-5 justify-center lg:justify-start mt-8 text-amber-200/70 text-xs sm:text-sm font-semibold tracking-wider uppercase font-[family-name:var(--font-cinzel)]">
              <span className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                2.4K Online
              </span>
              <span>•</span>
              <span>12K+ Members</span>
              <span>•</span>
              <span>150+ Projects</span>
            </div>
          </div>

          {/* ── Mobile King Display (True Transparency) ── */}
          <div className="lg:hidden w-full flex justify-center items-end mt-4">
            <KingVideo className="w-[340px] h-[400px] sm:w-[420px] sm:h-[480px] scale-110 origin-bottom" />
          </div>

        </div>
      </div>

      {/* ── Barbarian King (Desktop): Massive Towering Right-Side Visual Anchor (True GPU Transparency) ── */}
      <div className="hidden lg:block absolute right-[-2%] xl:right-[1%] 2xl:right-[3%] bottom-0 top-0 w-[55%] xl:w-[52%] 2xl:w-[50%] z-20 pointer-events-none overflow-visible">
        <div className="w-full h-full flex items-end justify-center scale-125 xl:scale-135 2xl:scale-145 origin-bottom">
          <KingVideo className="w-full h-full" />
        </div>
      </div>

      {/* ── Bottom Edge Shadow Fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0B0F19] to-transparent z-30 pointer-events-none" />
    </section>
  );
}
