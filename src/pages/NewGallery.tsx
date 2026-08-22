import React, { useMemo } from 'react';
import FantasyNavbar from '../components/FantasyNavbar';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, ExternalLink, Sparkles } from 'lucide-react';

interface GalleryItem {
    image: string;
    link: string;
    title: string;
    description: string;
}

export default function NewGallery() {
    const navigate = useNavigate();

    const galleryItems: GalleryItem[] = useMemo(() => [
        {
            image: 'https://i.postimg.cc/qR7FQbv1/Whats-App-Image-2026-01-30-at-3-26-06-PM.jpg?auto=format&fit=crop&q=70&w=800',
            link: '/events',
            title: 'Rookie Weekly Bash',
            description: 'A weekly event for rookies to show their skills.'
        },
        {
            image: 'https://i.postimg.cc/FsPVVrLz/Whats-App-Image-2026-01-30-at-3-27-21-PM.jpg?auto=format&fit=crop&q=70&w=800',
            link: '/events',
            title: 'Project Showcase',
            description: 'A place to show off your projects.'
        },
        {
            image: 'https://i.postimg.cc/Kz682gwZ/Whats-App-Image-2026-01-30-at-3-23-33-PM.jpg?auto=format&fit=crop&q=70&w=800',
            link: '/events',
            title: 'Badge Day - 2024',
            description: 'The day rookies get their badges.'
        },
        {
            image: 'https://i.postimg.cc/sXLv2gHx/Whats-App-Image-2026-01-30-at-3-25-43-PM.jpg?auto=format&fit=crop&q=70&w=800',
            link: '/about',
            title: 'Rookie Weekly Bash 2025',
            description: 'The soul of the warrior, digitized for eternity.'
        },
        {
            image: 'https://i.postimg.cc/MpZ5RsK1/Whats-App-Image-2026-01-30-at-3-26-31-PM-(1).jpg?auto=format&fit=crop&q=70&w=800',
            link: '/events',
            title: 'When Windows meets Linux',
            description: 'The clash of Aura in the digital arena.'
        },
        {
            image: 'https://i.postimg.cc/cCn3fnPP/Whats-App-Image-2026-01-30-at-3-27-22-PM.jpg?auto=format&fit=crop&q=70&w=800',
            link: '/',
            title: 'Google Student Ambassador',
            description: 'Passionate about promoting Google technologies and innovation.'
        },
        {
            image: 'https://i.postimg.cc/pT7KbQwN/Whats-App-Image-2026-01-30-at-3-37-00-PM.jpg?auto=format&fit=crop&q=70&w=800',
            link: '/about',
            title: 'Table Topper',
            description: 'A weekly bash table topper of the computative programming.'
        },
        {
            image: 'https://i.postimg.cc/sfmRc6RR/Whats-App-Image-2026-01-30-at-3-30-00-PM-(1).jpg?auto=format&fit=crop&q=70&w=800',
            link: '/members',
            title: 'Weekly bash #22',
            description: 'The weekly bash has led by Aura 7f.'
        },
        {
            image: 'https://i.postimg.cc/vHytQh1G/Whats-App-Image-2026-01-30-at-3-30-00-PM-(2).jpg?auto=format&fit=crop&q=70&w=800',
            link: '/projects',
            title: 'Pass The Code',
            description: 'In weekly bash pass the code event led by Archana.'
        },
        {
            image: 'https://i.postimg.cc/9fsN19L2/Whats-App-Image-2026-01-30-at-3-24-44-PM.jpg?auto=format&fit=crop&q=70&w=800',
            link: '/about',
            title: 'PC building By Aura 7f',
            description: 'Aura members building a pc in a weekly bash.'
        },
        {
            image: 'https://i.postimg.cc/QNzVmd3J/Whats-App-Image-2026-01-30-at-3-20-28-PM.jpg',
            link: '/events',
            title: 'Byte Bash Blitz',
            description: 'Crush your limits.'
        },
        {
            image: 'https://i.postimg.cc/htYBWfCn/Whats-App-Image-2026-01-30-at-3-24-03-PM-(1).jpg?auto=format&fit=crop&q=70&w=800',
            link: '/members',
            title: 'Weekly Bash 14',
            description: "CB Shaniya's first weekly bash."
        }
    ], []);

    const handleActionClick = (link: string) => {
        if (!link) return;
        if (link.startsWith('http')) {
            window.open(link, '_blank');
        } else {
            navigate(link);
        }
    }

    return (
        <div className="relative min-h-screen w-full bg-[#0d1117] font-sans overflow-x-hidden selection:bg-amber-400 selection:text-black">
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
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
            </div>

            <FantasyNavbar />

            <div className="relative z-10 w-full max-w-7xl mx-auto pt-44 pb-24 px-4 md:px-8">
                
                {/* Board / Title */}
                <div className="flex flex-col items-center justify-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-cinzel text-sm font-bold tracking-widest uppercase">
                        <Sparkles size={16} />
                        <span>Guild Archives</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl text-white font-cinzel font-bold tracking-wider text-center drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                        GALLERY <span className="text-amber-500">VAULT</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl text-center font-lato">
                        Explore the legendary events and milestones of our guild members from past and present.
                    </p>
                </div>

                {/* Grid of gallery artifacts in Neu-Silky Theme */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryItems.map((item, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleActionClick(item.link)}
                            className="group relative p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-500/40 hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col"
                        >
                            {/* Ambient glow inside card */}
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-500"></div>

                            {/* Image container frame */}
                            <div className="relative w-full aspect-video rounded-xl border border-white/10 overflow-hidden mb-6 bg-black/50 shadow-inner z-10 box-border group-hover:border-amber-500/30 transition-colors">
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out" 
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                <div className="absolute bottom-3 right-3 text-white/50 group-hover:text-amber-400 transition-colors">
                                    <ImageIcon size={20} />
                                </div>
                            </div>
                            
                            <div className="flex-1 flex flex-col z-10">
                                <h3 className="font-cinzel font-bold text-xl text-slate-200 group-hover:text-amber-400 mb-3 transition-colors tracking-wide">
                                    {item.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-lato">
                                    {item.description}
                                </p>
                                
                                {/* Action Link */}
                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <span className="inline-flex items-center gap-2 text-amber-500/80 font-cinzel text-sm font-bold tracking-wider uppercase group-hover:text-amber-400 transition-colors">
                                        Explore Fragment 
                                        <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
