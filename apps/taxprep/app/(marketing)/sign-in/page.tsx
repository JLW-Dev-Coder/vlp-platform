import type { Metadata } from 'next'
import { SignInClient } from './sign-in-client'

export const metadata: Metadata = {
  title: 'Create your account',
  description: 'Get a SuiteDash workspace invite. Takes 30 seconds.',
}

export default function SignInPage() {
  return <SignInClient />
}
