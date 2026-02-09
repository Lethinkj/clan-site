import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuizAuth } from '../contexts/QuizAuthContext'
import { supabase, Quiz, QuizQuestion, QuizAttempt } from '../lib/supabase'

export default function LiveQuizParticipate() {
  const { id: quizId } = useParams<{ id: string }>()
  const { user, loading: authLoading, checkBanStatus } = useQuizAuth()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [waitingForQuestion, setWaitingForQuestion] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>()
  const tabSwitchTracked = useRef(false)

  useEffect(() => {
    // WAIT for auth context to load user from localStorage
    if (authLoading) {
      console.log('⏳ Waiting for auth to load...')
      return
    }

    // NOW check if user exists
    if (!user) {
      console.log('❌ No user found, redirecting to login')
      navigate('/quiz/auth')
      return
    }

    console.log('✅ User authenticated:', user.email)

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

    if (quizId) {
      initializeQuiz()
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [quizId, user, authLoading])

  // Subscribe to quiz changes (when admin shows questions)
  useEffect(() => {
    if (!quizId) return

    console.log('🔌 Setting up real-time subscription for quiz:', quizId)

    const channel = supabase
      .channel('live-quiz-updates-' + quizId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quizzes',
          filter: `id=eq.${quizId}`
        },
        (payload) => {
          console.log('📡 Received quiz update:', payload)
          const updatedQuiz = payload.new as Quiz
          setQuiz(updatedQuiz)

          if (updatedQuiz.is_live_active && updatedQuiz.current_question_id) {
            console.log('✅ New question available:', updatedQuiz.current_question_id)
            loadCurrentQuestion(updatedQuiz.current_question_id, updatedQuiz.question_start_time)
            setWaitingForQuestion(false)
            setHasAnswered(false)
            setSelectedAnswer(null)
            setShowCorrectAnswer(false)
          } else {
            console.log('⏸️ Quiz not active - waiting for question')
            setWaitingForQuestion(true)
          }
        }
      )
      .subscribe((status) => {
        console.log('📻 Subscription status:', status)
      })

    // Polling backup (every 2 seconds)
    const pollInterval = setInterval(async () => {
      try {
        const { data: quizData } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single()

        if (quizData && quizData.is_live_active && quizData.current_question_id) {
          if (!currentQuestion ||currentQuestion.id !== quizData.current_question_id) {
            console.log('🔔 Polling: New question detected:', quizData.current_question_id)
            loadCurrentQuestion(quizData.current_question_id, quizData.question_start_time)
            setWaitingForQuestion(false)
            setHasAnswered(false)
            setSelectedAnswer(null)
            setShowCorrectAnswer(false)
          }
        }
      } catch (error) {
        console.error('Poll error:', error)
      }
    }, 2000)

    return () => {
      console.log('🔌 Cleaning up subscription')
      supabase.removeChannel(channel)
      clearInterval(pollInterval)
    }
  }, [quizId, currentQuestion])

  // Timer countdown
  useEffect(() => {
    if (currentQuestion && timeLeft > 0 && !hasAnswered) {
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
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [currentQuestion, timeLeft, hasAnswered])

  const initializeQuiz = async () => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .eq('is_active', true)
        .single()

      if (quizError || !quizData) {
        alert('Quiz not found or is no longer active')
        navigate('/quiz/dashboard')
        return
      }

      if (quizData.quiz_type !== 'live') {
        alert('This is not a live quiz')
        navigate('/quiz/dashboard')
        return
      }

      setQuiz(quizData)

      // Check or create attempt
      const { data: existingAttempt } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('user_id', user!.id)
        .single()

      if (existingAttempt) {
        if (existingAttempt.is_submitted) {
          alert('You have already completed this quiz')
          navigate('/quiz/dashboard')
          return
        }
        setAttempt(existingAttempt)
      } else {
        const { data: newAttempt, error: attemptError } = await supabase
          .from('quiz_attempts')
          .insert([{
            quiz_id: quizId,
            user_id: user!.id,
            started_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (attemptError || !newAttempt) {
          alert('Failed to join quiz')
          navigate('/quiz/dashboard')
          return
        }
        setAttempt(newAttempt)
      }

      // Check if there's a current question
      if (quizData.is_live_active && quizData.current_question_id) {
        loadCurrentQuestion(quizData.current_question_id, quizData.question_start_time)
        setWaitingForQuestion(false)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error initializing quiz:', error)
      alert('An error occurred')
      navigate('/quiz/dashboard')
    }
  }

  const loadCurrentQuestion = async (questionId: string, startTime?: string) => {
    const { data } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('id', questionId)
      .single()

    if (data) {
      console.log('✅ Question loaded:', data.question_text)
      setCurrentQuestion(data)
      setQuestionStartTime(Date.now())

      if (startTime) {
        const elapsed = (Date.now() - new Date(startTime).getTime()) / 1000
        const remaining = Math.max(0, Math.floor(data.time_limit_seconds - elapsed))
        setTimeLeft(remaining)
      } else {
        setTimeLeft(data.time_limit_seconds)
      }
    } else {
      console.error('❌ Failed to load question:', questionId)
    }
  }

  const handleFullscreen = async () => {
    try {
      const elem = document.documentElement
      if (!isFullscreen) {
        // Enter fullscreen
        if (elem.requestFullscreen) {
          await elem.requestFullscreen()
          setIsFullscreen(true)
          console.log('✅ Enter fullscreen')
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen()
          setIsFullscreen(true)
        }
      } else {
        // Exit fullscreen
        if (document.fullscreenElement) {
          await document.exitFullscreen()
          setIsFullscreen(false)
          console.log('✅ Exit fullscreen')
        }
      }
    } catch (error) {
      console.error('❌ Fullscreen error:', error)
    }
  }

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement
      setIsFullscreen(isNowFullscreen)

      // Track if user exited fullscreen
      if (!isNowFullscreen && isFullscreen) {
        console.log('⚠️ User exited fullscreen')
        setFullscreenExitCount((prev) => prev + 1)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [isFullscreen])

  // Update leaderboard with tab switch and fullscreen data
  const updateLeaderboardWithTabSwitches = async (tabCount: number, fullscreenExits: number) => {
    if (!attempt || !quizId) return

    try {
      const { data: answers } = await supabase
        .from('quiz_answers')
        .select('response_time_seconds')
        .eq('attempt_id', attempt.id)

      const avgResponseTime = answers && answers.length > 0
        ? answers.reduce((sum, a) => sum + (a.response_time_seconds || 0), 0) / answers.length
        : 0

      const leaderboardUpdate = {
        quiz_id: quizId,
        user_id: user!.id,
        attempt_id: attempt.id,
        tab_switch_count: tabCount,
        fullscreen_exits: fullscreenExits,
        was_fullscreen: fullscreenExits > 0 || isFullscreen,
        score: 0, // Will be updated when answers are submitted
        avg_response_time: avgResponseTime
      }

      console.log('📊 Updating leaderboard with tab switches:', { tabCount, fullscreenExits })

      const { error } = await supabase
        .from('quiz_leaderboard')
        .upsert([leaderboardUpdate], {
          onConflict: 'quiz_id,user_id'
        })

      if (error) {
        console.error('❌ Failed to update tab switch data:', error)
      } else {
        console.log('✅ Tab switch data updated')
      }
    } catch (error) {
      console.error('Error updating leaderboard:', error)
    }
  }

  // Detect tab/window visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden/switched away
        console.log('👁️ User switched tab!')
        const newCount = tabSwitchCount + 1
        setTabSwitchCount(newCount)
        tabSwitchTracked.current = true

        // Update leaderboard immediately
        updateLeaderboardWithTabSwitches(newCount, fullscreenExitCount)
      } else {
        // Tab visible again
        console.log('👁️ User returned to tab')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [tabSwitchCount, fullscreenExitCount, attempt, user, quizId])

  // Auto-enter fullscreen for ALL devices (mobile, desktop, tablet)
  useEffect(() => {
    if (!isFullscreen && attempt && !loading && currentQuestion) {
      console.log('🖥️ Auto-entering fullscreen for all devices')
      setTimeout(() => {
        handleFullscreen().catch((err) => {
          console.warn('Could not auto-enter fullscreen:', err)
          // If fullscreen fails, that's OK - user can still use quiz
        })
      }, 800) // Delay to ensure page is fully rendered
    }
  }, [attempt, loading, currentQuestion])

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (hasAnswered || !currentQuestion || !attempt) return
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion || !attempt || hasAnswered) return

    console.log('📝 Submitting answer:', selectedAnswer, 'for question:', currentQuestion.id)

    // Check if this question was already answered (use maybeSingle to handle no results gracefully)
    const { data: existingAnswer, error: checkError } = await supabase
      .from('quiz_answers')
      .select('id')
      .eq('attempt_id', attempt.id)
      .eq('question_id', currentQuestion.id)
      .maybeSingle()

    if (checkError) {
      console.error('❌ Error checking for existing answer:', checkError)
      // Continue anyway - don't block submission
    }

    if (existingAnswer) {
      console.log('⚠️ Question already answered, not adding points again')
      setHasAnswered(true)
      return
    }

    const responseTime = (Date.now() - questionStartTime) / 1000
    const isCorrect = selectedAnswer === currentQuestion.correct_answer

    // Calculate score - base points only (10 points per correct answer)
    let points = 0
    if (isCorrect) {
      points = 10  // Fixed 10 points per correct answer

      // Add time bonus (max 5 bonus points)
      const timePercent = responseTime / currentQuestion.time_limit_seconds
      if (timePercent < 0.3) points += 5      // Very fast: 15 total
      else if (timePercent < 0.5) points += 3 // Fast: 13 total
      else if (timePercent < 0.7) points += 1 // Medium: 11 total
      // Slow (>70%): 10 total (no bonus)
    }

    console.log('📊 Answer details:', {
      isCorrect,
      responseTime: responseTime.toFixed(2) + 's',
      timePercent: ((responseTime / currentQuestion.time_limit_seconds) * 100).toFixed(1) + '%',
      basePoints: 10,
      bonus: points - (isCorrect ? 10 : 0),
      totalPoints: points
    })

    // Save answer
    const { error: answerError } = await supabase
      .from('quiz_answers')
      .insert([{
        attempt_id: attempt.id,
        question_id: currentQuestion.id,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        response_time_seconds: responseTime
      }])

    if (answerError) {
      console.error('❌ Failed to save answer:', answerError)
      alert('Failed to save answer: ' + answerError.message)
      return
    }

    console.log('✅ Answer saved')

    // Update attempt score - just add the points earned for THIS question
    const { data: attemptData } = await supabase
      .from('quiz_attempts')
      .select('total_score')
      .eq('id', attempt.id)
      .single()

    const newScore = (attemptData?.total_score || 0) + points

    const { error: scoreError } = await supabase
      .from('quiz_attempts')
      .update({ total_score: newScore })
      .eq('id', attempt.id)

    if (scoreError) {
      console.error('❌ Failed to update score:', scoreError)
    } else {
      console.log('✅ Score updated to:', newScore)
    }

    // Update leaderboard
    const { data: answers } = await supabase
      .from('quiz_answers')
      .select('response_time_seconds')
      .eq('attempt_id', attempt.id)

    const avgResponseTime = answers && answers.length > 0
      ? answers.reduce((sum, a) => sum + (a.response_time_seconds || 0), 0) / answers.length
      : 0

    console.log('📊 Updating leaderboard:', {
      quiz_id: quizId,
      user_id: user!.id,
      score: newScore,
      avg_response_time: avgResponseTime.toFixed(2)
    })

    const leaderboardEntry = {
      quiz_id: quizId!,
      user_id: user!.id,
      attempt_id: attempt.id,
      score: newScore,
      time_taken_seconds: 0,
      avg_response_time: avgResponseTime,
      is_hidden: false,
      is_removed: false,
      rank: 1 // Will be updated by trigger or client-side
    }

    console.log('📝 Leaderboard entry to upsert:', leaderboardEntry)

    const { data: leaderboardResult, error: leaderboardError } = await supabase
      .from('quiz_leaderboard')
      .upsert([leaderboardEntry], {
        onConflict: 'quiz_id,user_id'
      })
      .select()

    if (leaderboardError) {
      console.error('❌ Failed to update leaderboard:', leaderboardError)
      console.error('Full error:', JSON.stringify(leaderboardError, null, 2))
    } else {
      console.log('✅ Leaderboard updated successfully')
      console.log('Result:', leaderboardResult)
    }

    setHasAnswered(true)
  }

  const handleTimeUp = () => {
    if (!hasAnswered && selectedAnswer) {
      handleSubmitAnswer()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading || !quiz || !attempt) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400 mt-4">Joining quiz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
              <p className="text-gray-400">Live Quiz - Follow the host's lead</p>
              {/* Tab Switch & Fullscreen Indicators */}
              <div className="flex gap-4 mt-3 text-sm">
                {tabSwitchCount > 0 && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    <span>Tab Switches: {tabSwitchCount}</span>
                  </div>
                )}
                {fullscreenExitCount > 0 && (
                  <div className="flex items-center gap-2 text-orange-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                    </svg>
                    <span>Fullscreen Exits: {fullscreenExitCount}</span>
                  </div>
                )}
                {isFullscreen && (
                  <div className="flex items-center gap-2 text-green-400">
                    <span>📱 Fullscreen Active</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleFullscreen}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 20v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        {waitingForQuestion || !currentQuestion ? (
          <div className="bg-gray-900 rounded-lg shadow-xl p-12 text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-purple-500/20 rounded-full mb-4">
                <svg className="w-16 h-16 text-purple-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Waiting for Host...</h2>
              <p className="text-gray-400">The host will show the next question shortly</p>
            </div>
            <p className="text-sm text-gray-500">Stay on this page - it will update automatically</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg shadow-xl p-8">
            {/* Timer */}
            <div className="text-center mb-6">
              <div className={`text-5xl font-bold mb-2 ${
                timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-cyan-400'
              }`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-400">Time Remaining</p>
            </div>

            {/* Question */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-6">
                {currentQuestion.question_text}
              </h3>

              <div className="space-y-4">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                  const isSelected = selectedAnswer === opt
                  const isCorrect = showCorrectAnswer && opt === currentQuestion.correct_answer
                  const isWrong = showCorrectAnswer && isSelected && opt !== currentQuestion.correct_answer

                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswerSelect(opt)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isCorrect
                          ? 'border-green-500 bg-green-500/20 text-white'
                          : isWrong
                          ? 'border-red-500 bg-red-500/20 text-white'
                          : isSelected
                          ? 'border-cyan-500 bg-cyan-500/20 text-white'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      } disabled:cursor-not-allowed`}
                    >
                      <span className="font-bold text-cyan-400 mr-3">{opt}.</span>
                      {currentQuestion[`option_${opt.toLowerCase()}` as keyof QuizQuestion]}
                      {isCorrect && <span className="ml-2 text-green-400">✓ Correct!</span>}
                      {isWrong && <span className="ml-2 text-red-400">✗ Wrong</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit Button */}
            {!hasAnswered && selectedAnswer && (
              <div className="text-center">
                <button
                  onClick={handleSubmitAnswer}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                >
                  Submit Answer
                </button>
              </div>
            )}

            {/* Answered State */}
            {hasAnswered && (
              <div className="text-center p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                <p className="text-blue-300">
                  Answer submitted! Waiting for host to show next question...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
          <p className="text-yellow-400 text-sm text-center">
            ⚡ Answer quickly! Faster correct answers earn bonus points
          </p>
        </div>
      </div>
    </div>
  )
}
