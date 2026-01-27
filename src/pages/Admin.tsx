import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase, Event, User, Moderator } from '../lib/supabase'
import EventForm from '../components/admin/EventForm'
import MemberForm from '../components/admin/MemberForm'
import ModeratorManagement from '../components/admin/ModeratorManagement'
import EventList from '../components/admin/EventList'
import PasswordChange from '../components/admin/PasswordChange'
import RegistrationManagement from '../components/admin/RegistrationManagement'
import { ConfirmDialog } from '../components/ui/Modal'

type Tab = 'events' | 'members' | 'moderators' | 'registrations' | 'settings'

export default function Admin() {
  const { user, isAdmin, isModerator, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('events')
  const [events, setEvents] = useState<Event[]>([])
  const [members, setMembers] = useState<User[]>([])
  const [moderators, setModerators] = useState<Moderator[]>([])
  const [loading, setLoading] = useState(false)
  const [editingMember, setEditingMember] = useState<User | null>(null)
  const [memberToDelete, setMemberToDelete] = useState<User | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    } else if (!authLoading && !isModerator) {
      navigate('/')
    }
  }, [authLoading, user, isModerator, navigate])

  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents()
    } else if (activeTab === 'members') {
      fetchMembers()
    } else if (activeTab === 'moderators' && isAdmin) {
      fetchModerators()
    }
  }, [activeTab, isAdmin])

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) {
      console.error('Error fetching events:', error)
    } else {
      setEvents(data || [])
    }
    setLoading(false)
  }

  const fetchMembers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('joined_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching members:', error)
    } else {
      setMembers(data || [])
    }
    setLoading(false)
  }

  const fetchModerators = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('moderators')
      .select('*')
      .order('added_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching moderators:', error)
    } else {
      setModerators(data || [])
    }
    setLoading(false)
  }

  const handleDeleteMember = async () => {
    if (!memberToDelete) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', memberToDelete.id)

      if (error) throw error

      setMemberToDelete(null)
      fetchMembers()
    } catch (err) {
      console.error('Error deleting member:', err)
      alert('Failed to delete member')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400 mb-2">
              {isAdmin ? 'Admin' : 'Moderator'} Dashboard
            </h1>
            <p className="text-aura">Welcome back, {user.username}!</p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-cyan-400/20 overflow-x-auto">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'events'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-aura hover:text-cyan-400/70'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'members'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-aura hover:text-cyan-400/70'
            }`}
          >
            Members
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('moderators')}
              className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'moderators'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-aura hover:text-cyan-400/70'
              }`}
            >
              Moderators
            </button>
          )}
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'registrations'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-aura hover:text-cyan-400/70'
            }`}
          >
            Registrations
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-aura hover:text-cyan-400/70'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'events' && (
            <>
              <EventForm onEventAdded={fetchEvents} isAdmin={isAdmin} />
              <EventList 
                events={events} 
                onEventUpdated={fetchEvents} 
                onEventDeleted={fetchEvents} 
                isAdmin={isAdmin} 
                isModerator={isModerator}
              />
            </>
          )}

          {activeTab === 'members' && (
            <>
              {(isAdmin || (isModerator && editingMember)) && <MemberForm onMemberAdded={fetchMembers} editingMember={editingMember} onEditComplete={() => { setEditingMember(null); fetchMembers(); }} />}
              <div className="bg-slate-900/80 border border-cyan-400/20 p-6 rounded-lg shadow-lg shadow-cyan-500/5">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">Members ({members.length})</h2>
                {loading ? (
                  <p className="text-aura">Loading...</p>
                ) : members.length === 0 ? (
                  <p className="text-aura">No members found.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {members.map((member) => (
                      <div key={member.id} className="bg-slate-800/50 border border-cyan-400/10 p-4 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <img
                            src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.username)}&background=0f172a&color=22d3ee&size=96&bold=true`}
                            alt={member.username}
                            className="w-12 h-12 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <p className="text-cyan-400 font-semibold">{member.username}</p>
                            <p className="text-aura text-sm">@{member.username}</p>
                            <p className="text-aura text-sm">Discord ID: {member.discord_user_id}</p>
                            <p className="text-aura text-sm">{member.is_clan_member ? '✓ Clan Member' : 'Guest'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {isModerator && (
                            <button
                              onClick={() => setEditingMember(member)}
                              className="px-3 py-2 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors text-sm font-medium"
                            >
                              Edit
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => setMemberToDelete(member)}
                              className="px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'moderators' && isAdmin && (
            <ModeratorManagement 
              moderators={moderators} 
              onModeratorAdded={fetchModerators}
              onModeratorRemoved={fetchModerators}
            />
          )}

          {activeTab === 'registrations' && (
            <RegistrationManagement />
          )}

          {activeTab === 'settings' && (
            <PasswordChange />
          )}
        </div>

        {/* Delete Confirm Dialog */}
        <ConfirmDialog
          isOpen={!!memberToDelete}
          title="Remove Member"
          message={memberToDelete ? `Are you sure you want to remove ${memberToDelete.username}? This action cannot be undone.` : ''}
          onConfirm={handleDeleteMember}
          onClose={() => setMemberToDelete(null)}
          type="danger"
        />
      </div>
    </div>
  )
}
