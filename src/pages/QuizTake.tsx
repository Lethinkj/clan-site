import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuizAuth } from '../contexts/QuizAuthContext'
import { supabase, Quiz, QuizQuestion, QuizAttempt } from '../lib/supabase'

export default function QuizTake() {
  const { id: quizId } = useParams<{ id: string }>()
  const { user, checkBanStatus } = useQuizAuth()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, 'A' | 'B' | 'C' | 'D'>>(new Map())
  const [timeLeft, setTimeLeft] = useState(0)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showTabWarning, setShowTabWarning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()
  const hasStarted = useRef(false)

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

    if (quizId) {
      initializeQuiz()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [quizId, user])

  // Prevent copy-paste
  useEffect(() => {
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener('copy', preventCopyPaste)
    document.addEventListener('cut', preventCopyPaste)
    document.addEventListener('paste', preventCopyPaste)
    document.addEventListener('contextmenu', preventContextMenu)

    return () => {
      document.removeEventListener('copy', preventCopyPaste)
      document.removeEventListener('cut', preventCopyPaste)
      document.removeEventListener('paste', preventCopyPaste)
      document.removeEventListener('contextmenu', preventContextMenu)
    }
  }, [])

  // Detect tab switches
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasStarted.current && !submitting) {
        const newTabSwitches = tabSwitches + 1
        setTabSwitches(newTabSwitches)
        setShowTabWarning(true)

        // Update tab switches in database
        if (attempt) {
          supabase
            .from('quiz_attempts')
            .update({ tab_switches: newTabSwitches })
            .eq('id', attempt.id)
            .then()
        }

        // Hide warning after 3 seconds
        setTimeout(() => setShowTabWarning(false), 3000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [tabSwitches, attempt, submitting])

  const initializeQuiz = async () => {
    try {
      // Load quiz details
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

      setQuiz(quizData)

      // Load questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('question_order', { ascending: true })

      if (questionsError || !questionsData) {
        alert('Failed to load quiz questions')
        navigate('/quiz/dashboard')
        return
      }

      setQuestions(questionsData)

      // Check if user already has an attempt
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

        // Resume existing attempt
        setAttempt(existingAttempt)
        setTabSwitches(existingAttempt.tab_switches || 0)

        // Load previous answers
        const { data: previousAnswers } = await supabase
          .from('quiz_answers')
          .select('*')
          .eq('attempt_id', existingAttempt.id)

        if (previousAnswers) {
          const answerMap = new Map<string, 'A' | 'B' | 'C' | 'D'>()
          previousAnswers.forEach((ans) => {
            if (ans.selected_answer) {
              answerMap.set(ans.question_id, ans.selected_answer)
            }
          })
          setAnswers(answerMap)
        }

        // Calculate time left
        const startedAt = new Date(existingAttempt.started_at).getTime()
        const elapsed = (Date.now() - startedAt) / 1000
        const timeLimit = quizData.time_limit_minutes * 60
        setTimeLeft(Math.max(0, Math.floor(timeLimit - elapsed)))
      } else {
        // Create new attempt
        const { data: newAttempt, error: attemptError } = await supabase
          .from('quiz_attempts')
          .insert([{
            quiz_id: quizId,
            user_id: user!.id,
            started_at: new Date().toISOString(),
            tab_switches: 0
          }])
          .select()
          .single()

        if (attemptError || !newAttempt) {
          alert('Failed to start quiz attempt')
          navigate('/quiz/dashboard')
          return
        }

        setAttempt(newAttempt)
        setTimeLeft(quizData.time_limit_minutes * 60)
      }

      hasStarted.current = true
      setLoading(false)
    } catch (error) {
      console.error('Error initializing quiz:', error)
      alert('An error occurred while loading the quiz')
      navigate('/quiz/dashboard')
    }
  }

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !submitting && hasStarted.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up! Auto-submit
            handleSubmit()
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
  }, [timeLeft, submitting])

  const handleAnswerSelect = async (answer: 'A' | 'B' | 'C' | 'D') => {
    if (!attempt || submitting) return

    const currentQuestion = questions[currentQuestionIndex]
    const newAnswers = new Map(answers)
    newAnswers.set(currentQuestion.id, answer)
    setAnswers(newAnswers)

    // Save answer to database
    const isCorrect = answer === currentQuestion.correct_answer

    const { error } = await supabase
      .from('quiz_answers')
      .upsert([{
        attempt_id: attempt.id,
        question_id: currentQuestion.id,
        selected_answer: answer,
        is_correct: isCorrect
      }], {
        onConflict: 'attempt_id,question_id'
      })

    if (error) {
      console.error('Error saving answer:', error)
    }
  }

  const handleSubmit = async () => {
    if (!attempt || submitting) return

    setSubmitting(true)

    try {
      // Calculate time taken
      const startedAt = new Date(attempt.started_at).getTime()
      const timeTaken = Math.floor((Date.now() - startedAt) / 1000)

      // Call the database function to calculate score
      const { data, error } = await supabase
        .rpc('calculate_quiz_score', { attempt_uuid: attempt.id })

      if (error) {
        console.error('Error calculating score:', error)
        alert('Failed to submit quiz')
        setSubmitting(false)
        return
      }

      const score = data as number

      // Update attempt with time taken
      await supabase
        .from('quiz_attempts')
        .update({ time_taken_seconds: timeTaken })
        .eq('id', attempt.id)

      // Add to leaderboard
      await supabase
        .from('quiz_leaderboard')
        .upsert([{
          quiz_id: quiz!.id,
          user_id: user!.id,
          attempt_id: attempt.id,
          score: score,
          time_taken_seconds: timeTaken
        }], {
          onConflict: 'quiz_id,user_id'
        })

      // Navigate to results
      navigate(`/quiz/results/${attempt.id}`)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('An error occurred while submitting the quiz')
      setSubmitting(false)
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
          <p className="text-gray-400 mt-4">Loading quiz...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 select-none">
      {/* Tab switch warning */}
      {showTabWarning && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg
                      shadow-lg animate-pulse">
          <p className="font-bold">Warning: Tab switch detected!</p>
          <p className="text-sm">Total switches: {tabSwitches}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
            <div className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-cyan-400'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
            <div
              className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Tab Switches: {tabSwitches}</span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-8 mb-6">
          <h2 className="text-xl text-white mb-6 leading-relaxed">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-4">
            {(['A', 'B', 'C', 'D'] as const).map((option) => {
              const optionText = currentQuestion[`option_${option.toLowerCase()}` as keyof QuizQuestion]
              const isSelected = answers.get(currentQuestion.id) === option

              return (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={submitting}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all
                            ${isSelected
                              ? 'border-cyan-500 bg-cyan-500/20 text-white'
                              : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="font-bold text-cyan-400 mr-3">{option}.</span>
                  {optionText}
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0 || submitting}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg
                     transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                disabled={submitting}
                className={`w-10 h-10 rounded-lg font-medium transition-all
                          ${idx === currentQuestionIndex
                            ? 'bg-cyan-600 text-white'
                            : answers.has(questions[idx].id)
                            ? 'bg-green-600/30 text-green-400 border border-green-600'
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                          }
                          hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg
                       transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={submitting}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg
                       transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          )}
        </div>

        {/* Warning message */}
        <div className="mt-6 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
          <p className="text-yellow-400 text-sm text-center">
            Copy-paste is disabled. Switching tabs is being tracked.
          </p>
        </div>
      </div>
    </div>
  )
}
