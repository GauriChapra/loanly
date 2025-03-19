"use client";
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../utils/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // Handle the initial session check
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (session) {
          router.push('/')
        }
      } catch (error) {
        console.error('Error checking session:', error.message)
      }
    }

    checkSession()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/')
      } else if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
        <p className="text-xl">Completing sign in...</p>
      </div>
    </div>
  )
} 