import React, { useState, useEffect } from 'react'
import { supabase, QuizUser } from '../../lib/supabase'

export default function QuizUserManagement() {
  const [users, setUsers] = useState<QuizUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('quiz_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setUsers(data)
    }
    setLoading(false)
  }

  const toggleBan = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('quiz_users')
        .update({ is_banned: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      alert(`User ${!currentStatus ? 'banned' : 'unbanned'} successfully`)
      loadUsers()
    } catch (error) {
      console.error('Error toggling ban status:', error)
      alert('Failed to update user status')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their quiz attempts and leaderboard entries.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('quiz_users')
        .delete()
        .eq('id', userId)

      if (error) throw error
      alert('User deleted successfully')
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Quiz User Management</h2>
        <p className="text-gray-400 text-sm">Manage quiz participants, ban/unban users</p>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
        />
      </div>

      {/* Users List */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <p className="text-gray-400 mt-4">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.is_banned
                          ? 'bg-red-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}>
                        {user.is_banned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString()
                          : 'Never'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleBan(user.id, user.is_banned)}
                          className={`px-3 py-1 rounded text-white text-xs ${
                            user.is_banned
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-yellow-600 hover:bg-yellow-700'
                          }`}
                        >
                          {user.is_banned ? 'Unban' : 'Ban'}
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-cyan-400">
            {users.length}
          </div>
          <div className="text-sm text-gray-400">Total Users</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-green-400">
            {users.filter(u => !u.is_banned).length}
          </div>
          <div className="text-sm text-gray-400">Active Users</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-red-400">
            {users.filter(u => u.is_banned).length}
          </div>
          <div className="text-sm text-gray-400">Banned Users</div>
        </div>
      </div>
    </div>
  )
}
