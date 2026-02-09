import React, { useState, useEffect } from 'react'
import { supabase, Quiz, QuizLeaderboardEntry } from '../../lib/supabase'

interface LeaderboardWithUser extends QuizLeaderboardEntry {
  quiz_users?: {
    name: string
    email: string
  }
}

export default function LeaderboardManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadQuizzes()
  }, [])

  useEffect(() => {
    if (selectedQuiz) {
      loadLeaderboard(selectedQuiz)
    }
  }, [selectedQuiz, showAll])

  const loadQuizzes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      setQuizzes(data)
      setSelectedQuiz(data[0].id)
    }
    setLoading(false)
  }

  const loadLeaderboard = async (quizId: string) => {
    try {
      let query = supabase
        .from('quiz_leaderboard')
        .select(`
          *,
          quiz_users (
            name,
            email
          )
        `)
        .eq('quiz_id', quizId)
        .order('rank', { ascending: true })

      if (!showAll) {
        query = query.eq('is_removed', false)
      }

      const { data, error } = await query

      if (!error && data) {
        setLeaderboard(data as LeaderboardWithUser[])
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    }
  }

  const toggleHide = async (entryId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('quiz_leaderboard')
        .update({ is_hidden: !currentStatus })
        .eq('id', entryId)

      if (error) throw error
      alert(`Entry ${!currentStatus ? 'hidden' : 'unhidden'} successfully`)
      loadLeaderboard(selectedQuiz!)
    } catch (error) {
      console.error('Error toggling hide status:', error)
      alert('Failed to update entry status')
    }
  }

  const toggleRemove = async (entryId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('quiz_leaderboard')
        .update({ is_removed: !currentStatus })
        .eq('id', entryId)

      if (error) throw error
      alert(`Entry ${!currentStatus ? 'removed' : 'restored'} successfully`)
      loadLeaderboard(selectedQuiz!)
    } catch (error) {
      console.error('Error toggling remove status:', error)
      alert('Failed to update entry status')
    }
  }

  const deleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to permanently delete this leaderboard entry?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('quiz_leaderboard')
        .delete()
        .eq('id', entryId)

      if (error) throw error
      alert('Entry deleted successfully')
      loadLeaderboard(selectedQuiz!)
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('Failed to delete entry')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading || !selectedQuiz) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        <p className="text-gray-400 mt-4">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Leaderboard Management</h2>
        <p className="text-gray-400 text-sm">Manage quiz leaderboards, hide or remove entries</p>
      </div>

      {/* Quiz Selector & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Quiz
          </label>
          <select
            value={selectedQuiz || ''}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          >
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-cyan-600"
            />
            Show removed entries
          </label>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No leaderboard entries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leaderboard.map((entry) => {
                  const userName = entry.quiz_users?.name || 'Unknown User'
                  const userEmail = entry.quiz_users?.email || 'N/A'

                  return (
                    <tr
                      key={entry.id}
                      className={`hover:bg-gray-800/30 ${
                        entry.is_removed ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-cyan-400">
                          #{entry.rank || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{userName}</div>
                        <div className="text-xs text-gray-400">{userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-cyan-400">
                          {entry.score} pts
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {formatTime(entry.time_taken_seconds)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {entry.is_removed && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-600 text-white w-fit">
                              Removed
                            </span>
                          )}
                          {entry.is_hidden && !entry.is_removed && (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-600 text-white w-fit">
                              Hidden
                            </span>
                          )}
                          {!entry.is_hidden && !entry.is_removed && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-600 text-white w-fit">
                              Visible
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toggleHide(entry.id, entry.is_hidden)}
                            className={`px-3 py-1 rounded text-white text-xs ${
                              entry.is_hidden
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-yellow-600 hover:bg-yellow-700'
                            }`}
                            disabled={entry.is_removed}
                          >
                            {entry.is_hidden ? 'Unhide' : 'Hide'}
                          </button>
                          <button
                            onClick={() => toggleRemove(entry.id, entry.is_removed)}
                            className={`px-3 py-1 rounded text-white text-xs ${
                              entry.is_removed
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-orange-600 hover:bg-orange-700'
                            }`}
                          >
                            {entry.is_removed ? 'Restore' : 'Remove'}
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-white mb-3">Status Legend</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-green-600 text-white">Visible</span>
            <span className="text-gray-400">Entry is visible to all users</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-yellow-600 text-white">Hidden</span>
            <span className="text-gray-400">Entry is hidden but still counted</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-red-600 text-white">Removed</span>
            <span className="text-gray-400">Entry is removed from rankings</span>
          </div>
        </div>
      </div>
    </div>
  )
}
