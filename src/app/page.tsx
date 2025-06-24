'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ThreeScene from '@/components/ThreeScene'
import StatusIndicator from '@/components/StatusIndicator'

interface BackendStats {
  total_emails_sent: number
  successful_emails: number
  failed_emails: number
  uptime: string
}

export default function Home() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [backendStats, setBackendStats] = useState<BackendStats | null>(null)
  const [backendHealth, setBackendHealth] = useState<string>('checking')

  // Fetch backend health and stats on component mount
  useEffect(() => {
    const fetchBackendInfo = async () => {
      const goBackendUrl = process.env.NEXT_PUBLIC_GO_BACKEND_URL || 'http://localhost:8080'
      
      try {
        // Check health
        const healthRes = await fetch(`${goBackendUrl}/health`)
        if (healthRes.ok) {
          setBackendHealth('healthy')
        } else {
          setBackendHealth('unhealthy')
        }

        // Get stats
        const statsRes = await fetch(`${goBackendUrl}/stats`)
        if (statsRes.ok) {
          const stats = await statsRes.json()
          setBackendStats(stats)
        }
      } catch (error) {
        setBackendHealth('unreachable')
        console.error('Failed to fetch backend info:', error)
      }
    }

    fetchBackendInfo()
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchBackendInfo, 30000)
    return () => clearInterval(interval)
  }, [])

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
        // Refresh stats after successful email
        const goBackendUrl = process.env.NEXT_PUBLIC_GO_BACKEND_URL || 'http://localhost:8080'
        const statsRes = await fetch(`${goBackendUrl}/stats`)
        if (statsRes.ok) {
          const stats = await statsRes.json()
          setBackendStats(stats)
        }
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
        <div className="max-w-4xl mx-auto">
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

          {/* Backend Status Dashboard */}
          <motion.div 
            className="glass-effect rounded-2xl shadow-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Backend Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <StatusIndicator status={backendHealth as any} />
              </div>
              {backendStats && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{backendStats.total_emails_sent}</div>
                    <div className="text-sm text-gray-300">Total Emails</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{backendStats.uptime}</div>
                    <div className="text-sm text-gray-300">Uptime</div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Email Form */}
            <motion.div 
              className="glass-effect rounded-2xl shadow-2xl p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Send Email</h2>
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
                  disabled={isLoading || backendHealth !== 'healthy'}
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

            {/* Email Statistics */}
            {backendStats && (
              <motion.div 
                className="glass-effect rounded-2xl shadow-2xl p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Email Statistics</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Successful Emails:</span>
                    <span className="text-green-400 font-bold">{backendStats.successful_emails}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Failed Emails:</span>
                    <span className="text-red-400 font-bold">{backendStats.failed_emails}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Success Rate:</span>
                    <span className="text-blue-400 font-bold">
                      {backendStats.total_emails_sent > 0 
                        ? `${((backendStats.successful_emails / backendStats.total_emails_sent) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="pt-4 border-t border-white/20">
                    <div className="text-sm text-gray-400">
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <motion.div 
            className="mt-8 text-center text-sm text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="mb-2">This demo uses Next.js frontend with enhanced Go backend</p>
            <p>Powered by ChangeSet for version management</p>
            <p className="mt-2 text-xs text-gray-400">Featuring Three.js 3D background and real-time backend monitoring</p>
          </motion.div>
        </div>
      </main>
    </>
  )
} 