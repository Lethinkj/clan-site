import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function MemberCardMDB({
  name,
  title,
  avatar,
  github,
  portfolio,
  linkedin,
  bio,
  skills = [],
  isCaptain = false
  , compact = false, compactSize = 'small', onClick
}) {
  const { theme } = useTheme()
  const fallback = 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp'
  const cardBg = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const titleColor = theme === 'dark' ? 'text-white' : 'text-slate-800'
  const subColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'

  if (compact) {
    // render as 50% image / 50% text, 30% larger visual size
    // make captains slightly larger; non-captains reduced ~10% and keep rectangular shape
    let imgHeight
    if (compactSize === 'large') {
      // keep captains larger; shrink other members ~15%
      imgHeight = isCaptain ? 'h-44 md:h-52' : 'h-32 md:h-36'
    } else {
      imgHeight = isCaptain ? 'h-32 md:h-36' : 'h-24 md:h-28'
    }
    return (
      <div onClick={onClick} role="button" tabIndex={0} className={`rounded-lg shadow-md overflow-hidden border ${cardBg} cursor-pointer p-3 flex items-stretch gap-4`}>
        <div className="w-1/2 flex items-center justify-center p-1">
          <img
            src={avatar || fallback}
            alt={name || 'Avatar'}
            // keep rectangular look by constraining height and letting width fill
            className={`w-full ${imgHeight} object-cover rounded-md`}
          />
        </div>
        <div className="w-1/2 p-2 flex flex-col justify-center min-w-0">
          <div className={`text-lg md:text-xl font-semibold ${titleColor} truncate`}>{name}</div>
          {title && <div className={`text-sm ${subColor} mt-2 truncate`}>{title}</div>}
          <div className="text-[12px] text-slate-400 mt-3">Click to see more</div>
        </div>
      </div>
    )
  }

  return (
    <div onClick={onClick} role="button" tabIndex={0} className={`rounded-xl shadow-sm overflow-hidden border ${cardBg} cursor-pointer`}>
      <div className="flex p-4 gap-4">
        <div className="flex-shrink-0 flex flex-col items-center">
          <img
            src={avatar || fallback}
            alt={name || 'Avatar'}
            // reduce non-captain avatar size ~15% and keep rectangular for members
            className={`${isCaptain ? 'w-36 h-36' : 'w-28 h-20'} rounded-lg object-cover`}
          />

          {/* show social links under avatar for regular members; captains render links on the right */}
          {!isCaptain && (
            <div className="mt-3 flex flex-wrap gap-2 max-w-full" style={{ maxHeight: '3.6rem', overflow: 'hidden' }}>
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer" className={`text-sm ${subColor} underline whitespace-nowrap`}>Github</a>
              )}
              {portfolio && (
                <a href={portfolio} target="_blank" rel="noopener noreferrer" className={`text-sm ${subColor} underline whitespace-nowrap`}>Portfolio</a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className={`text-sm ${subColor} underline whitespace-nowrap`}>LinkedIn</a>
              )}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${titleColor}`}>{name}</h3>
          <p className={`text-sm ${subColor} mt-1`}>{title}</p>
          {bio && <p className={`mt-2 text-sm ${subColor} line-clamp-3`}>{bio}</p>}

          {skills && skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.slice(0, 6).map((s, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-700">{s}</span>
              ))}
            </div>
          )}
          {isCaptain && (
            <div className="mt-4 flex flex-wrap items-start gap-2 max-w-full" style={{ maxHeight: '3.6rem', overflow: 'hidden' }}>
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer" className={`text-sm ${subColor} underline whitespace-nowrap`}>Github</a>
              )}
              {portfolio && (
                <a href={portfolio} target="_blank" rel="noopener noreferrer" className={`text-sm ${subColor} underline whitespace-nowrap`}>Portfolio</a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className={`text-sm ${subColor} underline whitespace-nowrap`}>LinkedIn</a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
