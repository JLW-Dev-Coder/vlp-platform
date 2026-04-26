import type { Metadata } from 'next'
import ProfilePreviewClient from './ProfilePreviewClient'

export const metadata: Metadata = { title: 'Profile Preview' }

export default function ProfilePreviewPage() {
  return <ProfilePreviewClient />
}
