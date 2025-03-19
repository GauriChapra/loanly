import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const DynamicAuthUI = dynamic(
  () => import('./DynamicAuthUI'),
  { ssr: false }
)

export default function AuthForm({ view = 'sign_in', redirectTo = '/' }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="auth-loading">Loading authentication...</div>
  }

  return <DynamicAuthUI view={view} redirectTo={redirectTo} />
}