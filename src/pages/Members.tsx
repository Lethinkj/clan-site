import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MemberCardMDB from '../components/MemberCardMDB'
import { useTheme } from '../contexts/ThemeContext'
import MemberProfileModal from '../components/MemberProfileModal'
import Meteors from '../components/Meteors'
import { supabase } from '../lib/supabase'
import { Crown, Sparkles, Shield, Users } from 'lucide-react'

// Types (kept same)
type APIMember = {
  name: string
  github_username?: string
  portfolio_url?: string | null
  linkedin_url?: string | null
  primary_domain?: string[] | null
  secondary_domain?: string[] | null
}

type Person = {
  name: string
  role: string
  specialization?: string
  bio?: string
  skills?: string[]
  portfolio?: string
  github?: string
  linkedin?: string
  avatar_url?: string
}

// Role assignments (kept same)
const captainRoles: Record<string, { role: string; specialization: string; bio: string; skills: string[] }> = {
  'Shaniya': { role: 'Guild Master', specialization: 'Cyber Security', bio: 'Guardian of the digital fortress.', skills: ['React', 'Node.js', 'Python'] },
  'Mohamed Ashif': { role: 'Archmage', specialization: 'UX Sorcery', bio: 'Weaving spells of visual enchantment.', skills: ['Python', 'React', 'MySQL', 'PostgreSQL'] }
}

