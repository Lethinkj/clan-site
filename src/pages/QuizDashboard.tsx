import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizAuth } from '../contexts/QuizAuthContext'
import { supabase, Quiz } from '../lib/supabase'
import { StarfieldBackground } from '../components/ui/starfield'

export default function QuizDashboard() {
  const { user, signOut, checkBanStatus } = useQuizAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/quiz/auth')
      return
    }

    // Check ban status, but don't navigate away if there's an error
    const checkBan = async () => {
      try {
        const isBanned = await checkBanStatus()
        if (isBanned) {
          navigate('/quiz/auth')
        }
      } catch (error) {
        console.error('Error checking ban status:', error)
        // Don't kick user out on error
      }
    }

    checkBan()

    loadQuizzes()
  }, [user, navigate])

  const loadQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setQuizzes(data)
      }
    } catch (error) {
      console.error('Error loading quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut()
    navigate('/quiz/auth')
  }

  if (!user) return null

  return (
    <div className="min-h-screen relative">
      <StarfieldBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Quiz Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.name}!</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/quiz/leaderboard')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                       transition-colors font-medium"
            >
              Leaderboard
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg
                       transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6">Available Quizzes</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              <p className="text-gray-400 mt-4">Loading quizzes...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-300">No quizzes available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new quizzes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => {
                const isLive = quiz.quiz_type === 'live'
                const targetUrl = isLive ? `/quiz/live/${quiz.id}` : `/quiz/take/${quiz.id}`

                return (
                  <div
                    key={quiz.id}
                    className={`bg-gray-800/50 border rounded-xl p-6 hover:border-cyan-500/50 transition-all group cursor-pointer ${
                      isLive ? 'border-purple-700' : 'border-gray-700'
                    }`}
                    onClick={() => navigate(targetUrl)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors flex-1">
                        {quiz.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
                        isLive ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {isLive ? '🎥 LIVE' : '📝'}
                      </span>
                    </div>
                    {quiz.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {quiz.description}
                      </p>
                    )}
                    {isLive && (
                      <div className="mb-3 px-3 py-2 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                        <p className="text-purple-300 text-xs">
                          ⚡ Host-controlled • Answer questions as they appear
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {isLive ? 'Host controlled' : `${quiz.time_limit_minutes} mins`}
                      </div>
                      <button
                        className={`px-4 py-2 text-white text-sm rounded-lg transition-colors font-medium ${
                          isLive
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-cyan-600 hover:bg-cyan-700'
                        }`}
                      >
                        {isLive ? 'Join Live' : 'Start Quiz'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-3">Important Instructions</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span><strong>Live Quizzes:</strong> Host controls questions - answer as they appear</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span><strong>Self-Paced:</strong> Answer all questions at your own speed</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Copy-paste functionality is disabled during the quiz</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Switching tabs will be tracked and may affect your score</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>⚡ <strong>Speed Bonus:</strong> Faster correct answers earn extra points!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
