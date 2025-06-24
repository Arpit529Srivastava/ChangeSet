'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ThreeScene from '@/components/ThreeScene'

export default function Home() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResponse('')

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      })

      const data = await res.json()
      
      if (res.ok) {
        setResponse('Email sent successfully!')
        setEmail('')
        setMessage('')
      } else {
        setResponse(`Error: ${data.error}`)
      }
    } catch (error) {
      setResponse('Error: Failed to send email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ThreeScene />
      <main className="min-h-screen relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-4 animate-float">
              ChangeSet Demo
            </h1>
            <p className="text-xl text-gray-200 animate-float-delayed">
              Send emails with our enhanced Go backend service
            </p>
          </motion.div>

          <motion.div 
            className="glass-effect rounded-2xl shadow-2xl p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-white placeholder-gray-300 backdrop-blur-sm"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-white placeholder-gray-300 backdrop-blur-sm resize-none"
                  placeholder="Enter your message"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Email'
                )}
              </motion.button>
            </form>

            {response && (
              <motion.div 
                className={`mt-6 p-4 rounded-lg ${
                  response.includes('Error') 
                    ? 'bg-red-500/20 text-red-200 border border-red-400/30' 
                    : 'bg-green-500/20 text-green-200 border border-green-400/30'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {response}
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="mt-8 text-center text-sm text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="mb-2">This demo uses Next.js frontend with enhanced Go backend</p>
            <p>Powered by ChangeSet for version management</p>
            <p className="mt-2 text-xs text-gray-400">Featuring Three.js 3D background</p>
          </motion.div>
        </div>
      </main>
    </>
  )
} 