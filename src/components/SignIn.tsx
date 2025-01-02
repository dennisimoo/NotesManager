import React, { useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { User, NotebookPen } from 'lucide-react'
import { initializeGoogleAuth, handleGoogleSignIn } from '../auth/googleAuth'
import Button from './ui/Button'
import Card from './ui/Card'

interface SignInProps {
  onSignIn: (isGuest: boolean) => void
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  useEffect(() => {
    if (supabase.auth) {
      const cleanup = initializeGoogleAuth(async (response) => {
        try {
          await handleGoogleSignIn(response)
          onSignIn(false)
        } catch (error: any) {
          console.error('Google sign in error:', error.message)
        }
      })
      return cleanup
    }
  }, [onSignIn])

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <NotebookPen size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to Notes
          </h1>
          <p className="text-gray-400 text-lg">
            Your thoughts, organized beautifully
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => onSignIn(true)}
            className="w-full"
            size="lg"
            icon={<User className="h-5 w-5" />}
          >
            Continue as Guest
          </Button>

          {supabase.auth && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-800/50 text-gray-400">
                    or continue with
                  </span>
                </div>
              </div>

              <div id="googleSignInDiv" className="flex justify-center"></div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

export default SignIn