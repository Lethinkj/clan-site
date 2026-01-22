import React, { useState } from 'react'
import { supabase, Moderator, hashPassword } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface ModeratorManagementProps {
  moderators: Moderator[]
  onModeratorAdded: () => void
  onModeratorRemoved: () => void
}

export default function ModeratorManagement({ moderators, onModeratorAdded, onModeratorRemoved }: ModeratorManagementProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      // Check if already a moderator
      const { data: existing } = await supabase
        .from('moderators')
        .select('*')
        .eq('email', formData.email)
        .single()

      if (existing) {
        setError('User is already a moderator!')
        setLoading(false)
        return
      }

      // Add moderator
      const { error: insertError } = await supabase
        .from('moderators')
        .insert([{
          email: formData.email,
          username: formData.username,
          password_hash: hashPassword(formData.email, formData.password),
          is_admin: false,
          added_by: user?.email || 'admin'
        }])

      if (insertError) throw insertError

      setSuccess('Moderator added successfully!')
      setFormData({ email: '', username: '', password: '', confirmPassword: '' })
      onModeratorAdded()
    } catch (err) {
      setError('Failed to add moderator. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (email: string) => {
    if (!confirm('Are you sure you want to remove this moderator?')) return

    try {
      const { error } = await supabase
        .from('moderators')
        .delete()
        .eq('email', email)

      if (error) throw error

      onModeratorRemoved()
    } catch (err) {
      console.error('Error removing moderator:', err)
      alert('Failed to remove moderator')
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Moderator Form */}
      <div className="bg-slate-900/80 border border-cyan-400/20 p-6 rounded-lg shadow-lg shadow-cyan-500/5">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Add Moderator</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-aura text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="moderator@email.com"
              />
            </div>

            <div>
              <label className="block text-aura text-sm font-medium mb-2">Username *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-aura text-sm font-medium mb-2">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-aura text-sm font-medium mb-2">Confirm Password *</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50 shadow-lg shadow-cyan-500/20"
          >
            {loading ? 'Adding...' : 'Add Moderator'}
          </button>
        </form>
      </div>

      {/* Moderator List */}
      <div className="bg-slate-900/80 border border-cyan-400/20 p-6 rounded-lg shadow-lg shadow-cyan-500/5">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Current Moderators ({moderators.length})</h2>
        
        <div className="space-y-3">
          {moderators.map((moderator) => (
            <div key={moderator.id} className="bg-slate-800/50 border border-cyan-400/10 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-cyan-400 font-semibold">{moderator.username}</p>
                <p className="text-aura text-sm">{moderator.email}</p>
                <p className="text-aura text-xs">
                  Added: {new Date(moderator.added_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleRemove(moderator.email)}
                className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}

          {moderators.length === 0 && (
            <p className="text-aura text-center py-4">No moderators added yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
