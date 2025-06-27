'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface StatusIndicatorProps {
  status: 'healthy' | 'unhealthy' | 'checking' | 'unreachable'
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function StatusIndicator({ 
  status, 
  label, 
  size = 'md' 
}: StatusIndicatorProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusConfig = () => {
    switch (status) {
      case 'healthy':
        return {
          color: 'green',
          bgClass: 'bg-green-500/20',
          textClass: 'text-green-200',
          dotClass: 'bg-green-400',
          icon: '🟢'
        }
      case 'unhealthy':
        return {
          color: 'red',
          bgClass: 'bg-red-500/20',
          textClass: 'text-red-200',
          dotClass: 'bg-red-400',
          icon: '🔴'
        }
      case 'checking':
        return {
          color: 'yellow',
          bgClass: 'bg-yellow-500/20',
          textClass: 'text-yellow-200',
          dotClass: 'bg-yellow-400',
          icon: '🟡'
        }
      case 'unreachable':
        return {
          color: 'gray',
          bgClass: 'bg-gray-500/20',
          textClass: 'text-gray-200',
          dotClass: 'bg-gray-400',
          icon: '⚫'
        }
      default:
        return {
          color: 'gray',
          bgClass: 'bg-gray-500/20',
          textClass: 'text-gray-200',
          dotClass: 'bg-gray-400',
          icon: '⚫'
        }
    }
  }

  const config = getStatusConfig()
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <motion.div
      className={`inline-flex items-center rounded-full font-medium ${config.bgClass} ${config.textClass} ${sizeClasses[size]}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`w-2 h-2 rounded-full mr-2 ${config.dotClass}`}></div>
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
      <span className="ml-2 text-xs opacity-75">
        {currentTime.toLocaleTimeString()}
      </span>
    </motion.div>
  )
} 