import React, { useState, useEffect } from 'react'
import { supabase, User } from '../../lib/supabase'

interface MemberFormProps {
  onMemberAdded: () => void
  editingMember?: User | null
  onEditComplete?: () => void
}

export default function MemberForm({ onMemberAdded, editingMember, onEditComplete }: MemberFormProps) {
  const [formData, setFormData] = useState({
    discord_user_id: '',
    username: '',
    is_clan_member: true,
    dob: '', // DD/MM format
    avatar_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (editingMember) {
      setFormData({
        discord_user_id: editingMember.discord_user_id,
        username: editingMember.username,
        is_clan_member: editingMember.is_clan_member,
        dob: '',
        avatar_url: editingMember.avatar_url || ''
      })
    } else {
      setFormData({
        discord_user_id: '',
        username: '',
        is_clan_member: true,
        dob: '',
        avatar_url: ''
      })
    }
  }, [editingMember])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (editingMember) {
        // Update existing member
        const { error: updateError } = await supabase
          .from('users')
          .update({
            discord_user_id: formData.discord_user_id,
            username: formData.username,
            is_clan_member: formData.is_clan_member
            , avatar_url: formData.avatar_url
          })
          .eq('id', editingMember.id)

        if (updateError) throw updateError

        setSuccess('Member updated successfully!')
        onEditComplete?.()
      } else {
        // Add new member
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
            , avatar_url: formData.avatar_url
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
        onMemberAdded()
      }
    } catch (err) {
      setError(editingMember ? 'Failed to update member. Please try again.' : 'Failed to add member. Please try again.')
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
    <div className="bg-slate-900/80 border border-cyan-400/20 p-6 rounded-lg mb-6 shadow-lg shadow-cyan-500/5">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">
        {editingMember ? 'Edit Member' : 'Add New Member'}
      </h2>

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
              disabled={!!editingMember}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="123456789012345678"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Username (Name) *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              placeholder="Member Name"
            />
          </div>

            <div>
              <label className="block text-aura text-sm font-medium mb-2">Avatar URL</label>
              <input
                type="text"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="https://.../avatar.png"
              />
            </div>

          {!editingMember && (
            <div>
              <label className="block text-aura text-sm font-medium mb-2">Date of Birth (DD/MM)</label>
              <input
                type="text"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="15/08"
              />
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_clan_member"
            name="is_clan_member"
            checked={formData.is_clan_member}
            onChange={handleChange}
            className="w-4 h-4 text-cyan-400 bg-slate-900 border-slate-700 rounded focus:ring-cyan-400 focus:ring-1"
          />
          <label htmlFor="is_clan_member" className="ml-2 text-aura text-sm">
            Mark as Clan Member
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50 shadow-lg shadow-cyan-500/20"
          >
            {loading ? (editingMember ? 'Updating...' : 'Adding...') : (editingMember ? 'Update Member' : 'Add Member')}
          </button>
          {editingMember && (
            <button
              type="button"
              onClick={onEditComplete}
              className="px-6 bg-slate-800 border border-slate-700 text-aura font-medium rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
