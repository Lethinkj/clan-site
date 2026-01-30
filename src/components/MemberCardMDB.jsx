import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function MemberCardMDB({
  name, title, avatar, github, portfolio, linkedin, bio,
  skills = [], isCaptain = false, compact = false, compactSize = 'small', onClick
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const fallback = 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp';

  // Aesthetic definitions
  const glassEffect = isDark
    ? 'bg-slate-900/40 backdrop-blur-xl border-slate-700/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]'
    : 'bg-white/70 backdrop-blur-xl border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]';

  const accentColor = isCaptain ? 'text-indigo-500' : 'text-blue-500';
  const nameColor = isDark ? 'text-white' : 'text-slate-900';
  const bioColor = isDark ? 'text-slate-400' : 'text-slate-600';

  const SocialIconLink = ({ href, label }) => {
    if (!href) return null;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-500/20 ${bioColor} hover:bg-blue-500 hover:text-white transition-all duration-300`}
      >
        {label}
      </a>
    );
  };

  /**
   * COMPACT VIEW: Minimalist & Fast
   */
  if (compact) {
    const imgHeight = compactSize === 'large' ? 'h-40' : 'h-28';
    return (
      <div
        onClick={onClick}
        className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-1 ${glassEffect} cursor-pointer p-4 flex items-center gap-6`}
      >
        <div className="relative w-1/3 overflow-hidden rounded-xl aspect-square">
          <img
            src={avatar || fallback}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={name}
          />
        </div>
        <div className="w-2/3">
          <h3 className={`text-lg font-bold leading-tight ${nameColor}`}>{name}</h3>
          <p className={`text-xs font-semibold uppercase tracking-wider mt-1 ${accentColor}`}>{title}</p>
          <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity">
            VIEW PROFILE <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    );
  }

  /**
   * DETAIL VIEW: The "Hero" Card
   */
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-[2rem] border p-1 transition-all duration-500 hover:shadow-2xl cursor-pointer ${isCaptain ? 'bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20' : ''}`}
    >
      <div className={`relative h-full w-full rounded-[1.9rem] p-6 md:p-8 ${glassEffect}`}>

        {/* Top Section: Avatar & Identity */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative shrink-0 mx-auto md:mx-0">
            <div className={`absolute -inset-1 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${isCaptain ? 'bg-indigo-500' : 'bg-blue-500'}`}></div>
            <img
              src={avatar || fallback}
              className={`relative ${isCaptain ? 'w-40 h-40' : 'w-32 h-32 md:w-36 md:h-24'} rounded-2xl object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]`}
              alt={name}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className={`text-3xl font-black tracking-tight ${nameColor}`}>{name}</h3>
                <p className={`text-sm font-bold tracking-[0.2em] uppercase mt-1 ${accentColor}`}>{title}</p>
              </div>
              {isCaptain && (
                <span className="self-center md:self-start px-4 py-1.5 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  Lead Captain
                </span>
              )}
            </div>

            <p className={`mt-6 text-sm leading-relaxed font-medium ${bioColor} line-clamp-3 md:line-clamp-none max-w-xl`}>
              {bio || "No biography provided. A mysterious contributor to the team."}
            </p>

            {/* Skills: Styled as Modern Minimalist Tags */}
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-2">
              {skills.slice(0, 6).map((skill, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${isDark
                      ? 'bg-white/5 border-white/10 text-slate-300 group-hover:border-blue-500/30'
                      : 'bg-slate-900/5 border-slate-900/5 text-slate-600 group-hover:border-blue-500/30'
                    }`}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Footer: Social Links */}
            <div className="mt-8 pt-6 border-t border-slate-500/10 flex flex-wrap justify-center md:justify-start gap-3">
              <SocialIconLink href={github} label="Github" />
              <SocialIconLink href={portfolio} label="Portfolio" />
              <SocialIconLink href={linkedin} label="LinkedIn" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}