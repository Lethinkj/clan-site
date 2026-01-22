import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function PasswordChange() {
  const { user, changePassword } = useAuth()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    setLoading(true)

    const result = await changePassword(formData.currentPassword, formData.newPassword)

    if (result.success) {
      setSuccess('Password changed successfully!')
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      setError(result.error || 'Failed to change password')
    }

    setLoading(false)
  }

  if (user?.isAdmin) {
    return (
      <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-yellow-300 mb-4">Change Password</h2>
        <p className="text-aura">Admin password is configured in the system and cannot be changed through the dashboard.</p>
      </div>
    )
  }

  return (
    <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">Change Password</h2>

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
        <div>
          <label className="block text-aura text-sm font-medium mb-2">Current Password</label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            required
            className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-aura text-sm font-medium mb-2">New Password</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            required
            className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-aura text-sm font-medium mb-2">Confirm New Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-300 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}
