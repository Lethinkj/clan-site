import React, { useState, useEffect } from 'react'
import { supabase, Quiz, QuizQuestion } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface QuestionInput {
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
  points: number
  time_limit_seconds: number
}

export default function QuizManagement() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeLimit, setTimeLimit] = useState(30)
  const [isActive, setIsActive] = useState(false)
  const [quizType, setQuizType] = useState<'self_paced' | 'live'>('self_paced')
  const [questions, setQuestions] = useState<QuestionInput[]>([{
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    points: 10,
    time_limit_seconds: 30
  }])

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setQuizzes(data)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setTimeLimit(30)
    setIsActive(false)
    setQuizType('self_paced')
    setQuestions([{
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      points: 10,
      time_limit_seconds: 30
    }])
    setEditingQuiz(null)
    setShowCreateForm(false)
  }

  const addQuestion = () => {
    setQuestions([...questions, {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      points: 10,
      time_limit_seconds: 30
    }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, field: keyof QuestionInput, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!title.trim()) {
      alert('Please enter a quiz title')
      return
    }

    if (questions.some(q => !q.question_text.trim() || !q.option_a.trim() || !q.option_b.trim() || !q.option_c.trim() || !q.option_d.trim())) {
      alert('Please fill in all question fields')
      return
    }

    try {
      if (editingQuiz) {
        // Update existing quiz
        const { error: quizError } = await supabase
          .from('quizzes')
          .update({
            title,
            description,
            time_limit_minutes: timeLimit,
            is_active: isActive,
            quiz_type: quizType,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingQuiz)

        if (quizError) throw quizError

        // Delete old questions
        await supabase
          .from('quiz_questions')
          .delete()
          .eq('quiz_id', editingQuiz)

        // Insert new questions
        const questionsToInsert = questions.map((q, index) => ({
          quiz_id: editingQuiz,
          ...q,
          question_order: index + 1
        }))

        const { error: questionsError } = await supabase
          .from('quiz_questions')
          .insert(questionsToInsert)

        if (questionsError) throw questionsError

        alert('Quiz updated successfully!')
      } else {
        // Create new quiz - ADD DEFAULT VALUES
        console.log('Creating quiz with data:', {
          title,
          description,
          time_limit_minutes: timeLimit,
          is_active: isActive,
          created_by: user?.id,
          quiz_type: quizType,
          is_live_active: false
        })

        const { data: newQuiz, error: quizError } = await supabase
          .from('quizzes')
          .insert([{
            title,
            description,
            time_limit_minutes: timeLimit,
            is_active: isActive,
            created_by: user?.id,
            quiz_type: quizType,
            is_live_active: false
          }])
          .select()
          .single()

        if (quizError || !newQuiz) {
          console.error('❌ QUIZ CREATION FAILED:', quizError)
          console.error('Error details:', JSON.stringify(quizError, null, 2))
          alert(`Quiz creation failed: ${quizError?.message || 'Unknown error'}. Check console for details.`)
          throw quizError
        }

        console.log('✅ Quiz created successfully:', newQuiz)

        // Insert questions with time limits
        const questionsToInsert = questions.map((q, index) => ({
          quiz_id: newQuiz.id,
          ...q,
          question_order: index + 1
        }))

        console.log('Inserting questions:', questionsToInsert)

        const { error: questionsError } = await supabase
          .from('quiz_questions')
          .insert(questionsToInsert)

        if (questionsError) {
          console.error('❌ QUESTIONS CREATION FAILED:', questionsError)
          console.error('Error details:', JSON.stringify(questionsError, null, 2))
          alert(`Questions creation failed: ${questionsError.message}. Check console for details.`)
          throw questionsError
        }

        console.log('✅ Questions inserted successfully')
        alert('Quiz created successfully!')
      }

      resetForm()
      loadQuizzes()
    } catch (error) {
      console.error('Error saving quiz:', error)
      alert(`Failed to save quiz: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleEdit = async (quizId: string) => {
    try {
      const { data: quiz } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single()

      const { data: quizQuestions } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('question_order', { ascending: true })

      if (quiz && quizQuestions) {
        setTitle(quiz.title)
        setDescription(quiz.description || '')
        setTimeLimit(quiz.time_limit_minutes)
        setIsActive(quiz.is_active)
        setQuizType(quiz.quiz_type || 'self_paced')
        setQuestions(quizQuestions.map(q => ({
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer,
          points: q.points,
          time_limit_seconds: q.time_limit_seconds || 30
        })))
        setEditingQuiz(quizId)
        setShowCreateForm(true)
      }
    } catch (error) {
      console.error('Error loading quiz for edit:', error)
      alert('Failed to load quiz')
    }
  }

  const handleDelete = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz? This will also delete all attempts and leaderboard entries.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId)

      if (error) throw error
      alert('Quiz deleted successfully')
      loadQuizzes()
    } catch (error) {
      console.error('Error deleting quiz:', error)
      alert('Failed to delete quiz')
    }
  }

  const toggleActive = async (quizId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ is_active: !currentStatus })
        .eq('id', quizId)

      if (error) throw error
      loadQuizzes()
    } catch (error) {
      console.error('Error toggling quiz status:', error)
      alert('Failed to update quiz status')
    }
  }

  const handleHostLiveQuiz = (quizId: string) => {
    navigate(`/admin/quiz/host/${quizId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Quiz Management</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
        >
          {showCreateForm ? 'Cancel' : 'Create New Quiz'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quiz Type *
                </label>
                <select
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value as 'self_paced' | 'live')}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                >
                  <option value="self_paced">Self-Paced</option>
                  <option value="live">Live (Admin Controlled)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  min={1}
                  max={180}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-cyan-600"
              />
              <label htmlFor="isActive" className="text-sm text-gray-300">
                Make quiz active (visible to users)
              </label>
            </div>

            {quizType === 'live' && (
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  ℹ️ <strong>Live Quiz Mode:</strong> You'll control when each question is shown to participants.
                  Use the "Host Quiz" button to start the live session.
                </p>
              </div>
            )}

            <div className="border-t border-gray-700 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white">Questions</h4>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                >
                  + Add Question
                </button>
              </div>

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-semibold text-white">Question {index + 1}</h5>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Question Text *</label>
                        <textarea
                          value={question.question_text}
                          onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                          <div key={opt}>
                            <label className="block text-sm text-gray-400 mb-1">Option {opt} *</label>
                            <input
                              type="text"
                              value={question[`option_${opt.toLowerCase()}` as keyof QuestionInput] as string}
                              onChange={(e) => updateQuestion(index, `option_${opt.toLowerCase()}` as keyof QuestionInput, e.target.value)}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                              required
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Correct Answer *</label>
                          <select
                            value={question.correct_answer}
                            onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Points *</label>
                          <input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(index, 'points', Number(e.target.value))}
                            min={1}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            Time Limit (sec) * {quizType === 'live' && '⏱️'}
                          </label>
                          <input
                            type="number"
                            value={question.time_limit_seconds}
                            onChange={(e) => updateQuestion(index, 'time_limit_seconds', Number(e.target.value))}
                            min={10}
                            max={300}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quiz List */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Existing Quizzes</h3>

        {loading ? (
          <p className="text-gray-400 text-center py-4">Loading...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No quizzes created yet</p>
        ) : (
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-white font-semibold">{quiz.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      quiz.is_active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {quiz.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      quiz.quiz_type === 'live' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {quiz.quiz_type === 'live' ? '🎥 Live' : '📝 Self-Paced'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {quiz.time_limit_minutes} minutes · Created {new Date(quiz.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {quiz.quiz_type === 'live' && quiz.is_active && (
                    <button
                      onClick={() => handleHostLiveQuiz(quiz.id)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded"
                    >
                      Host Quiz
                    </button>
                  )}
                  <button
                    onClick={() => toggleActive(quiz.id, quiz.is_active)}
                    className={`px-3 py-1 text-sm rounded ${
                      quiz.is_active
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {quiz.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(quiz.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
