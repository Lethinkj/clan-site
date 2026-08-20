export default function Footer() {
  return (
    <footer className="relative bg-[#070A11] border-t border-[#F59E0B]/20 py-12 text-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
        
        {/* Clan Crest Icon */}
        <div className="w-10 h-10 rounded-full border border-[#F59E0B]/40 bg-[#0B0F19] flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <svg className="w-5 h-5 text-[#FDE047]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l8 6-8 6-8-6 8-6z" />
          </svg>
        </div>

        {/* Clan Copyright */}
        <p className="font-[family-name:var(--font-cinzel)] text-xs sm:text-sm font-bold tracking-[0.25em] text-[#FDE047]/90 uppercase">
          © 2026 CLAN AURA-7F. ESTABLISHED IN THE VOID.
        </p>

        {/* High Council Signature */}
        <p className="font-[family-name:var(--font-cinzel)] text-xs text-white/50 tracking-wider">
          Forged by the High Council
        </p>

      </div>
    </footer>
  );
}
