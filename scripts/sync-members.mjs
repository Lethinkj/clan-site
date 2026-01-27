import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const API_URL = process.env.MEMBERS_API_URL || 'https://terminal.bytebashblitz.org/api/clan/1?fields=name,github_username,portfolio_url,linkedin_url,primary_domain,secondary_domain,avatar_url'

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } })

async function fetchMembers() {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(`Failed to fetch API: ${res.status}`)
  const json = await res.json()
  return (json.data && json.data.members) || []
}

async function upsertMember(m) {
  const external_name = (m.name || '').trim()
  const avatar_url = m.avatar_url || m.image_url || m.avatar || null

  const payload = {
    external_name,
    username: external_name,
  }
  if (avatar_url) payload.avatar_url = avatar_url

  const { error } = await supabase.from('users').upsert([payload], { onConflict: ['external_name'] })
  if (error) {
    console.error('Upsert error for', external_name, error)
  } else {
    console.log('Upserted', external_name)
  }
}

async function run() {
  console.log('Starting members sync')
  const members = await fetchMembers()
  console.log(`Fetched ${members.length} members from API`)

  for (const m of members) {
    try {
      await upsertMember(m)
    } catch (err) {
      console.error('Error processing member', m.name, err)
    }
  }

  console.log('Members sync complete')
}

run().catch(err => {
  console.error('Sync failed', err)
  process.exit(1)
})
