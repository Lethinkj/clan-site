"use client";

// Clean vector icons for AAA gaming theme
const ShieldIcon = () => (
  <svg className="w-7 h-7 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const SwordIcon = () => (
  <svg className="w-7 h-7 text-[#00E5FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-7 h-7 text-[#FDE047]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const RuneIcon = () => (
  <svg className="w-7 h-7 text-[#C084FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const stats = [
  {
    value: "12+",
    label: "Guild Members",
    icon: <ShieldIcon />,
    badge: "CLAN TROOP",
    glowColor: "rgba(245, 158, 11, 0.3)",
    borderHover: "hover:border-[#FDE047]",
  },
  {
    value: "10+",
    label: "Relics Forged",
    icon: <SwordIcon />,
    badge: "LEGENDARY ARTIFACTS",
    glowColor: "rgba(0, 229, 255, 0.3)",
    borderHover: "hover:border-[#00E5FF]",
  },
  {
    value: "100%",
    label: "Loyalty Rate",
    icon: <StarIcon />,
    badge: "WAR RATING",
    glowColor: "rgba(234, 179, 8, 0.3)",
    borderHover: "hover:border-[#FACC15]",
  },
  {
    value: "∞",
    label: "Mana Pool",
    icon: <RuneIcon />,
    badge: "DARK ELIXIR",
    glowColor: "rgba(168, 85, 247, 0.3)",
    borderHover: "hover:border-[#C084FC]",
  },
];

export default function StatsSection() {
  return (
    <section id="clan" className="relative py-20 bg-[#0B0F19] border-t border-b border-[#F59E0B]/20 overflow-hidden">
      {/* ── Background subtle battle grid / glow ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#151D2F] to-[#0D1322] border border-[#F59E0B]/25 transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_12px_30px_${item.glowColor}] ${item.borderHover} flex flex-col items-center text-center`}
            >
              {/* Corner CoC Stone Rivets */}
              <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#F59E0B]/40 group-hover:bg-[#FDE047] transition-colors" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#F59E0B]/40 group-hover:bg-[#FDE047] transition-colors" />
              <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-[#F59E0B]/40 group-hover:bg-[#FDE047] transition-colors" />
              <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-[#F59E0B]/40 group-hover:bg-[#FDE047] transition-colors" />

              {/* Clan Level Tag */}
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#FDE047]/80 uppercase mb-3 bg-[#0B0F19]/80 px-3 py-1 rounded-full border border-[#F59E0B]/20">
                {item.badge}
              </span>

              {/* Icon Pedestal */}
              <div className="w-14 h-14 rounded-2xl bg-[#0B0F19] border border-[#F59E0B]/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                {item.icon}
              </div>

              {/* Stat Value */}
              <h3 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl font-black text-coc-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] mb-2 tracking-tight group-hover:scale-105 transition-transform">
                {item.value}
              </h3>

              {/* Stat Label */}
              <p className="font-[family-name:var(--font-cinzel)] text-sm sm:text-base font-bold text-white/80 tracking-wider uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
