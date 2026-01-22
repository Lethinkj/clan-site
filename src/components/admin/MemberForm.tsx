import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface MemberFormProps {
  onMemberAdded: () => void
}

export default function MemberForm({ onMemberAdded }: MemberFormProps) {
  const [formData, setFormData] = useState({
    discord_user_id: '',
    username: '',
    display_name: '',
    is_clan_member: true,
    birthday_date: '' // DD/MM format
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
          display_name: formData.display_name || formData.username,
          is_clan_member: formData.is_clan_member
        }])

      if (userError) throw userError

      // Add birthday if provided
      if (formData.birthday_date) {
        const { error: birthdayError } = await supabase
          .from('birthdays')
          .insert([{
            user_id: formData.discord_user_id,
            name: formData.display_name || formData.username,
            date: formData.birthday_date
          }])

        if (birthdayError) throw birthdayError
      }

      setSuccess('Member added successfully!')
      setFormData({
        discord_user_id: '',
        username: '',
        display_name: '',
        is_clan_member: true,
        birthday_date: ''
      })
      onMemberAdded()
    } catch (err) {
      setError('Failed to add member. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  return (
    <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg mb-6">
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">Add New Member</h2>

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
            <label className="block text-aura text-sm font-medium mb-2">Discord User ID *</label>
            <input
              type="text"
              name="discord_user_id"
              value={formData.discord_user_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="123456789012345678"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="Display Name"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Birthday (DD/MM)</label>
            <input
              type="text"
              name="birthday_date"
              value={formData.birthday_date}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="15/08"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_clan_member"
            name="is_clan_member"
            checked={formData.is_clan_member}
            onChange={handleChange}
            className="w-4 h-4 text-yellow-300 bg-black/30 border-yellow-300/20 rounded focus:ring-yellow-300"
          />
          <label htmlFor="is_clan_member" className="ml-2 text-aura text-sm">
            Mark as Clan Member
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-300 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </form>
    </div>
  )
}
