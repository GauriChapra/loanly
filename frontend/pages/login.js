"use client";
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import AuthForm from '../components/auth/AuthForm'

export default function Login() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-800 py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-white mb-2">Loanly</h1>
          </Link>
          <p className="text-yellow-400 text-lg font-semibold">Welcome back!</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Sign in to your account</h2>
          <AuthForm view="sign_in" />

          <div className="mt-6 text-center text-gray-600">
            <p>
              Don&apos;t have an account?
              <Link href="/signup" className="text-blue-900 hover:text-blue-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 