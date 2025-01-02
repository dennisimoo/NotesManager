import { supabase } from '../supabaseClient'

declare global {
  interface Window {
    google: any
  }
}

export const initializeGoogleAuth = (callback: (response: any) => void) => {
  if (!supabase.auth) return

  const script = document.createElement("script")
  script.src = "https://accounts.google.com/gsi/client"
  script.async = true
  script.defer = true
  script.onload = () => {
    window.google?.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback,
    })
    window.google?.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "filled_blue", size: "large", shape: "pill" }
    )
  }
  document.body.appendChild(script)

  return () => {
    document.body.removeChild(script)
  }
}

export const handleGoogleSignIn = async (response: any) => {
  if (!supabase.auth) return null

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
  })

  if (error) throw error
  return data
}