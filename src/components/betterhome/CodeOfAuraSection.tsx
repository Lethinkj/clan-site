"use client";

const AllianceIcon = () => (
  <svg className="w-7 h-7 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const WisdomIcon = () => (
  <svg className="w-7 h-7 text-[#00E5FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const GloryIcon = () => (
  <svg className="w-7 h-7 text-[#FDE047]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007-6.75l1.644-2.192a.75.75 0 00-.6-1.208H8.453a.75.75 0 00-.6 1.208l1.644 2.192m4.006 0a4.5 4.5 0 01-4.006 0m4.006 0A2.25 2.25 0 0115 10.5h-6a2.25 2.25 0 011.5-2.25" />
  </svg>
);

const MagicIcon = () => (
  <svg className="w-7 h-7 text-[#C084FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

const AscensionIcon = () => (
  <svg className="w-7 h-7 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const PrecisionIcon = () => (
  <svg className="w-7 h-7 text-[#FB7185]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
  </svg>
);

const laws = [
  {
    law: "Alliance",
    title: "Unity Builders",
    description: "Forging unbreakable bonds and seamless teamwork across all realms.",
    icon: <AllianceIcon />,
    perkLevel: "PERK LVL 10",
    color: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.25)",
  },
  {
    law: "Wisdom",
    title: "Knowledge Keepers",
    description: "Sharing ancient scrolls of knowledge to elevate the entire clan.",
    icon: <WisdomIcon />,
    perkLevel: "SPELL FORGE",
    color: "#00E5FF",
    glow: "rgba(0, 229, 255, 0.25)",
  },
  {
    law: "Glory",
    title: "Quality Champions",
    description: "Striving for legendary status in every artifact we create.",
    icon: <GloryIcon />,
    perkLevel: "TITAN LEAGUE",
    color: "#FDE047",
    glow: "rgba(253, 224, 71, 0.25)",
  },
  {
    law: "Magic",
    title: "Creative Sorcery",
    description: "Weaving spells of code to birth innovation from the void.",
    icon: <MagicIcon />,
    perkLevel: "DARK SPELLS",
    color: "#C084FC",
    glow: "rgba(192, 132, 252, 0.25)",
  },
  {
    law: "Ascension",
    title: "Rising Stars",
    description: "Continuously leveling up our skills to reach god-tier potential.",
    icon: <AscensionIcon />,
    perkLevel: "MAX LEVEL",
    color: "#34D399",
    glow: "rgba(52, 211, 153, 0.25)",
  },
  {
    law: "Precision",
    title: "Smart Strikes",
    description: "Executing quests with lethal efficiency and maximum impact.",
    icon: <PrecisionIcon />,
    perkLevel: "EAGLE EYE",
    color: "#FB7185",
    glow: "rgba(251, 113, 133, 0.25)",
  },
];

export default function CodeOfAuraSection() {
  return (
    <section id="lore" className="relative py-24 sm:py-32 bg-[#0B0F19] overflow-hidden">
      {/* ── Ambient Background Glows ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 backdrop-blur-md mb-4 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FDE047]" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FDE047]">
              CLAN DOCTRINE
            </span>
          </div>

          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 select-none">
            THE CODE OF{" "}
            <span className="text-coc-gold drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)]">
              AURA
            </span>
          </h2>

          <p className="font-[family-name:var(--font-cinzel)] text-sm sm:text-base md:text-lg text-amber-100/70 font-semibold tracking-wide">
            The ancient laws that bind our fellowship and guide our craft
          </p>
        </div>

        {/* ── 6 Clan Law Tablets Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {laws.map((item, index) => (
            <div
              key={index}
              className="group relative p-7 sm:p-8 rounded-2xl bg-gradient-to-b from-[#141C2D] via-[#0E1524] to-[#0A0E1A] border-2 border-[#F59E0B]/20 hover:border-[#FDE047]/60 transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden"
              style={{
                boxShadow: `0 8px 25px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              {/* Subtle card corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#F59E0B]/40 group-hover:border-[#FDE047] transition-colors rounded-tl-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#F59E0B]/40 group-hover:border-[#FDE047] transition-colors rounded-tr-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#F59E0B]/40 group-hover:border-[#FDE047] transition-colors rounded-bl-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#F59E0B]/40 group-hover:border-[#FDE047] transition-colors rounded-br-2xl pointer-events-none" />

              {/* Glowing rune back-light on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 20%, ${item.glow} 0%, transparent 70%)`,
                }}
              />

              <div>
                {/* Top Row: Icon + Perk Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#0B0F19] border border-[#F59E0B]/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                    {item.icon}
                  </div>

                  <span className="text-[10px] font-extrabold tracking-widest text-[#FDE047] bg-[#0B0F19]/90 border border-[#F59E0B]/30 px-3 py-1 rounded-full uppercase shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    {item.perkLevel}
                  </span>
                </div>

                {/* Law Name & Subtitle */}
                <h3 className="font-[family-name:var(--font-cinzel)] text-2xl font-black text-white group-hover:text-[#FDE047] transition-colors mb-1">
                  {item.law}
                </h3>
                
                <h4 className="font-[family-name:var(--font-cinzel)] text-xs font-bold tracking-widest uppercase text-[#F59E0B] mb-4">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-white/70 text-sm sm:text-base leading-relaxed font-sans font-normal">
                  {item.description}
                </p>
              </div>

              {/* Bottom decorative bar */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-[family-name:var(--font-cinzel)]">
                <span>CANON LAW #{index + 1}</span>
                <span className="text-[#FDE047] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
