import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizAuth } from '../contexts/QuizAuthContext'
import { supabase, Quiz, QuizLeaderboardEntry } from '../lib/supabase'
import { StarfieldBackground } from '../components/ui/starfield'

interface LeaderboardWithUser extends QuizLeaderboardEntry {
  quiz_users?: {
    name: string
    email: string
  }
}

export default function QuizLeaderboard() {
  const { user } = useQuizAuth()
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/quiz/auth')
      return
    }

    loadQuizzes()
  }, [user])

  useEffect(() => {
    if (selectedQuiz) {
      loadLeaderboard(selectedQuiz)

      // Set up real-time subscription
      const channel = supabase
        .channel('leaderboard-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'quiz_leaderboard',
            filter: `quiz_id=eq.${selectedQuiz}`
          },
          () => {
            loadLeaderboard(selectedQuiz, true)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [selectedQuiz])

  const loadQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        setQuizzes(data)
        setSelectedQuiz(data[0].id)
      }
    } catch (error) {
      console.error('Error loading quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLeaderboard = async (quizId: string, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    }

    try {
      console.log('📊 Loading public leaderboard for quiz:', quizId)

      const { data, error } = await supabase
        .from('quiz_leaderboard')
        .select(`
          *,
          quiz_users (
            name,
            email
          )
        `)
        .eq('quiz_id', quizId)
        .eq('is_hidden', false)
        .eq('is_removed', false)
        .order('score', { ascending: false })
        .order('avg_response_time', { ascending: true })

      if (error) {
        console.error('❌ Failed to load leaderboard:', error)
        return
      }

      if (!data || data.length === 0) {
        console.log('⚠️ No leaderboard entries for this quiz')
        setLeaderboard([])
        return
      }

      // Manually assign ranks
      const rankedData = data.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))

      console.log('✅ Public leaderboard loaded:', rankedData)
      setLeaderboard(rankedData as LeaderboardWithUser[])
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      if (isRefresh) {
        setRefreshing(false)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getRankColor = (rank: number | undefined) => {
    if (!rank) return 'text-gray-400'
    if (rank === 1) return 'text-yellow-400'
    if (rank === 2) return 'text-gray-300'
    if (rank === 3) return 'text-orange-400'
    return 'text-cyan-400'
  }

  const getRankBadge = (rank: number | undefined) => {
    if (!rank) return null
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400 mt-4">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <StarfieldBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
            <p className="text-gray-400">See how you rank against other participants</p>
          </div>
          <div className="flex gap-4">
            {refreshing && (
              <div className="flex items-center text-cyan-400 text-sm">
                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </div>
            )}
            <button
              onClick={() => navigate('/quiz/dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg
                       transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Quiz selector */}
        {quizzes.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Quiz
            </label>
            <select
              value={selectedQuiz || ''}
              onChange={(e) => setSelectedQuiz(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                       text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-300">No entries yet</h3>
              <p className="mt-1 text-sm text-gray-500">Be the first to complete this quiz!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser = entry.user_id === user?.id
                    const userName = entry.quiz_users?.name || 'Unknown User'

                    return (
                      <tr
                        key={entry.id}
                        className={`transition-colors ${
                          isCurrentUser
                            ? 'bg-cyan-900/20 border-l-4 border-cyan-500'
                            : 'hover:bg-gray-800/30'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-2xl font-bold ${getRankColor(entry.rank)}`}>
                            {getRankBadge(entry.rank)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white flex items-center gap-2">
                                {userName}
                                {isCurrentUser && (
                                  <span className="px-2 py-1 bg-cyan-600 text-white text-xs rounded-full">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-cyan-400">
                            {entry.score} pts
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
                            {formatTime(entry.time_taken_seconds)}
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

        {/* Live indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates enabled</span>
          </div>
        </div>
      </div>
    </div>
  )
}
