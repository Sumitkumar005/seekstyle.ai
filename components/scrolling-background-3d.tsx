"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import * as THREE from "three"

function AnimatedTorus() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.z += 0.01
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[10, 3, 16, 100]} />
      <meshStandardMaterial color="#8b5cf6" />
    </mesh>
  )
}

function ScrollingMoon() {
  const meshRef = useRef<THREE.Mesh>(null)
  const moonTexture = useLoader(TextureLoader, "/textures/moon.jpg")
  const normalTexture = useLoader(TextureLoader, "/textures/normal.jpg")

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.075
      meshRef.current.rotation.z += 0.05

      // Scroll-based movement
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      meshRef.current.position.z = 30 + scrollTop * -0.01
      meshRef.current.position.x = -10 + scrollTop * -0.0002
    }
  })

  return (
    <mesh ref={meshRef} position={[-10, 0, 30]}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshStandardMaterial map={moonTexture} normalMap={normalTexture} />
    </mesh>
  )
}

function ScrollingCube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.z += 0.01

      // Scroll-based movement
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      meshRef.current.position.z = -5 + scrollTop * -0.005
      meshRef.current.position.x = 2 + scrollTop * -0.0001
    }
  })

  return (
    <mesh ref={meshRef} position={[2, 0, -5]}>
      <boxGeometry args={[3, 3, 3]} />
      <meshBasicMaterial color="#ec4899" />
    </mesh>
  )
}

function Stars() {
  const starsRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005
    }
  })

  const starPositions = Array(200)
    .fill(null)
    .map(() => [
      THREE.MathUtils.randFloatSpread(100),
      THREE.MathUtils.randFloatSpread(100),
      THREE.MathUtils.randFloatSpread(100),
    ])

  return (
    <group ref={starsRef}>
      {starPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  )
}

function ScrollCamera() {
  useFrame(({ camera }) => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    camera.position.z = 30 + scrollTop * -0.01
    camera.position.x = -3 + scrollTop * -0.0002
    camera.rotation.y = scrollTop * -0.0002
  })

  return null
}

export function ScrollingBackground3D() {
  const [isMounted, setIsMounted] = useState(false)
  const spaceTexture = useLoader(TextureLoader, "/textures/space.jpg")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [-3, 0, 30], fov: 75 }}
        style={{
          background: `url(${spaceTexture.image?.src || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />

        <AnimatedTorus />
        <ScrollingMoon />
        <ScrollingCube />
        <Stars />

        <ScrollCamera />
      </Canvas>
    </div>
  )
}
