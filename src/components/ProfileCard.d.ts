import React from 'react'

interface ProfileCardProps {
  avatarUrl?: string
  name?: string
  title?: string
  handle?: string
  status?: string
  bio?: string
  skills?: string[]
  github?: string
  linkedin?: string
  portfolio?: string
  showUserInfo?: boolean
  className?: string
}

declare const ProfileCard: React.FC<ProfileCardProps>

export default ProfileCard
