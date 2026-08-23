import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FantasyNavbar from '../components/FantasyNavbar';
import { supabase } from '../lib/supabase';
import { Crown, Sparkles, Shield, Github, Linkedin, ExternalLink } from 'lucide-react';

// -- Types & Data Setup --
type APIMember = {
    name: string;
    github_username?: string;
    portfolio_url?: string | null;
    linkedin_url?: string | null;
    primary_domain?: string[] | null;
    secondary_domain?: string[] | null;
};

type Person = {
    name: string;
    role: string;
    specialization?: string;
    bio?: string;
    skills?: string[];
    portfolio?: string;
    github?: string;
    linkedin?: string;
    avatar_url?: string;
    avatar?: string;
};

const captainRoles: Record<string, any> = {
    'Shaniya': { role: 'Guild Master', specialization: 'Cyber Security', bio: 'Guardian of the digital fortress.', skills: ['React', 'Node.js', 'Python'] },
    'Mohamed Ashif': { role: 'Archmage', specialization: 'UX Sorcery', bio: 'Weaving spells of visual enchantment.', skills: ['Python', 'React', 'MySQL', 'PostgreSQL'] }
};

const memberRoles: Record<string, any> = {
    'Lethin': { role: 'Seer', specialization: 'Data Divination', bio: 'Reading the omens in the data streams.', skills: ['Python', 'SQL', 'Machine Learning'] },
    'Jijo': { role: 'Artificer', specialization: 'Construct Building', bio: 'Forging robust digital constructs.', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'] },
    'Bennyhinn Sam': { role: 'Runesmith', specialization: 'Backend Architecture', bio: 'Etching the deep runes of the system.', skills: ['Java', 'Spring', 'PostgreSQL', 'Docker'] },
    'Anitus': { role: 'Blade', specialization: 'Frontend Arts', bio: 'Sharp and precise interface crafting.', skills: ['Vue.js', 'TypeScript', 'CSS3'] },
    'Lifnan shijo': { role: 'Summoner', specialization: 'Cloud Binding', bio: 'Summoning resources from the ether.', skills: ['Kubernetes', 'Terraform', 'Jenkins', 'Azure'] },
    'Archana': { role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
    'Alisha': { role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
    'Shailu Mirsha': { role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] },
    'Arthi': { role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Machine Learning', 'Data Analysis', 'API Testing'] },
    'Beule Sujarsa': { role: 'Sentinel', specialization: 'Quality Assurance', bio: 'Watching for bugs in the void.', skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'] }
};

const captainNames = ['Shaniya', 'Mohamed Ashif'];

const fallbackMembers: Person[] = [
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
];

export default function NewMembers() {
    const navigate = useNavigate();
    const [members, setMembers] = useState<Person[]>([]);
    const [avatarsMap, setAvatarsMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function fetchAvatarsMap() {
            try {
                const { data: users, error: usersError } = await supabase.from('users').select('username, avatar_url');
                if (!usersError && users) {
                    const map: Record<string, string> = {};
                    users.forEach((u: any) => {
                        if (u.username && u.avatar_url) map[u.username.trim().toLowerCase()] = u.avatar_url;
                    });
                    setAvatarsMap(map);
                }
            } catch (e) {
                console.warn('Failed to fetch avatars map', e);
            }
        })();

        fetch('https://terminal.bytebashblitz.org/api/clan/1?fields=name,github_username,portfolio_url,linkedin_url,primary_domain,secondary_domain', {
            method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, mode: 'cors'
        })
            .then(res => res.ok ? res.json() : Promise.reject(res.status))
            .then(async data => {
                if (data.success && data.data && data.data.members) {
                    const apiMembersBase = data.data.members.map((m: APIMember) => {
                        const roleInfo = captainRoles[m.name] || memberRoles[m.name] || {
                            role: 'Novice',
                            specialization: 'Apprentice',
                            bio: 'A rising star in the guild.',
                            skills: ['JavaScript']
                        };
                        const skills = (m.primary_domain || []).concat(m.secondary_domain || []);
                        return {
                            name: m.name,
                            ...roleInfo,
                            skills: skills.length > 0 ? skills : roleInfo.skills,
                            portfolio: m.portfolio_url || undefined,
                            github: m.github_username ? `https://github.com/${m.github_username}` : undefined,
                            linkedin: m.linkedin_url || undefined,
                        };
                    });

                    try {
                        const { data: users } = await supabase.from('users').select('username, avatar_url');
                        if (users) {
                            const map: Record<string, string> = {};
                            users.forEach((u: any) => { if (u.username) map[u.username.trim().toLowerCase()] = u.avatar_url; });
                            const apiMembers = apiMembersBase.map((m: any) => ({ ...m, avatar: map[m.name.trim().toLowerCase()] }));
                            setMembers(apiMembers);
                        } else { setMembers(apiMembersBase); }
                    } catch { setMembers(apiMembersBase); }
                    setLoading(false);
                } else throw new Error('Invalid format');
            })
            .catch(() => {
                setMembers(fallbackMembers);
                setLoading(false);
            });
    }, []);

    const resolvedMembers = members.map(m => {
        const key = (m.name || '').trim().toLowerCase();
        const resolvedAvatar = m.avatar || avatarsMap[key] || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=0f0518&color=ffd700&size=256`;
        return { ...m, avatar: resolvedAvatar };
    });

    const captains = resolvedMembers.filter(m => captainNames.includes(m.name));
    const teamMembers = resolvedMembers.filter(m => !captainNames.includes(m.name));

    const MemberCard = ({ member, isCaptain = false }: { member: Person, isCaptain?: boolean }) => (
        <div
            onClick={() => navigate(`/profile/${member.name}`)}
            className={`group relative p-6 rounded-2xl border bg-slate-900/40 backdrop-blur-sm transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full items-center text-center
        ${isCaptain
                    ? 'border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                    : 'border-white/5 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:-translate-y-2'
                }`}
        >
            {/* Ambient glow inside card */}
            <div className={`absolute -inset-4 rounded-full blur-3xl transition-all duration-500 z-0 opacity-0 group-hover:opacity-100 
            ${isCaptain ? 'bg-amber-500/10' : 'bg-purple-500/5 hover:bg-amber-500/5'}`}></div>

            <div className="relative z-10 w-full flex flex-col items-center">
                {/* Avatar Section */}
                <div className={`relative mb-6 rounded-full p-1 transition-all duration-500 ${isCaptain ? 'w-32 h-32 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]' : 'w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-800 shadow-md group-hover:from-amber-600/50 group-hover:to-purple-900/50'}`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    {isCaptain && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black p-1.5 rounded-full border-2 border-black drop-shadow-md z-20 group-hover:scale-110 transition-transform">
                            <Crown size={16} fill="black" />
                        </div>
                    )}
                </div>

                {/* Profile Info */}
                <h3 className={`font-cinzel font-bold text-xl mb-1 tracking-wide transition-colors ${isCaptain ? 'text-amber-300 group-hover:text-amber-400' : 'text-slate-200 group-hover:text-amber-400'}`}>
                    {member.name}
                </h3>

                <p className="text-amber-500/80 font-cinzel text-xs font-bold uppercase tracking-widest mb-3">
                    {member.role}
                </p>

                <p className="text-slate-400 font-lato text-sm leading-relaxed mb-6 line-clamp-2">
                    {member.bio}
                </p>

                {/* Tags/Skills */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                    {(member.skills || []).slice(0, 3).map((skill: string) => (
                        <span key={skill} className="text-[9px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm bg-black/40 text-slate-300 border border-white/5">
                            {skill}
                        </span>
                    ))}
                    {(member.skills || []).length > 3 && (
                        <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm bg-black/40 text-slate-500 border border-white/5">
                            +{member.skills!.length - 3}
                        </span>
                    )}
                </div>

                {/* Social Links */}
                <div className="mt-auto flex items-center justify-center gap-4 pt-4 border-t border-white/5 w-full">
                    {member.github && (
                        <div onClick={(e) => { e.stopPropagation(); window.open(member.github, '_blank'); }} className="text-slate-500 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 rounded-lg hover:bg-white/10">
                            <Github size={16} />
                        </div>
                    )}
                    {member.linkedin && (
                        <div onClick={(e) => { e.stopPropagation(); window.open(member.linkedin, '_blank'); }} className="text-slate-500 hover:text-blue-400 hover:scale-110 transition-all p-2 bg-white/5 rounded-lg hover:bg-white/10">
                            <Linkedin size={16} />
                        </div>
                    )}
                    {member.portfolio && (
                        <div onClick={(e) => { e.stopPropagation(); window.open(member.portfolio, '_blank'); }} className="text-slate-500 hover:text-amber-400 hover:scale-110 transition-all p-2 bg-white/5 rounded-lg hover:bg-white/10">
                            <ExternalLink size={16} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen w-full bg-[#0d1117] font-sans overflow-x-hidden selection:bg-amber-400 selection:text-black pb-24">
            {/* Custom Background Image (Dark Edition) */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: 'url("https://www.boot.dev/img/bg-blue-gray.webp")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            ></div>

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
            </div>

            <FantasyNavbar />

            <div className="relative z-10 w-full max-w-7xl mx-auto pt-44 px-4 md:px-8">

                {/* Board / Title */}
                {/* <div className="flex flex-col items-center justify-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-cinzel text-sm font-bold tracking-widest uppercase">
                        <Sparkles size={16} />
                        <span>The Fellowship</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl text-white font-cinzel font-bold tracking-wider text-center drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                        GUILD <span className="text-amber-500">ROSTER</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl text-center font-lato">
                        United by the code, bound by the craft. Meet the wizards forging our digital legacy.
                    </p>
                </div> */}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                    </div>
                ) : (
                    <div className="space-y-24">
                        {/* Guild Masters Section */}
                        {captains.length > 0 && (
                            <section>
                                <div className="flex flex-col items-center gap-4 mb-12">
                                    <div className="p-3 rounded-full bg-amber-900/20 border border-amber-500/30">
                                        <Crown className="text-amber-500 size-8 animate-pulse" />
                                    </div>
                                    <h2 className="text-3xl font-cinzel font-bold text-white tracking-widest uppercase border-b-2 border-amber-500/30 pb-2 px-8">
                                        Guild Masters
                                    </h2>
                                </div>
                                <div className="flex flex-wrap justify-center gap-8">
                                    {captains.map(member => (
                                        <div key={member.name} className="w-full sm:w-[350px]">
                                            <MemberCard member={member} isCaptain={true} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Vanguard Section */}
                        {teamMembers.length > 0 && (
                            <section>
                                <div className="flex flex-col items-center gap-4 mb-12">
                                    <div className="p-3 rounded-full bg-slate-900/50 border border-slate-700/50">
                                        <Shield className="text-slate-400 size-6" />
                                    </div>
                                    <h2 className="text-2xl font-cinzel font-bold text-slate-300 tracking-widest uppercase border-b border-slate-700 pb-2 px-8">
                                        The Vanguard
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {teamMembers.map(member => (
                                        <MemberCard key={member.name} member={member} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
