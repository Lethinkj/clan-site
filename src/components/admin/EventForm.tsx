import React, { useState } from 'react'
import { supabase, Event } from '../../lib/supabase'

interface EventFormProps {
  onEventAdded: () => void
  isAdmin: boolean
  editingEvent?: Event | null
  onCancel?: () => void
}

export default function EventForm({ onEventAdded, isAdmin, editingEvent, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: editingEvent?.title || '',
    description: editingEvent?.description || '',
    date: editingEvent?.date || '',
    time: editingEvent?.time || '',
    end_time: editingEvent?.end_time || '',
    location: editingEvent?.location || '',
    attendees: editingEvent?.attendees || '',
    rating: editingEvent?.rating || '',
    tag: editingEvent?.tag || 'Weekly Bash',
    custom_category: editingEvent?.custom_category || '',
    status: editingEvent?.status || 'upcoming' as 'upcoming' | 'live' | 'ended' | 'completed',
    image_url: editingEvent?.image_url || '',
    max_registrations: editingEvent?.max_registrations?.toString() || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const eventData = {
        ...formData,
        max_registrations: formData.max_registrations ? parseInt(formData.max_registrations) : null,
        end_time: formData.end_time || null,
        custom_category: formData.tag === 'Other' ? formData.custom_category : null
      }

      if (editingEvent) {
        // Update existing event
        const { error: updateError } = await supabase
          .from('events')
          .update({
            ...eventData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEvent.id)

        if (updateError) throw updateError
        setSuccess('Event updated successfully!')
      } else {
        // Create new event
        const { error: insertError } = await supabase
          .from('events')
          .insert([eventData])

        if (insertError) throw insertError
        setSuccess('Event added successfully!')
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          end_time: '',
          location: '',
          attendees: '',
          rating: '',
          tag: 'Weekly Bash',
          custom_category: '',
          status: 'upcoming',
          image_url: '',
          max_registrations: ''
        })
      }

      onEventAdded()
      if (onCancel) {
        setTimeout(() => onCancel(), 1500)
      }
    } catch (err) {
      setError('Failed to save event. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">
        {editingEvent ? 'Edit Event' : 'Add New Event'}
      </h2>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-aura text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="Weekly Bash 18"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Tag *</label>
            <select
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
            >
              <option value="Weekly Bash">Weekly Bash</option>
              <option value="Project Showcase">Project Showcase</option>
              <option value="Workshop">Workshop</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Meetup">Meetup</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {formData.tag === 'Other' && (
            <div>
              <label className="block text-aura text-sm font-medium mb-2">Custom Category *</label>
              <input
                type="text"
                name="custom_category"
                value={formData.custom_category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
                placeholder="Enter category name"
              />
            </div>
          )}

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Date *</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="April 5, 2025"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Start Time *</label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="10:00 AM"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">End Time</label>
            <input
              type="text"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="3:00 PM"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="Big Data Lab"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Attendees *</label>
            <input
              type="text"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="20+"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Rating (for completed events)</label>
            <input
              type="text"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="4.9/5"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
            >
              <option value="upcoming">Upcoming (Scheduled)</option>
              <option value="live">Live (Happening Now)</option>
              <option value="ended">Ended (Recently)</option>
              <option value="completed">Completed (Archived)</option>
            </select>
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Max Registrations (for upcoming events)</label>
            <input
              type="number"
              name="max_registrations"
              value={formData.max_registrations}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="50"
            />
          </div>

          <div>
            <label className="block text-aura text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div>
          <label className="block text-aura text-sm font-medium mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50"
            placeholder="Join us for a day of learning..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-yellow-300 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Add Event'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-500/20 border border-gray-500/50 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
