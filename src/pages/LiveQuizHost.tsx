import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, Quiz, QuizQuestion, QuizLeaderboardEntry } from '../lib/supabase'

interface LeaderboardWithUser extends QuizLeaderboardEntry {
  quiz_users?: {
    name: string
  }
}

export default function LiveQuizHost() {
  const { id: quizId } = useParams<{ id: string }>()
  const { user, isAdmin, isModerator } = useAuth()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [questionShown, setQuestionShown] = useState(false) // Track if question was started
  const [leaderboard, setLeaderboard] = useState<LeaderboardWithUser[]>([])
  const [participantCount, setParticipantCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!user || (!isAdmin && !isModerator)) {
      navigate('/login')
      return
    }

    if (quizId) {
      loadQuiz()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [quizId, user, isAdmin, isModerator])

  // Timer countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    }
  }, [isActive, timeLeft])

  // Real-time leaderboard updates
  useEffect(() => {
    if (!quizId) return

    loadLeaderboard()

    const channel = supabase
      .channel('live-quiz-leaderboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_leaderboard',
          filter: `quiz_id=eq.${quizId}`
        },
        () => {
          loadLeaderboard()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [quizId])

  // Track participant count
  useEffect(() => {
    if (!quizId) return

    const loadParticipants = async () => {
      const { count } = await supabase
        .from('quiz_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', quizId)
        .eq('is_submitted', false)

      setParticipantCount(count || 0)
    }

    loadParticipants()
    const interval = setInterval(loadParticipants, 5000)

    return () => clearInterval(interval)
  }, [quizId])

  const loadQuiz = async () => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single()

      if (quizError || !quizData) {
        alert('Quiz not found')
        navigate('/admin')
        return
      }

      if (quizData.quiz_type !== 'live') {
        alert('This is not a live quiz')
        navigate('/admin')
        return
      }

      setQuiz(quizData)

      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('question_order', { ascending: true })

      if (!questionsError && questionsData) {
        setQuestions(questionsData)
      }
    } catch (error) {
      console.error('Error loading quiz:', error)
      alert('Failed to load quiz')
      navigate('/admin')
    } finally {
      setLoading(false)
    }
  }

  const loadLeaderboard = async () => {
    if (!quizId) return

    console.log('📊 Loading leaderboard for quiz:', quizId)

    const { data, error } = await supabase
      .from('quiz_leaderboard')
      .select(`
        *,
        quiz_users (
          name
        )
      `)
      .eq('quiz_id', quizId)
      .eq('is_removed', false)
      .order('score', { ascending: false })
      .order('avg_response_time', { ascending: true })
      .limit(10)

    if (error) {
      console.error('❌ Failed to load leaderboard:', error)
      return
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No leaderboard entries found')
      setLeaderboard([])
      return
    }

    // Manually assign ranks based on sorted data
    const rankedData = data.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }))

    console.log('✅ Leaderboard loaded:', rankedData)
    setLeaderboard(rankedData as LeaderboardWithUser[])
  }

  const handleStartQuestion = async () => {
    if (currentQuestionIndex >= questions.length) return

    const currentQuestion = questions[currentQuestionIndex]

    console.log('🎬 Starting question:', currentQuestion.id)

    // Refresh leaderboard before showing new question
    loadLeaderboard()

    // Update quiz with current question
    const { error } = await supabase
      .from('quizzes')
      .update({
        is_live_active: true,
        current_question_id: currentQuestion.id,
        question_start_time: new Date().toISOString()
      })
      .eq('id', quizId)

    if (error) {
      console.error('❌ Failed to show question:', error)
      alert('Failed to show question: ' + error.message)
      return
    }

    console.log('✅ Question shown to participants')

    setTimeLeft(currentQuestion.time_limit_seconds)
    setIsActive(true)
    setShowAnswer(false)
    setQuestionShown(true) // Mark question as shown
  }

  const handleTimeUp = () => {
    setIsActive(false)
    // Don't automatically show answer - let admin decide when to reveal
  }

  const handleRevealAnswer = async () => {
    setShowAnswer(true)

    // Stop the quiz (set is_live_active to false) so users see answers
    await supabase
      .from('quizzes')
      .update({
        is_live_active: false
      })
      .eq('id', quizId)

    console.log('✅ Answer revealed to participants')

    // Refresh leaderboard after revealing answer to show latest scores
    setTimeout(() => {
      console.log('🔄 Refreshing leaderboard after answer reveal')
      loadLeaderboard()
    }, 1500)  // Give users 1.5 seconds to submit their answers
  }

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      console.log('➡️ Moving to next question')

      // Clear current question in database first
      await supabase
        .from('quizzes')
        .update({
          is_live_active: false,
          current_question_id: null,
          question_start_time: null
        })
        .eq('id', quizId)

      // Reset all state
      setIsActive(false)
      setShowAnswer(false)
      setQuestionShown(false) // Reset for next question
      setTimeLeft(0)

      // Move to next question (use functional update to ensure correct value)
      setCurrentQuestionIndex(prev => prev + 1)

      console.log('✅ Ready for question', currentQuestionIndex + 2)
    } else {
      handleEndQuiz()
    }
  }

  const handleEndQuiz = async () => {
    if (!confirm('Are you sure you want to end the quiz?')) return

    await supabase
      .from('quizzes')
      .update({
        is_live_active: false,
        current_question_id: null,
        question_start_time: null,
        is_active: false
      })
      .eq('id', quizId)

    alert('Quiz ended! Redirecting to dashboard...')
    navigate('/admin')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading || !quiz) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400 mt-4">Loading quiz...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{quiz.title}</h1>
              <p className="text-gray-400">Live Quiz Host Control</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-4 py-2 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{participantCount}</div>
                <div className="text-xs text-gray-400">Participants</div>
              </div>
              <button
                onClick={handleEndQuiz}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                End Quiz
              </button>
            </div>
          </div>

         {/* Progress */}
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Display */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg shadow-xl p-8">
              {!questionShown ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Ready to show Question {currentQuestionIndex + 1}?
                  </h2>
                  <p className="text-gray-400 mb-8">
                    {currentQuestion?.question_text}
                  </p>
                  <button
                    onClick={handleStartQuestion}
                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-lg transition-colors"
                  >
                    Show Question to Participants
                  </button>
                </div>
              ) : (
                <>
                  {/* Timer */}
                  <div className="text-center mb-6">
                    <div className={`text-6xl font-bold ${
                      timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-cyan-400'
                    }`}>
                      {formatTime(timeLeft)}
                    </div>
                    <p className="text-gray-400 mt-2">
                      {isActive ? 'Time Remaining' : 'Time Up!'}
                    </p>
                  </div>

                  {/* Question */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {currentQuestion.question_text}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                        const isCorrect = showAnswer && opt === currentQuestion.correct_answer
                        return (
                          <div
                            key={opt}
                            className={`p-4 rounded-lg border-2 ${
                              isCorrect
                                ? 'border-green-500 bg-green-500/20'
                                : 'border-gray-700 bg-gray-800/50'
                            }`}
                          >
                            <span className="font-bold text-cyan-400 mr-2">{opt}.</span>
                            <span className="text-white">
                              {currentQuestion[`option_${opt.toLowerCase()}` as keyof QuizQuestion]}
                            </span>
                            {isCorrect && <span className="ml-2 text-green-400">✓ Correct</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Controls */}
                  {!isActive && !showAnswer && (
                    <div className="text-center space-y-3">
                      <button
                        onClick={handleRevealAnswer}
                        className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors mr-3"
                      >
                        Reveal Answer
                      </button>
                    </div>
                  )}

                  {!isActive && showAnswer && (
                    <div className="text-center">
                      <button
                        onClick={handleNextQuestion}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
                      >
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Live Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Live Leaderboard</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadLeaderboard}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Refresh leaderboard"
                  >
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {leaderboard.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No scores yet</p>
              ) : (
                <div className="space-y-3 text-sm">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex flex-col gap-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-bold ${
                            index === 0 ? 'text-yellow-400' :
                            index === 1 ? 'text-gray-300' :
                            index === 2 ? 'text-orange-400' :
                            'text-cyan-400'
                          }`}>
                            #{entry.rank}
                          </span>
                          <span className="text-white truncate font-semibold">
                            {entry.quiz_users?.name || 'Unknown'}
                          </span>
                        </div>
                        <span className="text-cyan-400 font-bold">{entry.score} pts</span>
                      </div>

                      {/* Tab Switch & Fullscreen Data */}
                      <div className="flex gap-3 text-xs opacity-75 flex-wrap">
                        {(entry.tab_switch_count as any ?? 0) > 0 && (
                          <span className="text-yellow-400">
                            📊 Tab Switches: {entry.tab_switch_count}
                          </span>
                        )}
                        {(entry.fullscreen_exits as any ?? 0) > 0 && (
                          <span className="text-orange-400">
                            🖥️ Exits: {entry.fullscreen_exits}
                          </span>
                        )}
                        {(entry.was_fullscreen as any) && (
                          <span className="text-green-400">
                            ✓ Fullscreen Used
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
