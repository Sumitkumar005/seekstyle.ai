"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Float, Environment } from "@react-three/drei"
import { Sparkles, TrendingUp } from "lucide-react"

function FloatingText({ text, position, color = "#8b5cf6" }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        ref={meshRef}
        position={position}
        fontSize={0.5}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {text}
      </Text>
    </Float>
  )
}

function TrendingSphere() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1)
    }
  })

  return (
    <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={hovered ? "#ec4899" : "#8b5cf6"} wireframe transparent opacity={0.6} />
    </mesh>
  )
}

function ParticleField() {
  const pointsRef = useRef()
  const particleCount = 100

  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#8b5cf6" transparent opacity={0.6} />
    </points>
  )
}

export function TrendingHero3D() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="relative h-[60vh] bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Trending Styles</h1>
          <p className="text-xl text-muted-foreground">Discover what's hot in fashion</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[60vh] bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 overflow-hidden">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Environment preset="sunset" />

        <TrendingSphere />
        <ParticleField />

        <FloatingText text="TRENDING" position={[-2, 1, 0]} />
        <FloatingText text="VIRAL" position={[2, -1, 0]} color="#ec4899" />
        <FloatingText text="HOT" position={[0, 2, -1]} color="#f59e0b" />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
            <TrendingUp className="w-4 h-4" />
            Live Trending Data
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 font-playfair">
            What's <span className="text-gradient">Trending</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the hottest fashion trends, viral products, and emerging aesthetics powered by real-time data
          </p>
        </motion.div>
      </div>
    </div>
  )
}
