import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AddMember() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    discord_user_id: '',
    username: '',
    is_clan_member: true,
    dob: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('discord_user_id', formData.discord_user_id)
        .single()

      if (existingUser) {
        setError('User with this Discord ID already exists!')
        setLoading(false)
        return
      }

      // Add user to users table
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          discord_user_id: formData.discord_user_id,
          username: formData.username,
          is_clan_member: formData.is_clan_member
        }])

      if (userError) throw userError

      // Add birthday if provided
      if (formData.dob) {
        const { error: birthdayError } = await supabase
          .from('birthdays')
          .insert([{
            user_id: formData.discord_user_id,
            name: formData.username,
            date: formData.dob
          }])

        if (birthdayError) throw birthdayError
      }

      setSuccess('Member added successfully!')
      setFormData({
        discord_user_id: '',
        username: '',
        is_clan_member: true,
        dob: ''
      })

      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError('Failed to add member. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-900/90 border-2 border-cyan-400/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 text-center">Add New Member</h1>
          <p className="text-aura text-center mb-6">Register a new clan member to the system</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-4">
              {success}
              <p className="text-sm mt-2">Redirecting to login...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-aura text-sm font-medium mb-2">Discord User ID *</label>
                <input
                  type="text"
                  name="discord_user_id"
                  value={formData.discord_user_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  placeholder="123456789012345678"
                />
              </div>

              <div>
                <label className="block text-aura text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  placeholder="Member Name"
                />
              </div>

              <div>
                <label className="block text-aura text-sm font-medium mb-2">Date of Birth (DD/MM)</label>
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  placeholder="15/08"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_clan_member"
                name="is_clan_member"
                checked={formData.is_clan_member}
                onChange={handleChange}
                className="w-4 h-4 text-cyan-400 bg-slate-900 border-slate-700 rounded focus:ring-cyan-400 focus:ring-1 cursor-pointer"
              />
              <label htmlFor="is_clan_member" className="text-aura text-sm">
                Mark as Clan Member
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
            >
              {loading ? 'Adding Member...' : 'Add Member'}
            </button>
          </form>

          <button
            onClick={() => navigate('/login')}
            className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-aura font-medium py-3 px-6 rounded-lg transition-colors border border-slate-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}
