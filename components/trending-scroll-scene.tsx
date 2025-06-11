"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { Stars } from "@react-three/drei"

function TrendingTorus() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.z += 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusGeometry args={[10, 3, 16, 100]} />
      <meshStandardMaterial color="#8b5cf6" />
    </mesh>
  )
}

function FashionSphere() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.01

      // Scroll-based movement
      const scrollY = window.scrollY
      meshRef.current.position.z = 30 + scrollY * -0.01
      meshRef.current.position.x = -10 + scrollY * -0.0002
    }
  })

  const moonTexture = useLoader(TextureLoader, "/textures/moon.jpg")
  const normalTexture = useLoader(TextureLoader, "/textures/normal.jpg")

  return (
    <mesh ref={meshRef} position={[-10, 0, 30]}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshStandardMaterial map={moonTexture} normalMap={normalTexture} color="#ec4899" />
    </mesh>
  )
}

function TrendingCube() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.z += 0.01

      // Scroll-based movement
      const scrollY = window.scrollY
      meshRef.current.position.z = -5 + scrollY * -0.005
      meshRef.current.position.x = 2 + scrollY * -0.0001
    }
  })

  return (
    <mesh ref={meshRef} position={[2, 0, -5]}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="#06b6d4" />
    </mesh>
  )
}

function ScrollCamera() {
  const { camera } = useFrame((state) => {
    const scrollY = window.scrollY
    camera.position.z = 30 + scrollY * -0.01
    camera.position.x = -3 + scrollY * -0.0002
    camera.rotation.y = scrollY * -0.0002
  })

  return null
}

function ParticleStars() {
  const starsRef = useRef()

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

export function TrendingScrollScene() {
  const [isMounted, setIsMounted] = useState(false)
  const spaceTexture = useLoader(TextureLoader, "/textures/space.jpg")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black -z-10" />
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [-3, 0, 30], fov: 75 }} style={{ background: `url(${spaceTexture})` }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />

        <TrendingTorus />
        <FashionSphere />
        <TrendingCube />
        <ParticleStars />

        <ScrollCamera />
      </Canvas>
    </div>
  )
}
