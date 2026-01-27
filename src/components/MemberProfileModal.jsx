import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function MemberProfileModal({ members = [], initialIndex = 0, onClose }) {
  const { theme } = useTheme()
  const [index, setIndex] = useState(initialIndex)
  const thumbsRef = useRef([])
  const modalRef = useRef(null)
  const scrollRef = useRef(null)
  
  const isDown = useRef(false)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftStart = useRef(0)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => setIndex(initialIndex), [initialIndex])
  useEffect(() => { modalRef.current?.focus() }, [])

  useEffect(() => {
    const el = thumbsRef.current[index]
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [index])

  const handleKeyDown = (e) => {
    if (!members || members.length === 0) return
    if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % members.length)
    else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + members.length) % members.length)
    else if (e.key === 'Escape') onClose && onClose()
  }

  const handleMouseDown = (e) => {
    isDown.current = true
    isDragging.current = false
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeftStart.current = scrollRef.current.scrollLeft
  }

  const handleMouseMove = (e) => {
    if (!isDown.current) return
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 2 
    if (Math.abs(walk) > 3) isDragging.current = true
    if (isDragging.current) {
      e.preventDefault() 
      scrollRef.current.scrollLeft = scrollLeftStart.current - walk
    }
  }

  const handleMouseUpOrLeave = () => {
    isDown.current = false
    setTimeout(() => { isDragging.current = false }, 10)
  }

  const member = members[index] || null
  if (!member) return null

  const isCaptain = member.role?.toLowerCase().includes('captain')
  const avatarSrc = member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=600`

  const overlayBg = theme === 'dark' ? 'bg-black/85' : 'bg-black/60'
  const panelBg = theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
  const titleColor = theme === 'dark' ? 'text-white' : 'text-slate-900'
  const contentColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500'

  return (
    <div 
      ref={modalRef} 
      tabIndex={0} 
      onKeyDown={handleKeyDown} 
      className={`fixed inset-0 z-50 flex items-center justify-center ${overlayBg} backdrop-blur-sm p-4 outline-none`}
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-3xl rounded-2xl overflow-hidden ${panelBg} transition-all duration-500 shadow-xl
          ${isCaptain ? 'ring-1 ring-cyan-500/40 shadow-[0_0_30px_-10px_rgba(6,182,212,0.4)]' : ''}`} 
        onClick={e => e.stopPropagation()} 
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Image (smaller) */}
          <div className="relative w-full md:w-1/3 h-[36vh] md:h-[56vh] overflow-hidden">
            <img
              src={avatarSrc}
              alt={member.name}
              className="w-full h-full object-cover"
            />
            
            {isCaptain && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-yellow-400 text-black font-black text-[10px] px-2 py-0.5 rounded shadow-lg transform -rotate-12 border border-black uppercase tracking-wider animate-pulse">
                  Captain
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Info (expanded) */}
          <div className="w-full md:w-2/3 p-6 flex flex-col justify-between border-l border-white/5">
            <div>
              <div className="flex justify-between items-start md:block">
                <div className="space-y-0.5">
                  <h2 className={`text-xl md:text-2xl font-black leading-tight tracking-tight ${titleColor}`}>
                    {member.name}
                  </h2>
                  <p className="text-cyan-400 font-bold text-[10px] uppercase tracking-widest">
                    {member.role}
                  </p>
                </div>
                
                <button onClick={onClose} className="md:hidden p-1">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {member.bio && (
                <div className="mt-3 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                  <p className={`text-[11px] leading-relaxed font-medium ${contentColor}`}>
                    {member.bio}
                  </p>
                </div>
              )}

              {/* Skills */}
              {member.skills && member.skills.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-semibold mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social links */}
              <div className="mt-4 flex flex-wrap gap-2">
                {member.github && <a href={member.github} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 bg-cyan-700/10 text-cyan-300 rounded">Github</a>}
                {member.portfolio && <a href={member.portfolio} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 bg-cyan-700/10 text-cyan-300 rounded">Portfolio</a>}
                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 bg-cyan-700/10 text-cyan-300 rounded">LinkedIn</a>}
              </div>
            </div>

            {/* Switcher */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-30">Team</span>
                <button onClick={onClose} className="hidden md:block p-1 hover:bg-white/10 rounded-full transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className="flex gap-3 overflow-x-auto pb-2 pr-2 cursor-grab active:cursor-grabbing scroll-smooth"
              >
                {members.map((m, i) => (
                  <button 
                    key={i}
                    ref={el => (thumbsRef.current[i] = el)}
                    onClick={() => !isDragging.current && setIndex(i)}
                    className={`flex-shrink-0 w-20 text-center focus:outline-none ${i === index ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <div className={`w-16 h-16 mx-auto rounded-md overflow-hidden border ${i === index ? 'border-cyan-400 shadow-md' : 'border-transparent'}`}>
                      <img src={m.avatar || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(m.name) + '&background=0D1117&color=fff&size=128')} className="w-full h-full object-cover" alt={m.name} />
                    </div>
                    <div className="text-xs mt-1 truncate w-20 text-center" style={{color: contentColor}}>{m.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}