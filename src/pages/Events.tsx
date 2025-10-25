import React from 'react'

export default function Events() {
  const past = [
    { title: 'Weekly Bash 18', date: 'April 5, 2025', time: '10:00 AM - 3:00 PM', location: 'Big Data Lab', attendees: '20', rating: '4.9/5', tag: 'Weekly Bash' },
    { title: 'Aura-Connect 1', date: 'August 23, 2025', time: '10:00 AM - 3:00 PM', location: 'Big Data Lab', attendees: '25+', rating: '4.9/5', tag: 'Weekly Bash' },
    { title: 'Project Showcase 2', date: 'August 31, 2025', time: '4:00 PM - 7:00 PM', location: 'Online Meeting', attendees: '25+', rating: '4.7/5', tag: 'Project Showcase', desc: 'BBB Members showcasing their latest projects and innovations to the community.' }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-yellow-300 mb-4 a-fade-up">Events</h2>
  <p className="text-base sm:text-xl text-aura mb-8 a-fade-up">Join our community events to expand your knowledge and network</p>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12 a-stagger">
          <div className="bg-black/50 border border-yellow-300/20 p-4 rounded-lg shadow-md aura-card a-fade-up">
            <div className="text-3xl font-bold text-yellow-300 mb-1">3+</div>
            <p className="text-aura text-sm">Events Hosted</p>
          </div>
          <div className="bg-black/50 border border-yellow-300/20 p-4 rounded-lg shadow-md aura-card a-fade-up">
            <div className="text-3xl font-bold text-yellow-300 mb-1">25+</div>
            <p className="text-aura text-sm">Total Attendees</p>
          </div>
          <div className="bg-black/50 border border-yellow-300/20 p-4 rounded-lg shadow-md aura-card a-fade-up">
            <div className="text-3xl font-bold text-yellow-300 mb-1">4.8</div>
            <p className="text-aura text-sm">Average Rating</p>
          </div>
        </div>
      </div>

      <div>
  <h3 className="text-3xl font-bold text-yellow-300 mb-6 a-fade-up">Upcoming Events</h3>
  <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg shadow-md aura-card a-fade-up">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="bg-yellow-300/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold">Upcoming</span>
            </div>
            <span className="text-gray-400 text-sm">Weekly Bash</span>
          </div>
          <h4 className="text-2xl font-bold text-yellow-300 mb-2">Aura-Connect 2</h4>
          <div className="text-aura mb-2">📅 November 1, 2025 | 🕐 10:00 AM - 3:00 PM</div>
          <div className="text-aura mb-3">📍 Big Data Lab | 👥 30+ attendees</div>
          <p className="text-aura mb-4">Join us for a day of learning, collaboration, and fun with fellow developers in the Aura-7F community.</p>
          <button className="bg-yellow-300 hover:bg-yellow-400 text-slate-900 px-6 py-2 rounded-lg font-semibold transition-all">Register Now</button>
        </div>
      </div>

      <div>
  <h3 className="text-3xl font-bold text-yellow-300 mb-6">Past Events</h3>
        <div className="space-y-4 a-stagger">
          {past.map((event, i) => (
            <div key={i} className="bg-black/50 border border-yellow-300/20 p-5 rounded-lg shadow-md aura-card a-fade-up">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm font-semibold">Completed</span>
                <span className="text-gray-400 text-sm">{event.tag}</span>
              </div>
              <h4 className="text-xl font-bold text-yellow-300 mb-2">{event.title}</h4>
              <div className="text-aura text-sm mb-2">📅 {event.date} | 🕐 {event.time}</div>
              <div className="text-aura text-sm mb-2">📍 {event.location} | 👥 {event.attendees} attendees | ⭐ {event.rating} rating</div>
              <p className="text-aura text-sm">{event.desc || 'Join us for a day of learning, collaboration, and fun with fellow developers in the Aura-7F community.'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
