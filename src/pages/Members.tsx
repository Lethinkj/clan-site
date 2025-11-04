import React, { useState, useEffect } from 'react'

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
  const [members, setMembers] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
      .then(data => {
        console.log('API Response:', data)
        if (data.success && data.data && data.data.members) {
          const apiMembers: Person[] = data.data.members.map((m: APIMember) => {
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
              linkedin: m.linkedin_url || undefined
            }
          })
          console.log('Processed members:', apiMembers)
          setMembers(apiMembers)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-yellow-300 text-xl mb-2">Loading members...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <section>
        <h2 id="members-title" className="text-2xl sm:text-4xl font-bold text-yellow-300 mb-2 a-fade-up px-3 sm:px-0 scroll-mt-24">Captain Bash</h2>
        <p className="text-sm sm:text-base text-aura mb-3 sm:mb-6 a-fade-up px-3 sm:px-0">Members ({captains.length})</p>

        <div className="grid grid-cols-1 md:grid-flow-col md:auto-cols-fr gap-3 sm:gap-6 md:a-stagger justify-items-center px-3 sm:px-0">
          {captains.map((member, i) => (
            <article key={i} className="w-full bg-black/50 border border-yellow-300/20 p-4 sm:p-6 rounded-lg shadow-md aura-card transition-all md:a-fade-up a-wall-build">
              <h3 className="text-lg sm:text-2xl font-bold text-yellow-300 mb-1 sm:mb-2">{member.name}</h3>
              <div className="text-sm sm:text-base text-yellow-200 font-semibold mb-1">{member.role}</div>
              <div className="text-xs sm:text-sm text-yellow-200 mb-2 sm:mb-3">Specialization: {member.specialization}</div>
              <p className="text-xs sm:text-base text-aura mb-3 sm:mb-4">{member.bio}</p>
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                {(member.skills || []).map((skill, idx) => (
                  <span key={idx} className="bg-yellow-300/20 text-yellow-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">{skill}</span>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 sm:gap-3">
                <SocialLink href={member.portfolio} label="Portfolio" />
                <SocialLink href={member.linkedin} label="LinkedIn" />
                <SocialLink href={member.github} label="GitHub" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl sm:text-4xl font-bold text-yellow-300 mb-2 a-fade-up px-3 sm:px-0">Our Amazing Team</h2>
        <p className="text-sm sm:text-base text-aura mb-3 sm:mb-6 a-fade-up px-3 sm:px-0">Members ({teamMembers.length})</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:a-stagger justify-items-center px-3 sm:px-0">
          {teamMembers.map((member, i) => (
            <article key={i} className="w-full bg-black/50 border border-yellow-300/20 p-3 sm:p-5 rounded-lg shadow-md aura-card transition-all md:a-fade-up a-wall-build">
              <h3 className="text-base sm:text-xl font-bold text-yellow-300 mb-1 sm:mb-2">{member.name}</h3>
              <div className="text-xs sm:text-base text-yellow-200 font-semibold mb-1">{member.role}</div>
              <div className="text-xs sm:text-sm text-yellow-200 mb-2 sm:mb-3">Specialization: {member.specialization}</div>
              <p className="text-xs sm:text-sm text-aura mb-2 sm:mb-3">{member.bio}</p>
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                {(member.skills || []).map((skill, idx) => (
                  <span key={idx} className="bg-yellow-300/20 text-yellow-300 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs">{skill}</span>
                ))}
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <SocialLink href={member.portfolio} label="Portfolio" />
                <SocialLink href={member.linkedin} label="LinkedIn" />
                <SocialLink href={member.github} label="GitHub" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

