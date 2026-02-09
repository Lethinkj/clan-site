import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuizAuth } from '../contexts/QuizAuthContext'
import { supabase, QuizAttempt, Quiz } from '../lib/supabase'
import { StarfieldBackground } from '../components/ui/starfield'

export default function QuizResults() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const { user } = useQuizAuth()
  const navigate = useNavigate()
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [rank, setRank] = useState<number | null>(null)
  const [totalParticipants, setTotalParticipants] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/quiz/auth')
      return
    }

    if (attemptId) {
      loadResults()
    }
  }, [attemptId, user])

  const loadResults = async () => {
    try {
      // Load attempt details
      const { data: attemptData, error: attemptError } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('id', attemptId)
        .single()

      if (attemptError || !attemptData) {
        alert('Failed to load results')
        navigate('/quiz/dashboard')
        return
      }

      setAttempt(attemptData)

      // Load quiz details
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', attemptData.quiz_id)
        .single()

      if (quizData) {
        setQuiz(quizData)
      }

      // Get leaderboard info
      const { data: leaderboardEntry } = await supabase
        .from('quiz_leaderboard')
        .select('rank')
        .eq('attempt_id', attemptId)
        .single()

      if (leaderboardEntry) {
        setRank(leaderboardEntry.rank || null)
      }

      // Get total participants
      const { count } = await supabase
        .from('quiz_leaderboard')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', attemptData.quiz_id)
        .eq('is_removed', false)

      setTotalParticipants(count || 0)
    } catch (error) {
      console.error('Error loading results:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number | undefined) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading || !attempt || !quiz) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400 mt-4">Loading results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <StarfieldBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-500/20 rounded-full mb-4">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Quiz Completed!</h1>
          <p className="text-gray-400">{quiz.title}</p>
        </div>

        {/* Results Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-800 mb-6">
          {/* Score */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-cyan-400 mb-2">
              {attempt.total_score}
            </div>
            <div className="text-gray-400 text-lg">Total Points</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {rank ? `#${rank}` : 'N/A'}
              </div>
              <div className="text-gray-400 text-sm">Your Rank</div>
              <div className="text-gray-500 text-xs mt-1">
                out of {totalParticipants}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {formatTime(attempt.time_taken_seconds)}
              </div>
              <div className="text-gray-400 text-sm">Time Taken</div>
              <div className="text-gray-500 text-xs mt-1">
                out of {quiz.time_limit_minutes} mins
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
              <div className={`text-3xl font-bold mb-2 ${
                attempt.tab_switches === 0 ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {attempt.tab_switches}
              </div>
              <div className="text-gray-400 text-sm">Tab Switches</div>
              <div className="text-gray-500 text-xs mt-1">
                {attempt.tab_switches === 0 ? 'Perfect!' : 'Fair play matters'}
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="text-center mb-6">
            {rank && rank <= 3 ? (
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                <p className="text-yellow-400 font-semibold">
                  🎉 Outstanding! You're in the top 3!
                </p>
              </div>
            ) : rank && rank <= 10 ? (
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                <p className="text-blue-400 font-semibold">
                  Great job! You're in the top 10!
                </p>
              </div>
            ) : (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400">
                  Good effort! Keep practicing to improve your rank.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/quiz/leaderboard')}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white
                       rounded-lg transition-colors font-medium"
            >
              View Leaderboard
            </button>
            <button
              onClick={() => navigate('/quiz/dashboard')}
              className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white
                       rounded-lg transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-3">What's Next?</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              <span>Check the leaderboard to see how you compare with others</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              <span>Try more quizzes to improve your skills</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              <span>Come back regularly for new quiz challenges</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
