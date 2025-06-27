'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function ThreeBackground() {
  const ref = useRef<THREE.Points>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [time, setTime] = useState(0)
  const { camera } = useThree()
  
  const count = 8000
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    return positions
  }, [])

  // Mouse interaction
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state) => {
    setTime(state.clock.elapsedTime)
    
    if (ref.current) {
      // Smooth rotation based on time
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
      
      // Interactive rotation based on mouse position
      ref.current.rotation.x += mousePosition.y * 0.01
      ref.current.rotation.y += mousePosition.x * 0.01
      
      // Subtle position animation
      ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.5
      ref.current.position.y = Math.cos(state.clock.elapsedTime * 0.03) * 0.3
    }
  })

  // Dynamic color based on time
  const getDynamicColor = () => {
    const hue = (time * 10) % 360
    return `hsl(${hue}, 70%, 80%)`
  }

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={getDynamicColor()}
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
} 