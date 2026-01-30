import React, { useMemo, useState } from 'react'
import InfiniteMenu from '../components/InfiniteMenu'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Archive } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface GalleryItem {
    image: string;
    link: string;
    title: string;
    description: string;
}

export default function Gallery() {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
    const [isMoving, setIsMoving] = useState(false);

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
            description: 'A weekly bash pass the code event.'
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
    ], [])

    const handleActionClick = () => {
        if (!activeItem?.link) return;
        if (activeItem.link.startsWith('http')) {
            window.open(activeItem.link, '_blank');
        } else {
            navigate(activeItem.link);
        }
    }

    const handleActiveItemChange = React.useCallback((item: GalleryItem | null) => {
        setActiveItem(item);
    }, []);

    const handleMovementChange = React.useCallback((moving: boolean) => {
        setIsMoving(moving);
    }, []);

    return (
        <div className="relative w-full min-h-screen bg-black text-white font-cinzel pb-20">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent opacity-30 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-[95rem] mx-auto pt-16 md:pt-24 px-4 md:px-6 mb-12">
                {/* Responsive Layout Wrapper */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[700px]">

                    {/* Left Side: 3D Interaction Area */}
                    <div className="lg:col-span-7 xl:col-span-8 w-full h-[82vh] lg:h-[700px] bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.8)] group">
                        {/* Inner Shadow for depth */}
                        <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]"></div>

                        {/* Centered interaction area without aggressive scaling */}
                        <div className="w-full h-full transition-all duration-1000">
                            <InfiniteMenu
                                items={galleryItems as any}
                                scale={0.5}
                                yOffset={typeof window !== 'undefined' && window.innerWidth < 1024 ? -0.4 : 0}
                                onActiveItemChange={handleActiveItemChange}
                                onMovementChange={handleMovementChange}
                                showInternalCard={true}
                            />
                        </div>

                        {/* Hint for interaction */}
                        <div className="absolute bottom-8 right-8 z-20 pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-1000 flex items-center gap-3">
                            <span className="text-[10px] tracking-[0.4em] font-black text-amber-500 uppercase">Swipe Archive</span>
                            <div className="w-8 h-[1px] bg-amber-500/50"></div>
                        </div>
                    </div>

                    {/* Right Side: Information Panel (Visible only on Laptop/Desktop) */}
                    <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 flex-col justify-center min-h-full pl-12 pr-8 py-16 bg-[#050505] border-l border-white/5 relative">
                        {/* Subtle Glow Backdrop */}
                        <div className="absolute top-1/2 -left-20 w-40 h-80 bg-amber-500/10 blur-[100px] pointer-events-none"></div>

                        <AnimatePresence mode="wait">
                            {activeItem && !isMoving && (
                                <motion.div
                                    key={activeItem.title}
                                    initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                    className="relative z-10"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
                                        <span className="text-[10px] md:text-xs tracking-[0.6em] font-black text-amber-500 uppercase">Archive Identified</span>
                                    </div>

                                    <h2 className="text-5xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-500 leading-[1.1] mb-8 tracking-tighter">
                                        {activeItem.title}
                                    </h2>

                                    <div className="max-w-[35ch] mb-12">
                                        <p className="text-lg xl:text-xl text-slate-300/90 font-light leading-relaxed">
                                            {activeItem.description}
                                        </p>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Decorative Footers */}
            <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
        </div>
    )
}