const memberRoles: Record<string, { role: string; specialization: string; bio: string; skills: string[] }> = {
  'Lethin': { role: 'Seer', specialization: 'Data Divination', bio: 'Reading the omens in the data streams.', skills: ['Python', 'SQL', 'Machine Learning'] },
  'Jijo': { role: 'Artificer', specialization: 'Construct Building', bio: 'Forging robust digital constructs.', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'] },
  'Bennyhinn Sam': { role: 'Runesmith', specialization: 'Backend Architecture', bio: 'Etching the deep runes of the system.', skills: ['Java', 'Spring', 'PostgreSQL', 'Docker'] },
  'Anitus': { role: 'Blade', specialization: 'Frontend Arts', bio: 'Sharp and precise interface crafting.', skills: ['Vue.js', 'TypeScript', 'CSS3', 'WebGL'] },
  'Lifnan shijo': { role: 'Summoner', specialization: 'Cloud Binding', bio: 'Summoning resources from the ether.', skills: ['Kubernetes', 'Terraform', 'Jenkins', 'Azure'] },
  'Archana': { role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
  'Alisha': { role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
  'Shailu Mirsha': { role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
  'Arthi': { role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Machine Learning', 'Data Analysis', 'API Testing'] },
  'Beule Sujarsa': { role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] }
}

const captainNames = ['Shaniya', 'Mohamed Ashif']

const fallbackMembers: Person[] = [
  // ... (Similar fallback data but can be brief for brevity in edit, preserving mostly)
  { name: 'Shaniya', role: 'Guild Master', specialization: 'Cyber Security', bio: 'Guardian of the digital fortress.', skills: ['React', 'Node.js', 'Python', 'AWS'], github: 'https://github.com/shaniya-v', linkedin: 'https://www.linkedin.com/in/shaniya-v-02b514280' },
  { name: 'Mohamed Ashif', role: 'Archmage', specialization: 'UX Sorcery', bio: 'Weaving spells of visual enchantment.', skills: ['Python', 'React', 'MySQL', 'PostgreSQL'], github: 'https://github.com/mohamed-ashif-m', linkedin: 'https://www.linkedin.com/in/mohamedashif175/' },
  { name: 'Lethin', role: 'Seer', specialization: 'Data Divination', bio: 'Reading the omens in the data streams.', skills: ['Python', 'SQL', 'Machine Learning'], portfolio: 'https://lethin.work.gd', github: 'https://github.com/Lethinkj', linkedin: 'https://www.linkedin.com/in/lethin-k-j-510674293' },
  { name: 'Jijo', role: 'Artificer', specialization: 'Construct Building', bio: 'Forging robust digital constructs.', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'], portfolio: 'https://jijog-jijog.github.io/', github: 'https://github.com/jijog-jijog', linkedin: 'https://www.linkedin.com/in/jijorogerz186' },
  { name: 'Bennyhinn Sam', role: 'Runesmith', specialization: 'Backend Architecture', bio: 'Etching the deep runes of the system.', skills: ['Java', 'Spring', 'PostgreSQL', 'Docker'], portfolio: 'https://bennyhinn.vercel.app', github: 'https://github.com/bennyhinn18', linkedin: 'https://linkedin.com/in/bennyhinn-sam' },
  { name: 'Anitus', role: 'Blade', specialization: 'Frontend Arts', bio: 'Sharp and precise interface crafting.', skills: ['Vue.js', 'TypeScript', 'CSS3'], portfolio: 'https://anitusa.github.io/Anitus-portfolio', github: 'https://github.com/AnitusA', linkedin: 'https://www.linkedin.com/in/aanitus' },
  { name: 'Lifnan shijo', role: 'Summoner', specialization: 'Cloud Binding', bio: 'Summoning resources from the ether.', skills: ['Kubernetes', 'Jenkins', 'Azure'], github: 'https://github.com/lifnanshijo', linkedin: 'https://www.linkedin.com/in/lifnan-shijo-r-66719935b' },
  { name: 'Archana', role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['DSA', 'API Testing'], github: 'https://github.com/Carchana2006' },
  { name: 'Alisha', role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Python', 'API Testing'], portfolio: 'https://my-portfolio-as.lovable.app', github: 'https://github.com/alisha1806', linkedin: 'https://www.linkedin.com/in/alisha-as-58aa7b33a' },
  { name: 'Shailu Mirsha', role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Python', 'C#', 'API Testing'], github: 'https://github.com/Shailu-Mirsha', linkedin: 'https://in.linkedin.com/in/shailu-mirsha-b83ba0360' },
  { name: 'Arthi', role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Machine Learning', 'Data Analysis', 'API Testing'], github: 'https://github.com/Arthi-as', linkedin: 'https://www.linkedin.com/in/arthi-a-s-17500835b' },
  { name: 'Beule Sujarsa', role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Python', 'C#', 'API Testing'], github: 'https://github.com/Beule-Sujarsa' }
]

export default function Members() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [members, setMembers] = useState<Person[]>([])
  const [avatarsMap, setAvatarsMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [modalIndex, setModalIndex] = useState<number | null>(null)

  useEffect(() => {
    // Also fetch a simple map of usernames -> avatar_url as a reliable fallback
    (async function fetchAvatarsMap() {
      try {
        const { data: users, error: usersError } = await supabase.from('users').select('username, avatar_url')
        if (!usersError && users) {
          const map: Record<string, string> = {}
          users.forEach((u: any) => {
            if (u.username && u.avatar_url) map[u.username.trim().toLowerCase()] = u.avatar_url
          })
          setAvatarsMap(map)
        }
      } catch (e) {
        console.warn('Failed to fetch avatars map', e)
      }
    })()

    // Fetch members logic (simplified for rewrite, keeping core logic)
    fetch('https://terminal.bytebashblitz.org/api/clan/1?fields=name,github_username,portfolio_url,linkedin_url,primary_domain,secondary_domain', {
      method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, mode: 'cors'
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(async data => {
        if (data.success && data.data && data.data.members) {
          // ... (Merging logic from original file, but mapping to new roles)
          const apiMembersBase = data.data.members.map((m: APIMember) => {
            const roleInfo = captainRoles[m.name] || memberRoles[m.name] || {
              role: 'Novice',
              specialization: 'Apprentice',
              bio: 'A rising star in the guild.',
              skills: ['JavaScript']
            }
            const skills = (m.primary_domain || []).concat(m.secondary_domain || [])
            return {
              name: m.name,
              ...roleInfo,
              skills: skills.length > 0 ? skills : roleInfo.skills,
              portfolio: m.portfolio_url || undefined,
              github: m.github_username ? `https://github.com/${m.github_username}` : undefined,
              linkedin: m.linkedin_url || undefined,
              avatar_url: undefined
            }
          })

          // Avatar merging (simplified reuse)
          try {
            const { data: users } = await supabase.from('users').select('username, avatar_url')
            if (users) {
              const map: Record<string, string> = {}
              users.forEach((u: any) => { if (u.username) map[u.username.trim().toLowerCase()] = u.avatar_url })
              const apiMembers = apiMembersBase.map((m: any) => ({ ...m, avatar_url: map[m.name.trim().toLowerCase()] }))
              setMembers(apiMembers)
            } else { setMembers(apiMembersBase) }
          } catch { setMembers(apiMembersBase) }
          setLoading(false)
        } else throw new Error('Invalid format')
      })
      .catch(() => {
        setMembers(fallbackMembers)
        setLoading(false)
      })
  }, [])

  const captains = members.filter(m => captainNames.includes(m.name))
  const teamMembers = members.filter(m => !captainNames.includes(m.name))

  const resolvedMembers = members.map(m => {
    const key = (m.name || '').trim().toLowerCase()
    const resolvedAvatar = m.avatar_url || avatarsMap[key] || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=0f0518&color=ffd700&size=256`
    return { ...m, avatar: resolvedAvatar }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-amber-100/60 font-cinzel animate-pulse">Summoning the Guild...</p>
        </div>
      </div>
    )
  }

  return (
    <div id="members-title" className="relative min-h-screen pb-12">
      {/* <Meteors count={20} /> */}

      {/* Header */}
      <section className="text-center px-4 pt-12 pb-16 relative z-10">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-amber-500/20 bg-black/30 backdrop-blur text-amber-400 text-xs font-cinzel font-bold tracking-widest uppercase">
          {/* <Users size={12} />
          The Fellowship */}
        </div>
        <h1 className="text-4xl sm:text-6xl font-cinzel font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          Champions of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">Aura</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-300 font-lato text-lg">
          United by the code, bound by the craft. Meet the wizards forging our digital legacy.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-20">

        {/* Captains */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-amber-500/5 rounded-3xl blur-xl"></div>
          <div className="relative text-center mb-10">
            <Crown className="w-8 h-8 text-amber-500 mx-auto mb-2 drop-shadow-lg" />
            <h2 className="text-3xl font-cinzel font-bold text-white">Guild Masters</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            {captains.map(member => {
              const idx = members.findIndex(m => m.name === member.name)
              return (
                <div key={member.name} className="transform hover:-translate-y-2 transition-transform duration-300">
                  <MemberCardMDB
                    compact={true}
                    compactSize="large"
                    onClick={() => navigate(`/profile/${member.name}`)}
                    name={member.name}
                    title={member.role}
                    avatar={resolvedMembers[idx]?.avatar}
                    github={member.github}
                    portfolio={member.portfolio}
                    linkedin={member.linkedin}
                    bio={member.bio}
                    skills={member.skills ?? []}
                    isCaptain={true}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-10">
            <Shield className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h2 className="text-2xl font-cinzel font-bold text-slate-200">The Vanguard</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map(member => {
              const idx = members.findIndex(m => m.name === member.name)
              return (
                <div key={member.name}>
                  <MemberCardMDB
                    compact={true}
                    compactSize="large"
                    onClick={() => navigate(`/profile/${member.name}`)}
                    name={member.name}
                    title={member.role}
                    avatar={resolvedMembers[idx]?.avatar}
                    github={member.github}
                    portfolio={member.portfolio}
                    linkedin={member.linkedin}
                    bio={member.bio}
                    skills={member.skills ?? []}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {modalIndex !== null && (
        <MemberProfileModal
          members={resolvedMembers}
          initialIndex={modalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}
    </div>
  )
}
