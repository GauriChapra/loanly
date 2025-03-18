// components/auth/DynamicAuthUI.js
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../utils/supabase'

export default function DynamicAuthUI({ view = 'sign_in', redirectTo = '/' }) {
  return (
    <Auth
      supabaseClient={supabase}
      view={view}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#1e3a8a', // blue-900
              brandAccent: '#eab308', // yellow-400
              brandButtonText: 'white',
              defaultButtonBackground: '#1e3a8a',
              defaultButtonBackgroundHover: '#1e40af',
            },
            space: {
              inputPadding: '12px',
              buttonPadding: '12px',
            },
            borderWidths: {
              buttonBorderWidth: '2px',
              inputBorderWidth: '2px',
            },
            radii: {
              borderRadiusButton: '9999px',
              buttonBorderRadius: '9999px',
              inputBorderRadius: '0.5rem',
            },
          },
        },
        style: {
          button: {
            fontSize: '16px',
            fontWeight: '600',
          },
          input: {
            fontSize: '16px',
          },
          label: {
            fontSize: '14px',
            fontWeight: '500',
          },
        },
      }}
      showLinks={false}
      localization={{
        variables: {
          sign_in: {
            email_label: 'Email address',
            password_label: 'Password',
          },
          sign_up: {
            email_label: 'Email address',
            password_label: 'Create a password',
          },
        },
      }}
      providers={[]}
      socialLayout="hidden"
      onlyThirdPartyProviders={false}
      redirectTo={`${window.location.origin}/auth/callback`}
    />
  )
}