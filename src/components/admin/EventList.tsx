import React, { useState, useEffect } from 'react'
import { Event, EventRegistration } from '../../lib/supabase'
import { supabase } from '../../lib/supabase'
import EventForm from './EventForm'
import { ConfirmDialog } from '../ui/Modal'

interface EventListProps {
  events: Event[]
  onEventUpdated: () => void
  onEventDeleted: () => void
  isAdmin: boolean
  isModerator: boolean
}

export default function EventList({ events, onEventUpdated, onEventDeleted, isAdmin, isModerator }: EventListProps) {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [registrationCounts, setRegistrationCounts] = useState<{ [eventId: string]: number }>({})
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([])

  useEffect(() => {
    fetchRegistrationCounts()
  }, [events])

  const fetchRegistrationCounts = async () => {
    const counts: { [eventId: string]: number } = {}
    for (const event of events) {
      const { count } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)
      counts[event.id] = count || 0
    }
    setRegistrationCounts(counts)
  }

  const fetchEventRegistrations = async (eventId: string) => {
    const { data } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false })
    setEventRegistrations(data || [])
  }

  const toggleExpanded = async (eventId: string) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null)
      setEventRegistrations([])
    } else {
      setExpandedEvent(eventId)
      await fetchEventRegistrations(eventId)
    }
  }

  const handleDelete = async (id: string) => {
    if (!isAdmin && !isModerator) return

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error

      onEventDeleted()
      setConfirmDelete(null)
    } catch (err) {
      console.error('Error deleting event:', err)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">🔴 LIVE</span>
      case 'upcoming':
        return <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">Upcoming</span>
      case 'ended':
        return <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-semibold">Ended</span>
      case 'completed':
        return <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm font-semibold">Completed</span>
      default:
        return null
    }
  }

  if (editingEvent) {
    return (
      <EventForm
        onEventAdded={() => {
          onEventUpdated()
          setEditingEvent(null)
        }}
        isAdmin={isAdmin}
        editingEvent={editingEvent}
        onCancel={() => setEditingEvent(null)}
      />
    )
  }

  return (
    <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">All Events ({events.length})</h2>
      
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-black/30 border border-yellow-300/10 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-yellow-300">{event.title}</h3>
                <p className="text-aura text-sm">
                  {event.tag === 'Other' && event.custom_category ? event.custom_category : event.tag}
                </p>
              </div>
              {getStatusBadge(event.status)}
            </div>

            <div className="text-aura text-sm mb-2">
              <p>📅 {event.date} | 🕐 {event.time}{event.end_time && ` - ${event.end_time}`}</p>
              <p>📍 {event.location} | 👥 {event.attendees} attendees</p>
              {event.rating && <p>⭐ {event.rating}</p>}
              {event.max_registrations && <p>📋 Max registrations: {event.max_registrations}</p>}
              <p className="text-yellow-300/70">
                📋 {registrationCounts[event.id] || 0} registered
                {registrationCounts[event.id] > 0 && (
                  <button
                    onClick={() => toggleExpanded(event.id)}
                    className="ml-2 text-blue-400 hover:text-blue-300 text-xs"
                  >
                    {expandedEvent === event.id ? '▼ Hide' : '▶ Show Names'}
                  </button>
                )}
              </p>
            </div>

            {/* Expanded registrations list */}
            {expandedEvent === event.id && eventRegistrations.length > 0 && (
              <div className="mb-4 p-3 bg-black/20 rounded-lg border border-yellow-300/10">
                <p className="text-yellow-300 text-sm font-semibold mb-2">Registered Members:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {eventRegistrations.map((reg, idx) => (
                    <div key={reg.id} className="text-aura text-xs bg-black/30 px-2 py-1 rounded">
                      {idx + 1}. {reg.name}
                      {reg.attending !== null && reg.attending !== undefined && (
                        <span className={reg.attending ? ' text-green-400' : ' text-red-400'}>
                          {reg.attending ? ' ✓' : ' ✕'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-aura text-sm mb-4">{event.description}</p>

            {event.image_url && (
              <img 
                src={event.image_url} 
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setEditingEvent(event)}
                className="flex-1 bg-yellow-300/20 border border-yellow-300/50 text-yellow-300 px-4 py-2 rounded-lg hover:bg-yellow-300/30 transition-colors"
              >
                Edit
              </button>
              {(isAdmin || isModerator) && (
                <button
                  onClick={() => setConfirmDelete(event.id)}
                  className="flex-1 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <p className="text-aura text-center py-8">No events found. Add your first event above!</p>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete Event"
        message="Are you sure you want to delete this event? All registrations will also be deleted. This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}
