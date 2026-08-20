"use client";

import { useState } from "react";

const navLinks = [
  { id: "home", label: "Home", href: "#home" },
  { id: "lore", label: "Lore", href: "#lore" },
  { id: "clan", label: "Clan", href: "#clan" },
  { id: "quests", label: "Quests", href: "#quests" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "milestones", label: "Milestones", href: "#milestones" },
  { id: "quiz", label: "Quiz", href: "#quiz" },
  { id: "gallery", label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md border-b border-[#F59E0B]/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ── Logo ── */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick("home", e)}
            className="flex items-center gap-2 group tracking-widest font-[family-name:var(--font-cinzel-decorative)] font-bold text-xl sm:text-2xl"
          >
            <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              AURA-
            </span>
            <span className="text-[#FDE047] drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">
              7F
            </span>
          </a>

          {/* ── Desktop links ── */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link.id, e)}
                  className={`text-sm font-semibold tracking-wider transition-all duration-300 uppercase cursor-pointer ${
                    isActive
                      ? "nav-active"
                      : "text-white/70 hover:text-[#FDE047] hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href="#login"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("login");
              }}
              className="ml-2 inline-flex items-center justify-center rounded-full border-2 border-[#F59E0B] bg-[#F59E0B]/10 px-6 py-1.5 text-xs font-bold tracking-widest text-[#FDE047] uppercase transition-all duration-300 hover:bg-[#F59E0B] hover:text-[#0B0F19] hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] cursor-pointer"
            >
              LOGIN
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 text-[#FDE047]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-[#FDE047] transition-transform duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-[#FDE047] transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-[#FDE047] transition-transform duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          menuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-6 pt-2 flex flex-col gap-3 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-[#F59E0B]/20">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`text-sm font-semibold tracking-wider py-2 transition-colors duration-300 uppercase cursor-pointer ${
                  isActive
                    ? "text-[#FDE047]"
                    : "text-white/70 hover:text-[#FDE047]"
                }`}
                onClick={(e) => handleLinkClick(link.id, e)}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="#login"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#F59E0B] bg-[#F59E0B] px-6 py-2.5 text-xs font-bold tracking-widest text-[#0B0F19] uppercase mt-3 shadow-[0_0_15px_rgba(245,158,11,0.5)] cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("login");
              setMenuOpen(false);
            }}
          >
            LOGIN
          </a>
        </div>
      </div>
    </nav>
  );
}
