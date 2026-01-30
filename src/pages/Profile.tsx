import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Github, Linkedin, Globe, ArrowLeft, Shield, Zap, Target, Star, Award, Code, Sparkles, ExternalLink, Package } from 'lucide-react'
import { supabase, MemberProject } from '../lib/supabase'
import AnimateOnView from '../components/AnimateOnView'
import { StarfieldBackground } from '../components/ui/starfield'

// Reuse the role mapping logic (would be better in a shared file in a real app)
const captainRoles: Record<string, { role: string; specialization: string; bio: string; skills: string[] }> = {
    'Shaniya': { role: 'Guild Master', specialization: 'Cyber Security', bio: 'Guardian of the digital fortress.', skills: ['React', 'Node.js', 'Python', 'AWS'] },
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

interface Member {
    name: string
    role: string
    specialization: string
    bio: string
    skills: string[]
    github?: string
    linkedin?: string
    portfolio?: string
    avatar?: string
}

export default function Profile() {
    const { name } = useParams<{ name: string }>()
    const navigate = useNavigate()
    const [member, setMember] = useState<Member | null>(null)
    const [projects, setProjects] = useState<MemberProject[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!name) return

        // Replicate the fetching/matching logic from Members.tsx
        // In a real app, this should be a central data service
        const fetchMember = async () => {
            try {
                const response = await fetch('https://terminal.bytebashblitz.org/api/clan/1', {
                    method: 'GET',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    mode: 'cors'
                })
                const data = await response.json()

                if (data.success && data.data && data.data.members) {
                    const apiMember = data.data.members.find((m: any) => m.name.toLowerCase() === name.toLowerCase())

                    if (apiMember) {
                        const roleInfo = captainRoles[apiMember.name] || memberRoles[apiMember.name] || {
                            role: 'Novice',
                            specialization: 'Apprentice',
                            bio: 'A rising star in the guild.',
                            skills: ['JavaScript']
                        }

                        const skills = (apiMember.primary_domain || []).concat(apiMember.secondary_domain || [])

                        setMember({
                            name: apiMember.name,
                            ...roleInfo,
                            skills: skills.length > 0 ? skills : roleInfo.skills,
                            portfolio: apiMember.portfolio_url || undefined,
                            github: apiMember.github_username ? `https://github.com/${apiMember.github_username}` : undefined,
                            linkedin: apiMember.linkedin_url || undefined,
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiMember.name)}&background=0f0518&color=ffd700&size=512`
                        })

                        // Now fetch projects for this member
                        const { data: projectsData } = await supabase
                            .from('member_projects')
                            .select('*')
                            .eq('user_id', apiMember.discord_user_id)
                            .order('created_at', { ascending: false })

                        if (projectsData) {
                            setProjects(projectsData)
                        }
                    }
                }
            } catch (error) {
                console.error('Profile fetch failed', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMember()
    }, [name])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!member) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white space-y-6">
                <h2 className="text-3xl font-cinzel">Champion Not Found</h2>
                <Link to="/members" className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-cinzel tracking-widest uppercase">
                    <ArrowLeft size={18} /> Back to Guild
                </Link>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen pb-20 overflow-hidden bg-slate-950">
            <StarfieldBackground />

            {/* Profile Header Background */}
            <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-amber-500/10 via-slate-950/80 to-slate-950 z-0" />

            <div className="max-w-6xl mx-auto px-4 pt-32 relative z-10">
                {/* Navigation */}
                <Link to="/members" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-12 transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-cinzel tracking-widest uppercase text-sm">Return to Ranks</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Left: Avatar & Identity Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <AnimateOnView animation="a-slide-right">
                            <div className="relative group">
                                {/* Glow Backdrop */}
                                <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>

                                {/* Avatar Frame */}
                                <div className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-4 shadow-2xl overflow-hidden group-hover:border-amber-500/30 transition-all duration-500">
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-full aspect-square object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </AnimateOnView>

                        {/* Social Link Column */}
                        <AnimateOnView animation="a-fade-up">
                            <div className="flex flex-col gap-4">
                                {member.github && (
                                    <a href={member.github} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
                                        <span className="p-2 rounded-lg bg-black/40 group-hover:text-white transition-colors"><Github size={20} /></span>
                                        <span className="font-lato text-slate-300 group-hover:text-white">GitHub Repository</span>
                                    </a>
                                )}
                                {member.linkedin && (
                                    <a href={member.linkedin} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
                                        <span className="p-2 rounded-lg bg-black/40 group-hover:text-white transition-colors"><Linkedin size={20} /></span>
                                        <span className="font-lato text-slate-300 group-hover:text-white">LinkedIn Profile</span>
                                    </a>
                                )}
                                {member.portfolio && (
                                    <a href={member.portfolio} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
                                        <span className="p-2 rounded-lg bg-black/40 group-hover:text-white transition-colors"><Globe size={20} /></span>
                                        <span className="font-lato text-slate-300 group-hover:text-white">Digital Portfolio</span>
                                    </a>
                                )}
                            </div>
                        </AnimateOnView>
                    </div>

                    {/* Right: Detailed Info */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Name & Title Header */}
                        <div className="space-y-4">
                            <AnimateOnView animation="a-fade-down">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-cinzel font-bold tracking-widest uppercase">
                                    <Star size={10} />
                                    Ascended Champion
                                </div>
                            </AnimateOnView>

                            <AnimateOnView animation="a-fade-up">
                                <h1 className="text-5xl sm:text-7xl font-cinzel font-bold text-white leading-none">
                                    {member.name}
                                </h1>
                                <div className="flex items-center gap-4 mt-4">
                                    <span className="text-2xl font-cinzel text-amber-500 uppercase tracking-widest">{member.role}</span>
                                    <div className="w-12 h-[1px] bg-slate-800"></div>
                                    <span className="text-slate-400 font-lato text-lg">{member.specialization}</span>
                                </div>
                            </AnimateOnView>
                        </div>

                        {/* Character "Stats" / Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '200ms' }}>
                                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl space-y-3">
                                    <div className="flex items-center gap-2 text-amber-400 font-cinzel text-xs font-bold tracking-widest uppercase mb-1">
                                        <Shield size={14} /> Guild Bio
                                    </div>
                                    <p className="text-slate-300 font-lato leading-relaxed">
                                        {member.bio}
                                    </p>
                                </div>
                            </AnimateOnView>

                            <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '300ms' }}>
                                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl h-full space-y-3">
                                    <div className="flex items-center gap-2 text-purple-400 font-cinzel text-xs font-bold tracking-widest uppercase mb-1">
                                        <Zap size={14} /> Affinity
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {member.skills.map((skill, i) => (
                                            <span key={skill} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] uppercase font-bold tracking-wider">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </AnimateOnView>
                        </div>

                        {/* Quote / Philosophy Section */}
                        <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '400ms' }}>
                            <div className="relative p-10 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md overflow-hidden group">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 left-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                    <Code size={120} />
                                </div>

                                <div className="relative z-10 space-y-6">
                                    <Sparkles className="text-amber-500" />
                                    <blockquote className="text-2xl sm:text-3xl font-cinzel italic text-slate-100 leading-tight">
                                        "Creativity is the most powerful magic in the digital realm. I build with precision and dream with purpose."
                                    </blockquote>
                                    <div className="flex items-center gap-4 pt-4">
                                        <div className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center text-amber-500">
                                            <Target size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-cinzel text-white text-sm font-bold tracking-wider">Core Directive</h4>
                                            <p className="text-slate-500 text-xs uppercase tracking-widest">Innovation & Excellence</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimateOnView>

                        {/* Artifacts Forged / Projects Section */}
                        {projects.length > 0 && (
                            <div className="space-y-8 pt-6">
                                <AnimateOnView animation="a-fade-up">
                                    <h3 className="text-3xl font-cinzel font-bold text-white flex items-center gap-3">
                                        <Package className="text-amber-500" />
                                        Artifacts Forged
                                    </h3>
                                    <div className="w-20 h-1 bg-amber-500/30 mt-2"></div>
                                </AnimateOnView>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {projects.map((project, i) => (
                                        <AnimateOnView key={project.id} animation="a-fade-up" style={{ transitionDelay: `${i * 100}ms` }}>
                                            <div className="group relative h-full flex flex-col p-[1px] rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent hover:from-amber-500/30 transition-all duration-500">
                                                <div className="flex-grow p-6 rounded-[21px] bg-slate-900/60 backdrop-blur-xl flex flex-col items-start gap-4">
                                                    <div className="flex justify-between w-full items-start">
                                                        <h4 className="text-xl font-cinzel font-bold text-white group-hover:text-amber-400 transition-colors">
                                                            {project.title}
                                                        </h4>
                                                        <div className="flex gap-3">
                                                            {project.github && (
                                                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                                                                    <Github size={18} />
                                                                </a>
                                                            )}
                                                            {project.link && (
                                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                                                                    <ExternalLink size={18} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <p className="text-slate-400 font-lato text-sm leading-relaxed line-clamp-2">
                                                        {project.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                                                        {project.tags.map(tag => (
                                                            <span key={tag} className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-white/5 text-amber-200/60 border border-white/10">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </AnimateOnView>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
