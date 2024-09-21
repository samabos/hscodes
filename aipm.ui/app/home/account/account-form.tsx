'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button";
import Avatar from './avatar'

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx- p-6 shadow-inner rounded-lg">
      <div className="flex flex-col items-center mb-6">
        <Avatar
          uid={user?.id ?? null}
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url)
            updateProfile({ fullname, username, website, avatar_url: url })
          }}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          id="email"
          type="text"
          value={user?.email}
          disabled
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          />
      </div>
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          />
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          />
      </div>
      <div className="mb-4">
        <label htmlFor="website" className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
          Website
        </label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          />
      </div>

      <div>
      <Button  onClick={() => updateProfile({ fullname, username, website, avatar_url })}
              asChild
              size="sm"
              variant={"outline"}
              disabled={loading}
              className="opacity-75 "
              type="submit"
            ><text> {loading ? 'Loading ...' : 'Update'} </text>
            </Button>
      </div>
    </div>
  )
}
