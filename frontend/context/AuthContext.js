import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const AuthContext = createContext({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  loading: true
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error.message)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_IN') {
        router.push('/')
      }
      if (event === 'SIGNED_OUT') {
        router.push('/')
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [router])

  const signIn = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in:', error.message)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error.message)
    }
  }

  const value = {
    user,
    signIn,
    signOut,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 