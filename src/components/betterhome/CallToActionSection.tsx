"use client";

export default function CallToActionSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#0B0F19] via-[#101726] to-[#0B0F19] overflow-hidden border-t border-[#F59E0B]/20">
      {/* ── Background Portal Arc & Glowing Rune Field ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,rgba(11,15,25,0.95)_75%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Clan War Portal Banner Box */}
        <div className="relative p-8 sm:p-14 md:p-16 rounded-3xl bg-gradient-to-b from-[#162035]/90 via-[#0F1626]/90 to-[#0A0E1A]/95 border-2 border-[#F59E0B]/40 shadow-[0_0_50px_rgba(245,158,11,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl">
          
          {/* Stone Castle Corner Rivets */}
          <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#FDE047] shadow-[0_0_8px_#FDE047]" />
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#FDE047] shadow-[0_0_8px_#FDE047]" />
          <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-[#FDE047] shadow-[0_0_8px_#FDE047]" />
          <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-[#FDE047] shadow-[0_0_8px_#FDE047]" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FDE047] animate-ping" />
            <span className="text-xs sm:text-sm font-black tracking-[0.3em] uppercase text-[#FDE047]">
              WAR PORTAL ACTIVATED
            </span>
          </div>

          {/* Title */}
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 select-none">
            HEED THE CALL TO{" "}
            <span className="text-coc-gold drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]">
              ADVENTURE
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-amber-100/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-sans font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            The portal is open. Join our ranks to forge new realities and attain
            eternal glory in the archives of the web.
          </p>

          {/* Main Clan Battle Action Button */}
          <div className="flex justify-center">
            <a
              href="#lore"
              className="btn-primary inline-flex items-center justify-center rounded-full px-10 sm:px-14 py-4 sm:py-5 text-base sm:text-lg font-black tracking-widest uppercase font-[family-name:var(--font-cinzel)] shadow-[0_8px_30px_rgba(245,158,11,0.5)] hover:scale-105 transition-transform cursor-pointer"
            >
              LET THE JOURNEY BEGIN
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
