'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Button } from "@/components/ui/button";

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
    {avatarUrl ? (
      <Image
        width={size}
        height={size}
        src={avatarUrl}
        alt="Avatar"
        className="rounded-full object-cover"
        style={{ height: size, width: size }}
      />
    ) : (
      <div
        className="rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
        style={{ height: size, width: size }}
      >
        {/* You can optionally add a placeholder icon here */}
      </div>
    )}
    <div className="w-full">
      <label
        className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-semibold py-1 px-2 rounded-md shadow-md block text-center dark:bg-sky-500 dark:hover:bg-sky-600"
        htmlFor="single"
      >
        {uploading ? 'Uploading ...' : 'Upload'}
      </label>
      <input
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        className="hidden"
      />
    </div>
  </div>
  
  )
}