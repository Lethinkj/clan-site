import React, { useState, useEffect, useMemo } from 'react'
import MemberCardMDB from '../components/MemberCardMDB'
import { useTheme } from '../contexts/ThemeContext'
import MemberProfileModal from '../components/MemberProfileModal'
import Meteors from '../components/Meteors'
import { supabase } from '../lib/supabase'

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

// Captain role assignments
const captainRoles: Record<string, { role: string; specialization: string; bio: string; skills: string[] }> = {
  'Shaniya': {
    role: 'Cyber Security Specialist',
    specialization: 'Cyber Security',
    bio: 'Passionate about creating scalable web applications and mentoring junior developers.',
    skills: ['React', 'Node.js', 'Python']
  },
  'Mohamed Ashif': {
    role: 'Frontend Developer',
    specialization: 'User Experience Design',
    bio: 'Dedicated to crafting intuitive and beautiful user interfaces that enhance user experience.',
    skills: ['Python', 'React', 'MySQL', 'PostgreSQL']
  }
}

// Team member role assignments
const memberRoles: Record<string, { role: string; specialization: string; bio: string; skills: string[] }> = {
  'Lethin': { role: 'Data Analyst', specialization: 'Data Analysis', bio: 'Passionate about data-driven insights and analytics.', skills: ['Python', 'SQL', 'Machine Learning'] },
  'Jijo': { role: 'Full-Stack Developer', specialization: 'Web Development', bio: 'Dedicated to crafting intuitive and beautiful user interfaces.', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'] },
  'Bennyhinn Sam': { role: 'Software Engineer', specialization: 'Software Engineering', bio: 'Expert in building robust backend systems.', skills: ['Java', 'Spring', 'PostgreSQL', 'Docker'] },
  'Anitus': { role: 'Java Developer', specialization: 'Modern Web Technologies', bio: 'Enthusiastic about creating responsive and interactive web experiences.', skills: ['Vue.js', 'TypeScript', 'CSS3', 'WebGL'] },
  'Lifnan shijo': { role: 'DevOps Engineer', specialization: 'Cloud Infrastructure', bio: 'Focused on automating deployment processes.', skills: ['Kubernetes', 'Terraform', 'Jenkins', 'Azure'] },
  'Archana': { role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
  'Alisha': { role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
  'Shailu Mirsha': { role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
  'Arthi': { role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
  'Beule Sujarsa': { role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] }
}

const captainNames = ['Shaniya', 'Mohamed Ashif']

// Fallback static data in case API fails
const fallbackMembers: Person[] = [
  { name: 'Shaniya', role: 'Cyber Security Specialist', specialization: 'Cyber Security', bio: 'Passionate about creating scalable web applications and mentoring junior developers.', skills: ['React', 'Node.js', 'Python', 'AWS'], github: 'https://github.com/shaniya-v', linkedin: 'https://www.linkedin.com/in/shaniya-v-02b514280' },
  { name: 'Mohamed Ashif', role: 'Frontend Developer', specialization: 'User Experience Design', bio: 'Dedicated to crafting intuitive and beautiful user interfaces that enhance user experience.', skills: ['Python', 'React', 'MySQL', 'PostgreSQL'], github: 'https://github.com/mohamed-ashif-m', linkedin: 'https://www.linkedin.com/in/mohamedashif175/' },
  { name: 'Lethin', role: 'Data Analyst', specialization: 'Data Analysis', bio: 'Passionate about data-driven insights and analytics.', skills: ['Python', 'SQL', 'Machine Learning'], portfolio: 'https://lethin.work.gd', github: 'https://github.com/Lethinkj', linkedin: 'https://www.linkedin.com/in/lethin-k-j-510674293' },
  { name: 'Jijo', role: 'Full-Stack Developer', specialization: 'Web Development', bio: 'Dedicated to crafting intuitive and beautiful user interfaces.', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'], portfolio: 'https://jijog-jijog.github.io/', github: 'https://github.com/jijog-jijog', linkedin: 'https://www.linkedin.com/in/jijorogerz186' },
  { name: 'Bennyhinn Sam', role: 'Software Engineer', specialization: 'Software Engineering', bio: 'Expert in building robust backend systems.', skills: ['Java', 'Spring', 'PostgreSQL', 'Docker'], portfolio: 'https://bennyhinn.vercel.app', github: 'https://github.com/bennyhinn18', linkedin: 'https://linkedin.com/in/bennyhinn-sam' },
  { name: 'Anitus', role: 'Java Developer', specialization: 'Modern Web Technologies', bio: 'Enthusiastic about creating responsive and interactive web experiences.', skills: ['Vue.js', 'TypeScript', 'CSS3'], portfolio: 'https://anitusa.github.io/Anitus-portfolio', github: 'https://github.com/AnitusA', linkedin: 'https://www.linkedin.com/in/aanitus' },
  { name: 'Lifnan shijo', role: 'DevOps Engineer', specialization: 'Cloud Infrastructure', bio: 'Focused on automating deployment processes.', skills: ['Kubernetes', 'Jenkins', 'Azure'], github: 'https://github.com/lifnanshijo', linkedin: 'https://www.linkedin.com/in/lifnan-shijo-r-66719935b' },
  { name: 'Archana', role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing.', skills: ['DSA', 'API Testing'], github: 'https://github.com/Carchana2006' },
  { name: 'Alisha', role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing.', skills: ['Python', 'API Testing'], portfolio: 'https://my-portfolio-as.lovable.app', github: 'https://github.com/alisha1806', linkedin: 'https://www.linkedin.com/in/alisha-as-58aa7b33a' },
  { name: 'Shailu Mirsha', role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing.', skills: ['Python', 'C#', 'API Testing'], github: 'https://github.com/Shailu-Mirsha', linkedin: 'https://in.linkedin.com/in/shailu-mirsha-b83ba0360' },
  { name: 'Arthi', role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing.', skills: ['Machine Learning', 'Data Analysis', 'API Testing'], github: 'https://github.com/Arthi-as', linkedin: 'https://www.linkedin.com/in/arthi-a-s-17500835b' },
  { name: 'Beule Sujarsa', role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing.', skills: ['Python','C#', 'API Testing'], github: 'https://github.com/Beule-Sujarsa' }
]

function SocialLink({ href, label }: { href?: string; label: string }) {
  if (!href) return null  // Hide the link completely if href is null/undefined
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-sm rounded-md bg-slate-800/60 hover:bg-slate-700 text-yellow-200 transition-transform transform hover:-translate-y-0.5 a-pop">
      {label}
    </a>
  )
}

export default function Members() {
  const { theme } = useTheme()
  const [members, setMembers] = useState<Person[]>([])
  const [avatarsMap, setAvatarsMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

    // Fetch with all fields including LinkedIn and domains
    fetch('https://terminal.bytebashblitz.org/api/clan/1?fields=name,github_username,portfolio_url,linkedin_url,primary_domain,secondary_domain', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(async data => {
        console.log('API Response:', data)
        if (data.success && data.data && data.data.members) {
          const apiMembersBase: Person[] = data.data.members.map((m: APIMember) => {
            const roleInfo = captainRoles[m.name] || memberRoles[m.name] || {
              role: 'Team Member',
              specialization: 'Software Development',
              bio: 'Passionate developer contributing to the Aura-7F clan.',
              skills: ['JavaScript', 'React', 'Node.js']
            }

            // Use domains from API as skills if available, otherwise use default skills
            const primaryDomains = m.primary_domain && Array.isArray(m.primary_domain) ? m.primary_domain : []
            const secondaryDomains = m.secondary_domain && Array.isArray(m.secondary_domain) ? m.secondary_domain : []
            const apiSkills = [...primaryDomains, ...secondaryDomains]
            
            // Use API domains if available, otherwise fallback to roleInfo skills
            const skills = apiSkills.length > 0 ? apiSkills : roleInfo.skills

            return {
              name: m.name,
              ...roleInfo,
              skills: skills,  // Override skills with domains from API
              portfolio: m.portfolio_url || undefined,
              github: m.github_username ? `https://github.com/${m.github_username}` : undefined,
              linkedin: m.linkedin_url || undefined,
              avatar_url: undefined
            }
          })
          // Try to fetch avatar_url from our users table and merge by username
          try {
            const { data: users, error: usersError } = await supabase
              .from('users')
              .select('username, avatar_url')

            if (!usersError && users) {
              const avatarMapFull: Record<string, string> = {}
              const avatarMapFirst: Record<string, string> = {}
              users.forEach((u: any) => {
                if (u.username) {
                  const full = (u.username || '').trim().toLowerCase()
                  const first = full.split(/\s+/)[0]
                  if (full) avatarMapFull[full] = u.avatar_url
                  if (first) avatarMapFirst[first] = avatarMapFirst[first] || u.avatar_url
                }
              })

              const apiMembers = apiMembersBase.map(m => {
                const full = ((m.name || '') + '').trim().toLowerCase()
                const first = full.split(/\s+/)[0]
                const avatar = avatarMapFull[full] || avatarMapFirst[first] || undefined
                return { ...m, avatar_url: avatar }
              })
              console.log('Avatar merge results:', apiMembers.map(m => ({ name: m.name, avatar: !!m.avatar_url })))
              console.log('Processed members (with avatars):', apiMembers)
              setMembers(apiMembers)
            } else {
              console.log('Processed members (no avatars):', apiMembersBase)
              setMembers(apiMembersBase)
            }
          } catch (err) {
            console.error('Error merging avatars:', err)
            setMembers(apiMembersBase)
          }
          setLoading(false)
        } else {
          throw new Error('Invalid API response format')
        }
      })
      .catch(err => {
        console.error('Failed to fetch members:', err)
        console.log('Using fallback data due to API error')
        // Use fallback data instead of showing error
        setMembers(fallbackMembers)
        setLoading(false)
      })
  }, [])

  const captains = members.filter(m => captainNames.includes(m.name))
  const teamMembers = members.filter(m => !captainNames.includes(m.name))
  const [modalIndex, setModalIndex] = useState<number | null>(null)

  // resolved members with a stable `avatar` field (prefer avatar_url, then avatarsMap, then initials service)
  const resolvedMembers = members.map(m => {
    const key = (m.name || '').trim().toLowerCase()
    const resolvedAvatar = m.avatar_url || avatarsMap[key] || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=0D1117&color=fff&size=256`
    return { ...m, avatar: resolvedAvatar }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto
            ${theme === 'dark' ? 'border-cyan-500/30 border-t-cyan-500' : 'border-cyan-600/30 border-t-cyan-600'}`}></div>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Loading team members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <Meteors />
      <div className="relative z-10 space-y-12 sm:space-y-16 pb-8">
      {/* Header */}
      <section className="text-center px-4 pt-8">
        <h1 id="members-title" className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 scroll-mt-24 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
          Meet our team
        </h1>
        <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          The brilliant minds behind Aura-7F — united by passion, driven by excellence
        </p>
      </section>

      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          {/* Captains section */}
          <div className="text-center mb-6">
            <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Captain Bashes</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Leadership Team ({captains.length})</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {captains.map(member => {
              const idx = members.findIndex(m => m.name === member.name)
              return (
                <div key={member.name}>
                  <MemberCardMDB
                    compact={true}
                    compactSize="large"
                    onClick={() => idx >= 0 && setModalIndex(idx)}
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

          {/* Our team grid: 3 per row */}
          <div className="text-center mb-6">
            <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Our Team</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Core Contributors ({teamMembers.length})</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map(member => {
              const idx = members.findIndex(m => m.name === member.name)
              return (
                <div key={member.name}>
                  <MemberCardMDB
                    compact={true}
                    compactSize="large"
                    onClick={() => idx >= 0 && setModalIndex(idx)}
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
      </section>
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

