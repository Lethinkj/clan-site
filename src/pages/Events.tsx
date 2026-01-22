import React, { useEffect, useState } from 'react'
import { supabase, Event, EventRegistration } from '../lib/supabase'
import Modal, { Alert } from '../components/ui/Modal'

// Helper to parse date and time
const parseEventDateTime = (dateStr: string, timeStr: string): Date => {
  try {
    const combined = `${dateStr} ${timeStr}`
    return new Date(combined)
  } catch {
    return new Date()
  }
}

// Check and update event statuses
const checkEventStatuses = async () => {
  const now = new Date()
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .in('status', ['upcoming', 'live'])

  if (!events) return

  for (const event of events) {
    const startTime = parseEventDateTime(event.date, event.time)
    const endTime = event.end_time ? parseEventDateTime(event.date, event.end_time) : null

    let newStatus = event.status

    if (now >= startTime && event.status === 'upcoming') {
      newStatus = 'live'
    }
    
    if (endTime && now >= endTime && event.status === 'live') {
      newStatus = 'ended'
    }

    if (newStatus !== event.status) {
      await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', event.id)
    }
  }
}

export default function Events() {
  const [liveEvents, setLiveEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [endedEvents, setEndedEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    avgRating: '0'
  })
  const [registrationModal, setRegistrationModal] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<{ [eventId: string]: number }>({})
  const [registeredMembers, setRegisteredMembers] = useState<{ [eventId: string]: EventRegistration[] }>({})

  useEffect(() => {
    checkEventStatuses().then(() => fetchEvents())
    
    const interval = setInterval(() => {
      checkEventStatuses().then(() => fetchEvents())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Refresh only registrations for a specific event (to avoid full page glitch)
  const refreshEventRegistrations = async (eventId: string) => {
    try {
      const { data, count } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact' })
        .eq('event_id', eventId)
        .order('registered_at', { ascending: true })
      
      setRegistrations(prev => ({ ...prev, [eventId]: count || 0 }))
      setRegisteredMembers(prev => ({ ...prev, [eventId]: data || [] }))
    } catch (error) {
      console.error('Error refreshing registrations:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const { data: live } = await supabase.from('events').select('*').eq('status', 'live').order('date', { ascending: true })
      const { data: upcoming } = await supabase.from('events').select('*').eq('status', 'upcoming').order('date', { ascending: true })
      const { data: ended } = await supabase.from('events').select('*').eq('status', 'ended').order('date', { ascending: false })
      const { data: past } = await supabase.from('events').select('*').eq('status', 'completed').order('date', { ascending: false })

      setLiveEvents(live || [])
      setUpcomingEvents(upcoming || [])
      setEndedEvents(ended || [])
      setPastEvents(past || [])

      const allActiveEvents = [...(live || []), ...(upcoming || [])]
      if (allActiveEvents.length > 0) {
        const counts: { [eventId: string]: number } = {}
        const members: { [eventId: string]: EventRegistration[] } = {}
        for (const event of allActiveEvents) {
          const { data, count } = await supabase
            .from('event_registrations')
            .select('*', { count: 'exact' })
            .eq('event_id', event.id)
            .order('registered_at', { ascending: true })
          counts[event.id] = count || 0
          members[event.id] = data || []
        }
        setRegistrations(counts)
        setRegisteredMembers(members)
      }

      const allEvents = [...(live || []), ...(upcoming || []), ...(ended || []), ...(past || [])]
      const totalEvents = allEvents.length
      const totalAttendees = allEvents.reduce((sum, event) => {
        const num = parseInt(event.attendees.replace(/\D/g, ''))
        return sum + (isNaN(num) ? 0 : num)
      }, 0)

      const ratingsSum = allEvents.reduce((sum, event) => {
        if (event.rating) {
          const rating = parseFloat(event.rating.split('/')[0])
          return sum + (isNaN(rating) ? 0 : rating)
        }
        return sum
      }, 0)

      const eventsWithRatings = allEvents.filter(e => e.rating).length
      const avgRating = eventsWithRatings > 0 ? (ratingsSum / eventsWithRatings).toFixed(1) : '0'

      setStats({ totalEvents, totalAttendees, avgRating })
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <span className="bg-red-500/20 text-red-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold animate-pulse">🔴 LIVE</span>
      case 'upcoming':
        return <span className="bg-blue-500/20 text-blue-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">Upcoming</span>
      case 'ended':
        return <span className="bg-orange-500/20 text-orange-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">Event Ended</span>
      case 'completed':
        return <span className="bg-gray-500/20 text-gray-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">Completed</span>
      default:
        return null
    }
  }

  const EventCard = ({ event, showRegister = false }: { event: Event; showRegister?: boolean }) => (
    <div className={`bg-black/50 border ${event.status === 'live' ? 'border-red-500/50' : 'border-yellow-300/20'} p-3 sm:p-5 rounded-lg shadow-md aura-card md:a-fade-up a-wall-build`}>
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        {getStatusBadge(event.status)}
        <span className="text-gray-400 text-xs sm:text-sm">
          {event.tag === 'Other' && event.custom_category ? event.custom_category : event.tag}
        </span>
      </div>
      <h4 className="text-base sm:text-xl font-bold text-yellow-300 mb-1 sm:mb-2">{event.title}</h4>
      <div className="text-aura text-xs sm:text-sm mb-1 sm:mb-2">
        📅 {event.date} | 🕐 {event.time}{event.end_time && ` - ${event.end_time}`}
      </div>
      <div className="text-aura text-xs sm:text-sm mb-1 sm:mb-2">
        📍 {event.location} | 👥 {event.attendees} {event.status === 'upcoming' ? 'expected' : 'attendees'}
        {event.max_registrations && <span> | 📋 {registrations[event.id] || 0}/{event.max_registrations} registered</span>}
        {event.rating && ` | ⭐ ${event.rating} rating`}
      </div>
      <p className="text-aura text-xs sm:text-sm">{event.description}</p>
      {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover rounded-lg mt-3" />}
      
      {/* Show registered members */}
      {registeredMembers[event.id] && registeredMembers[event.id].length > 0 && (
        <div className="mt-3 p-3 bg-black/30 rounded-lg border border-yellow-300/10">
          <p className="text-yellow-300 text-xs sm:text-sm font-semibold mb-2">👥 Registered Members ({registeredMembers[event.id].length}):</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {registeredMembers[event.id].map((reg, idx) => (
              <span 
                key={reg.id} 
                className="bg-yellow-300/10 text-aura text-xs px-2 py-1 rounded-full border border-yellow-300/20"
              >
                {reg.name}
                {reg.attending !== null && reg.attending !== undefined && (
                  <span className={reg.attending ? ' text-green-400' : ' text-red-400'}>
                    {reg.attending ? ' ✓' : ' ✗'}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {showRegister && (event.status === 'upcoming' || event.status === 'live') && (
        <button onClick={() => setRegistrationModal(event)} className="mt-4 w-full bg-yellow-300 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors">
          {event.status === 'live' ? 'Register Now (Event is Live!)' : 'Register for Event'}
        </button>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-8">
        <div className="text-center px-3 sm:px-0">
          <h2 className="text-2xl sm:text-4xl font-bold text-yellow-300 mb-2 sm:mb-4">Events</h2>
          <p className="text-aura">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="text-center px-3 sm:px-0">
        <h2 id="events-title" className="text-2xl sm:text-4xl font-bold text-yellow-300 mb-2 sm:mb-4 a-fade-up scroll-mt-24">Events</h2>
        <p className="text-xs sm:text-base md:text-xl text-aura mb-4 sm:mb-8 a-fade-up">Join our community events to expand your knowledge and network</p>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto mb-6 sm:mb-12 md:a-stagger">
          <div className="bg-black/50 border border-yellow-300/20 p-2 sm:p-4 rounded-lg shadow-md aura-card md:a-fade-up a-wall-build">
            <div className="text-xl sm:text-3xl font-bold text-yellow-300 mb-0 sm:mb-1">{stats.totalEvents}+</div>
            <p className="text-aura text-[10px] sm:text-sm">Events Hosted</p>
          </div>
          <div className="bg-black/50 border border-yellow-300/20 p-2 sm:p-4 rounded-lg shadow-md aura-card md:a-fade-up a-wall-build">
            <div className="text-xl sm:text-3xl font-bold text-yellow-300 mb-0 sm:mb-1">{stats.totalAttendees}+</div>
            <p className="text-aura text-[10px] sm:text-sm">Total Attendees</p>
          </div>
          <div className="bg-black/50 border border-yellow-300/20 p-2 sm:p-4 rounded-lg shadow-md aura-card md:a-fade-up a-wall-build">
            <div className="text-xl sm:text-3xl font-bold text-yellow-300 mb-0 sm:mb-1">{stats.avgRating}</div>
            <p className="text-aura text-[10px] sm:text-sm">Average Rating</p>
          </div>
        </div>
      </div>

      {liveEvents.length > 0 && (
        <div className="px-3 sm:px-0">
          <h3 className="text-xl sm:text-3xl font-bold text-red-400 mb-3 sm:mb-6 a-fade-up flex items-center gap-2">
            <span className="animate-pulse">🔴</span> Live Now
          </h3>
          <div className="space-y-3 sm:space-y-4 md:a-stagger">
            {liveEvents.map((event) => <EventCard key={event.id} event={event} showRegister={true} />)}
          </div>
        </div>
      )}

      <div className="px-3 sm:px-0">
        <h3 className="text-xl sm:text-3xl font-bold text-yellow-300 mb-3 sm:mb-6 a-fade-up">Upcoming Events</h3>
        {upcomingEvents.length === 0 ? (
          <div className="bg-black/50 border border-yellow-300/20 p-4 sm:p-6 rounded-lg shadow-md aura-card md:a-fade-up a-wall-build text-center">
            <p className="text-aura text-sm sm:text-base">No upcoming events at the moment. Stay tuned for announcements!</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 md:a-stagger">
            {upcomingEvents.map((event) => <EventCard key={event.id} event={event} showRegister={true} />)}
          </div>
        )}
      </div>

      {endedEvents.length > 0 && (
        <div className="px-3 sm:px-0">
          <h3 className="text-xl sm:text-3xl font-bold text-orange-400 mb-3 sm:mb-6">Recently Ended</h3>
          <div className="space-y-3 sm:space-y-4 md:a-stagger">
            {endedEvents.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      )}

      <div className="px-3 sm:px-0">
        <h3 className="text-xl sm:text-3xl font-bold text-yellow-300 mb-3 sm:mb-6">Past Events</h3>
        {pastEvents.length === 0 ? (
          <div className="bg-black/50 border border-yellow-300/20 p-4 sm:p-6 rounded-lg shadow-md aura-card md:a-fade-up a-wall-build text-center">
            <p className="text-aura text-sm sm:text-base">No past events recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 md:a-stagger">
            {pastEvents.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>

      {registrationModal && (
        <RegistrationModal 
          event={registrationModal} 
          onClose={() => setRegistrationModal(null)}
          onRegistered={() => { refreshEventRegistrations(registrationModal.id); setRegistrationModal(null) }}
        />
      )}
    </div>
  )
}

function RegistrationModal({ event, onClose, onRegistered }: { event: Event; onClose: () => void; onRegistered: () => void }) {
  const eventTag = event.tag === 'Other' && event.custom_category ? event.custom_category : event.tag
  const isProjectShowcase = eventTag.toLowerCase().includes('project') || eventTag.toLowerCase().includes('showcase')
  const isWeeklyBash = eventTag.toLowerCase().includes('weekly bash') || eventTag.toLowerCase().includes('bash')

  if (isProjectShowcase) return <ProjectShowcaseForm event={event} onClose={onClose} onRegistered={onRegistered} />
  if (isWeeklyBash) return <WeeklyBashForm event={event} onClose={onClose} onRegistered={onRegistered} />
  return <GeneralRegistrationForm event={event} onClose={onClose} onRegistered={onRegistered} />
}

function ProjectShowcaseForm({ event, onClose, onRegistered }: { event: Event; onClose: () => void; onRegistered: () => void }) {
  const [formData, setFormData] = useState({
    name: '', registration_no: '', email: '', department: '', year: '', section: '', clan: '',
    project_title: '', project_category: '', custom_category: '', project_description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alertModal, setAlertModal] = useState<{ type: 'success' | 'error', title: string, message: string } | null>(null)

  const departments = ['CSE', 'AI', 'ECE', 'MECH', 'EEE', 'Civil']
  const years = ['1', '2', '3', '4']
  const sections = ['A', 'B', 'C', 'D', 'E', 'F']
  const clans = ['BC1', 'BC2', 'BC3', 'BC4']
  const categories = ['Web Development', 'Mobile App', 'AI/ML', 'IoT', 'Game Development', 'Other']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: existing } = await supabase.from('event_registrations').select('*').eq('event_id', event.id).eq('email', formData.email).single()
      if (existing) { setError('You have already registered for this event!'); setLoading(false); return }

      if (event.max_registrations) {
        const { count } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('event_id', event.id)
        if (count && count >= event.max_registrations) { setError('This event has reached maximum registrations!'); setLoading(false); return }
      }

      const finalCategory = formData.project_category === 'Other' ? formData.custom_category : formData.project_category

      const { error: insertError } = await supabase.from('event_registrations').insert([{
        event_id: event.id, name: formData.name, email: formData.email, registration_no: formData.registration_no,
        department: formData.department, year: formData.year, section: formData.section, clan: formData.clan,
        project_title: formData.project_title, project_category: finalCategory, project_description: formData.project_description
      }])

      if (insertError) throw insertError
      setAlertModal({ type: 'success', title: 'Registration Successful!', message: "Your project has been registered. We'll see you at the showcase!" })
    } catch (err) { setError('Failed to register. Please try again.'); console.error(err) } finally { setLoading(false) }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`Register for ${event.title}`} size="lg">
      {alertModal && <Alert isOpen={true} onClose={() => { setAlertModal(null); if (alertModal.type === 'success') onRegistered() }} type={alertModal.type} title={alertModal.title} message={alertModal.message} />}
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-aura text-sm font-medium mb-2">Full Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-aura text-sm font-medium mb-2">Registration No. *</label>
            <input type="text" value={formData.registration_no} onChange={(e) => setFormData({ ...formData, registration_no: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50" placeholder="RA2211003010XXX" />
          </div>
        </div>

        <div>
          <label className="block text-aura text-sm font-medium mb-2">Email *</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50" placeholder="you@example.com" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-aura text-sm font-medium mb-2">Department *</label>
            <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50">
              <option value="">Select</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-aura text-sm font-medium mb-2">Year *</label>
            <select value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50">
              <option value="">Select</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-aura text-sm font-medium mb-2">Section *</label>
            <select value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50">
              <option value="">Select</option>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-aura text-sm font-medium mb-2">Clan *</label>
            <select value={formData.clan} onChange={(e) => setFormData({ ...formData, clan: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50">
              <option value="">Select</option>
              {clans.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-aura text-sm font-medium mb-2">Project Title *</label>
          <input type="text" value={formData.project_title} onChange={(e) => setFormData({ ...formData, project_title: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50" placeholder="My Awesome Project" />
        </div>

        <div>
          <label className="block text-aura text-sm font-medium mb-2">Category *</label>
          <select value={formData.project_category} onChange={(e) => setFormData({ ...formData, project_category: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50">
            <option value="">Select category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {formData.project_category === 'Other' && (
          <div>
            <label className="block text-aura text-sm font-medium mb-2">Specify Category *</label>
            <input type="text" value={formData.custom_category} onChange={(e) => setFormData({ ...formData, custom_category: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50" placeholder="Enter your category" />
          </div>
        )}

        <div>
          <label className="block text-aura text-sm font-medium mb-2">Project Description *</label>
          <textarea value={formData.project_description} onChange={(e) => setFormData({ ...formData, project_description: e.target.value })} required rows={4} className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50 resize-none" placeholder="Describe your project..." />
        </div>

        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={loading} className="flex-1 bg-yellow-300 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50">{loading ? 'Registering...' : 'Submit Registration'}</button>
          <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-500/20 border border-gray-500/50 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors">Cancel</button>
        </div>
      </form>
    </Modal>
  )
}

function WeeklyBashForm({ event, onClose, onRegistered }: { event: Event; onClose: () => void; onRegistered: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', attending: null as boolean | null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alertModal, setAlertModal] = useState<{ type: 'success' | 'error', title: string, message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.attending === null) { setError('Please select if you are attending'); return }
    setLoading(true)

    try {
      const { data: existing } = await supabase.from('event_registrations').select('*').eq('event_id', event.id).eq('email', formData.email).single()
      if (existing) { setError('You have already responded to this event!'); setLoading(false); return }

      const { error: insertError } = await supabase.from('event_registrations').insert([{ event_id: event.id, name: formData.name, email: formData.email, attending: formData.attending }])
      if (insertError) throw insertError
      setAlertModal({ type: 'success', title: formData.attending ? "See you there!" : "Response Recorded", message: formData.attending ? "You're registered for Weekly Bash!" : "Thanks for letting us know. Maybe next time!" })
    } catch (err) { setError('Failed to submit response. Please try again.'); console.error(err) } finally { setLoading(false) }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`RSVP for ${event.title}`} size="sm">
      {alertModal && <Alert isOpen={true} onClose={() => { setAlertModal(null); if (alertModal.type === 'success') onRegistered() }} type={alertModal.type} title={alertModal.title} message={alertModal.message} />}
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-aura text-sm font-medium mb-2">Your Name *</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-aura text-sm font-medium mb-2">Email *</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-aura text-sm font-medium mb-3">Will you be attending? *</label>
          <div className="flex gap-4">
            <button type="button" onClick={() => setFormData({ ...formData, attending: true })} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-colors border ${formData.attending === true ? 'bg-green-500/30 border-green-500 text-green-400' : 'bg-black/30 border-yellow-300/20 text-aura hover:border-green-500/50'}`}>✓ Yes, I'm in!</button>
            <button type="button" onClick={() => setFormData({ ...formData, attending: false })} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-colors border ${formData.attending === false ? 'bg-red-500/30 border-red-500 text-red-400' : 'bg-black/30 border-yellow-300/20 text-aura hover:border-red-500/50'}`}>✕ Can't make it</button>
          </div>
        </div>
        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={loading} className="flex-1 bg-yellow-300 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50">{loading ? 'Submitting...' : 'Submit RSVP'}</button>
          <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-500/20 border border-gray-500/50 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors">Cancel</button>
        </div>
      </form>
    </Modal>
  )
}

function GeneralRegistrationForm({ event, onClose, onRegistered }: { event: Event; onClose: () => void; onRegistered: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', discord_id: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alertModal, setAlertModal] = useState<{ type: 'success' | 'error', title: string, message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: existing } = await supabase.from('event_registrations').select('*').eq('event_id', event.id).eq('email', formData.email).single()
      if (existing) { setError('You have already registered for this event!'); setLoading(false); return }

      if (event.max_registrations) {
        const { count } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('event_id', event.id)
        if (count && count >= event.max_registrations) { setError('This event has reached maximum registrations!'); setLoading(false); return }
      }

      const { error: insertError } = await supabase.from('event_registrations').insert([{ event_id: event.id, name: formData.name, email: formData.email, discord_id: formData.discord_id || null }])
      if (insertError) throw insertError
      setAlertModal({ type: 'success', title: 'Registration Successful!', message: "You're all set! We'll see you at the event!" })
    } catch (err) { setError('Failed to register. Please try again.'); console.error(err) } finally { setLoading(false) }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`Register for ${event.title}`} size="md">
      {alertModal && <Alert isOpen={true} onClose={() => { setAlertModal(null); if (alertModal.type === 'success') onRegistered() }} type={alertModal.type} title={alertModal.title} message={alertModal.message} />}
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-aura text-sm font-medium mb-2">Your Name *</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-aura text-sm font-medium mb-2">Email *</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-aura text-sm font-medium mb-2">Discord ID (Optional)</label>
          <input type="text" value={formData.discord_id} onChange={(e) => setFormData({ ...formData, discord_id: e.target.value })} className="w-full px-4 py-2 bg-black/30 border border-yellow-300/20 rounded-lg text-aura focus:outline-none focus:border-yellow-300/50" placeholder="username#1234" />
        </div>
        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={loading} className="flex-1 bg-yellow-300 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50">{loading ? 'Registering...' : 'Register'}</button>
          <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-500/20 border border-gray-500/50 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors">Cancel</button>
        </div>
      </form>
    </Modal>
  )
}
