import React from 'react'

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

const captains: Person[] = [
  {
    name: 'Shaniya',
    role: 'Cyber Security Specialist',
    specialization: 'Cyber Security',
    bio: 'Passionate about creating scalable web applications and mentoring junior developers.',
    skills: ['React', 'Node.js', 'Python', 'AWS']
  },
  {
    name: 'Mohamed Ashif M',
    role: 'Frontend Developer',
    specialization: 'User Experience Design',
    bio: 'Dedicated to crafting intuitive and beautiful user interfaces that enhance user experience.',
    skills: ['Python', 'React', 'MySQL', 'PostgreSQL']
  }
]

const teamMembers: Person[] = [
  { name: 'Lethin', role: 'Data Analyst', specialization: 'Data Analysis', bio: 'Passionate about creating scalable web applications and mentoring junior developers.', skills: ['React', 'Node.js', 'Python', 'AWS'], portfolio: 'https://lethin.work.gd/', github: 'https://github.com/Lethinkj', linkedin: 'https://www.linkedin.com/in/lethin-k-j-510674293' },
  // you can add social links per-member (portfolio, linkedin, github)
  { name: 'Jijo Rogerz', role: 'Full-Stack Developer', specialization: 'Web Development', bio: 'Dedicated to crafting intuitive and beautiful user interfaces that enhance user experience.', skills: ['Figma', 'Adobe XD', 'CSS', 'Design Systems'] },
  { name: 'Bennyhinn Sam', role: 'Software Engineer', specialization: 'Software Engineering', bio: 'Expert in building robust backend systems and optimizing database performance.', skills: ['Java', 'Spring', 'PostgreSQL', 'Docker'] },
  { name: 'Anitus', role: 'Java Developer', specialization: 'Modern Web Technologies', bio: 'Enthusiastic about creating responsive and interactive web experiences using cutting-edge technologies.', skills: ['Vue.js', 'TypeScript', 'CSS3', 'WebGL'], portfolio: 'https://anitus.dev', github: 'https://github.com/anitus', linkedin: 'https://www.linkedin.com/in/anitus' },
  { name: 'Lifnan Shijo', role: 'DevOps Engineer', specialization: 'Cloud Infrastructure', bio: 'Focused on automating deployment processes and maintaining scalable cloud infrastructure.', skills: ['Kubernetes', 'Terraform', 'Jenkins', 'Azure'] },
  { name: 'Archana', role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing strategies and automation.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
  { name: 'Alisha', role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing strategies and automation.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
  { name: 'Shailu Mirsha', role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing strategies and automation.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
  { name: 'Arthi', role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing strategies and automation.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
  { name: 'Beule Sujarsa', role: 'QA Engineer', specialization: 'Test Automation', bio: 'Committed to ensuring software quality through comprehensive testing strategies and automation.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] }
]

function SocialLink({ href, label }: { href?: string; label: string }) {
  if (!href) return <span className="px-3 py-1 text-sm rounded-md bg-slate-700/40 text-yellow-200 text-xs">N/A</span>
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-sm rounded-md bg-slate-800/60 hover:bg-slate-700 text-yellow-200 transition-transform transform hover:-translate-y-0.5 a-pop">
      {label}
    </a>
  )
}

export default function Members() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-4xl font-bold text-yellow-300 mb-2 a-fade-up">Captain Bash</h2>
        <p className="text-aura mb-6 a-fade-up">Members (2)</p>

        <div className="grid grid-cols-1 md:grid-flow-col md:auto-cols-fr gap-6 a-stagger justify-items-center">
          {captains.map((member, i) => (
            <article key={i} className="w-full bg-black/50 border border-yellow-300/20 p-6 rounded-lg shadow-md aura-card transition-all a-fade-up">
              <h3 className="text-2xl font-bold text-yellow-300 mb-2">{member.name}</h3>
              <div className="text-yellow-200 font-semibold mb-1">{member.role}</div>
              <div className="text-sm text-yellow-200 mb-3">Specialization: {member.specialization}</div>
              <p className="text-aura mb-4">{member.bio}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(member.skills || []).map((skill, idx) => (
                  <span key={idx} className="bg-yellow-300/20 text-yellow-300 px-3 py-1 rounded-full text-sm">{skill}</span>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-center gap-3">
                <SocialLink href={member.portfolio} label="Portfolio" />
                <SocialLink href={member.linkedin} label="LinkedIn" />
                <SocialLink href={member.github} label="GitHub" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-bold text-yellow-300 mb-2 a-fade-up">Our Amazing Team</h2>
        <p className="text-aura mb-6 a-fade-up">Members ({teamMembers.length})</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 a-stagger justify-items-center">
          {teamMembers.map((member, i) => (
            <article key={i} className="w-full bg-black/50 border border-yellow-300/20 p-5 rounded-lg shadow-md aura-card transition-all a-fade-up">
              <h3 className="text-xl font-bold text-yellow-300 mb-2">{member.name}</h3>
              <div className="text-yellow-200 font-semibold mb-1">{member.role}</div>
              <div className="text-sm text-yellow-200 mb-3">Specialization: {member.specialization}</div>
              <p className="text-aura text-sm mb-3">{member.bio}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {(member.skills || []).map((skill, idx) => (
                  <span key={idx} className="bg-yellow-300/20 text-yellow-300 px-2 py-1 rounded-full text-xs">{skill}</span>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
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

