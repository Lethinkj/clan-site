import React, { useEffect, useState } from 'react'
import { supabase, User, MemberProject } from '../../lib/supabase'
import Modal, { ConfirmDialog } from '../ui/Modal'
import { Plus, Edit2, Trash2, ExternalLink, Github, Tag } from 'lucide-react'

export default function ProjectManagement() {
    const [members, setMembers] = useState<User[]>([])
    const [projects, setProjects] = useState<MemberProject[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<MemberProject | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        user_id: '',
        title: '',
        description: '',
        link: '',
        github: '',
        tags: '',
        image_url: ''
    })

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        setLoading(true)
        try {
            const [{ data: usersData }, { data: projectsData }] = await Promise.all([
                supabase.from('users').select('*').eq('is_clan_member', true).order('username'),
                supabase.from('member_projects').select('*').order('created_at', { ascending: false })
            ])

            setMembers(usersData || [])
            setProjects(projectsData || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (project: MemberProject | null = null) => {
        if (project) {
            setEditingProject(project)
            setFormData({
                user_id: project.user_id,
                title: project.title,
                description: project.description,
                link: project.link || '',
                github: project.github || '',
                tags: project.tags.join(', '),
                image_url: project.image_url || ''
            })
        } else {
            setEditingProject(null)
            setFormData({
                user_id: members.length > 0 ? members[0].discord_user_id : '',
                title: '',
                description: '',
                link: '',
                github: '',
                tags: '',
                image_url: ''
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const projectData = {
            user_id: formData.user_id,
            title: formData.title,
            description: formData.description,
            link: formData.link || null,
            github: formData.github || null,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            image_url: formData.image_url || null
        }

        try {
            if (editingProject) {
                const { error } = await supabase
                    .from('member_projects')
                    .update(projectData)
                    .eq('id', editingProject.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('member_projects')
                    .insert([projectData])
                if (error) throw error
            }

            setIsModalOpen(false)
            fetchInitialData()
        } catch (error) {
            console.error('Error saving project:', error)
            alert('Error saving project. Make sure the member_projects table exists in Supabase.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('member_projects')
                .delete()
                .eq('id', id)
            if (error) throw error
            setConfirmDelete(null)
            fetchInitialData()
        } catch (error) {
            console.error('Error deleting project:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading && projects.length === 0) {
        return <div className="text-center text-aura py-8 whitespace-nowrap overflow-hidden">Forging Archive Access...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-cyan-400">Member Projects</h3>
                    <p className="text-sm text-gray-400 mt-1">Manage artifacts forged by clan members</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm font-bold"
                >
                    <Plus size={18} /> Add Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                    <div className="col-span-full bg-slate-900/80 border border-cyan-400/20 rounded-lg p-12 text-center shadow-lg shadow-cyan-500/5">
                        <p className="text-aura font-cinzel">No artifacts found in the archives.</p>
                    </div>
                ) : (
                    projects.map((project) => {
                        const member = members.find(m => m.discord_user_id === project.user_id)
                        return (
                            <div key={project.id} className="bg-slate-900/80 border border-cyan-400/20 rounded-xl p-5 hover:border-cyan-400/40 transition-all group relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                                            {project.image_url ? (
                                                <img src={project.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <Tag size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{project.title}</h4>
                                            <p className="text-xs text-aura line-clamp-1">By {member?.username || 'Unknown Champion'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleOpenModal(project)} className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => setConfirmDelete(project.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">{project.description}</p>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {project.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-cyan-300/60 border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                    {project.tags.length > 3 && <span className="text-[9px] text-slate-500">+{project.tags.length - 3}</span>}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-white/5">
                                    {project.github && (
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                                            <Github size={16} />
                                        </a>
                                    )}
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Project Form Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Edit Artifact' : 'Forge New Artifact'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-aura text-xs font-bold uppercase tracking-widest mb-2">Champion *</label>
                            <select
                                value={formData.user_id}
                                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-all font-lato"
                            >
                                <option value="" disabled>Select a member</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.discord_user_id}>{member.username}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-aura text-xs font-bold uppercase tracking-widest mb-2">Project Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="Name of the artifact"
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-all font-lato"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-aura text-xs font-bold uppercase tracking-widest mb-2">Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                placeholder="What did this project achieve?"
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-all font-lato min-h-[100px]"
                            />
                        </div>

                        <div>
                            <label className="block text-aura text-xs font-bold uppercase tracking-widest mb-2">Live Link (Optional)</label>
                            <input
                                type="url"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                placeholder="https://..."
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-all font-lato"
                            />
                        </div>

                        <div>
                            <label className="block text-aura text-xs font-bold uppercase tracking-widest mb-2">GitHub URL (Optional)</label>
                            <input
                                type="url"
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                placeholder="https://github.com/..."
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-all font-lato"
                            />
                        </div>

                        <div>
                            <label className="block text-aura text-xs font-bold uppercase tracking-widest mb-2">Tags (comma separated) *</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                required
                                placeholder="React, AWS, Node.js"
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-all font-lato"
                            />
                        </div>

                        <div>
                            <label className="block text-aura text-xs font-bold uppercase tracking-widest mb-2">Image URL (Optional)</label>
                            <input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://.../preview.jpg"
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-all font-lato"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-cyan-500 text-slate-950 font-bold py-3 rounded-lg hover:bg-cyan-400 transition-all disabled:opacity-50 font-cinzel tracking-widest"
                        >
                            {loading ? 'SYNCING...' : editingProject ? 'EXECUTE UPDATE' : 'INITIALIZE PROJECT'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
                title="Destroy Artifact Record"
                message="Are you sure you want to permanently erase this artifact from the archives? This action cannot be reversed."
                confirmText="ERASE RECORD"
                type="danger"
            />
        </div>
    )
}
