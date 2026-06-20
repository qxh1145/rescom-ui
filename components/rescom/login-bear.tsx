'use client'

import { useEffect, useRef, useState } from 'react'

/* ─── Spring Physics ─────────────────────────────────────────── */
interface SpringValue {
  current: number
  velocity: number
  target: number
}

const STIFFNESS = 0.08
const DAMPING = 0.78

function tickSpring(s: SpringValue) {
  const force = (s.target - s.current) * STIFFNESS
  s.velocity = (s.velocity + force) * DAMPING
  s.current += s.velocity
}

/* ─── Component ──────────────────────────────────────────────── */
interface LoginBearProps {
  isPasswordFocused: boolean
  isEmailFocused: boolean
  emailLength: number
}

export function LoginBear({
  isPasswordFocused,
  isEmailFocused,
  emailLength,
}: LoginBearProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [isSurprised, setIsSurprised] = useState(false)

  // Direct-manipulation refs (no re-renders for eye tracking)
  const leftPupilRef = useRef<SVGCircleElement>(null)
  const rightPupilRef = useRef<SVGCircleElement>(null)
  const leftShineRef = useRef<SVGCircleElement>(null)
  const rightShineRef = useRef<SVGCircleElement>(null)
  const headGroupRef = useRef<SVGGElement>(null)
  const bearContainerRef = useRef<SVGGElement>(null)

  // Persistent spring state
  const springs = useRef({
    eyeX: { current: 0, velocity: 0, target: 0 } as SpringValue,
    eyeY: { current: 0, velocity: 0, target: 0 } as SpringValue,
    headRot: { current: 0, velocity: 0, target: 0 } as SpringValue,
  })
  const breathPhase = useRef(0)
  const frameRef = useRef<number>(0)

  /* ── Update spring targets when props change ───────────────── */
  useEffect(() => {
    const s = springs.current
    if (isPasswordFocused) {
      s.eyeX.target = 0
      s.eyeY.target = 4
      s.headRot.target = 0
    } else if (isEmailFocused) {
      const maxChars = 24
      const fraction = Math.min(emailLength, maxChars) / maxChars
      s.eyeX.target = (fraction * 2 - 1) * 7
      s.eyeY.target = 2.5
      s.headRot.target = (fraction * 2 - 1) * 4
    } else {
      s.eyeX.target = 0
      s.eyeY.target = 0
      s.headRot.target = 0
    }
  }, [isPasswordFocused, isEmailFocused, emailLength])

  /* ── Surprise micro-expression on password focus ───────────── */
  useEffect(() => {
    if (isPasswordFocused) {
      setIsSurprised(true)
      const t = setTimeout(() => setIsSurprised(false), 250)
      return () => clearTimeout(t)
    }
    setIsSurprised(false)
  }, [isPasswordFocused])

  /* ── Random blink timer (with occasional double-blink) ────── */
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>

    const scheduleBlink = () => {
      const delay = 2500 + Math.random() * 3500
      timerId = setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)

        if (Math.random() > 0.7) {
          setTimeout(() => {
            setIsBlinking(true)
            setTimeout(() => setIsBlinking(false), 150)
          }, 300)
        }

        scheduleBlink()
      }, delay)
    }

    scheduleBlink()
    return () => clearTimeout(timerId)
  }, [])

  /* ── Main 60 fps animation loop (rAF) ─────────────────────── */
  useEffect(() => {
    const animate = () => {
      const s = springs.current

      tickSpring(s.eyeX)
      tickSpring(s.eyeY)
      tickSpring(s.headRot)

      breathPhase.current += 0.025
      const bY = Math.sin(breathPhase.current) * 1.2

      leftPupilRef.current?.style.setProperty(
        'transform',
        `translate(${s.eyeX.current}px, ${s.eyeY.current}px)`,
      )
      rightPupilRef.current?.style.setProperty(
        'transform',
        `translate(${s.eyeX.current}px, ${s.eyeY.current}px)`,
      )

      leftShineRef.current?.style.setProperty(
        'transform',
        `translate(${s.eyeX.current * 0.35}px, ${s.eyeY.current * 0.35}px)`,
      )
      rightShineRef.current?.style.setProperty(
        'transform',
        `translate(${s.eyeX.current * 0.35}px, ${s.eyeY.current * 0.35}px)`,
      )

      if (headGroupRef.current) {
        headGroupRef.current.style.transform = `rotate(${s.headRot.current}deg)`
        headGroupRef.current.style.transformOrigin = '140px 100px'
      }

      if (bearContainerRef.current) {
        bearContainerRef.current.style.transform = `translateY(${bY}px)`
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  /* ── Helpers ───────────────────────────────────────────────── */
  const eyeScale = isBlinking ? 0.08 : isSurprised ? 1.15 : 1

  const eyeGroupStyle = (cx: number, cy: number): React.CSSProperties => ({
    transformOrigin: `${cx}px ${cy}px`,
    transform: `scaleY(${eyeScale})`,
    transition: 'transform 100ms ease-in-out',
  })

  const pawBaseStyle = (isRight: boolean): React.CSSProperties => ({
    transform: `translateY(${isPasswordFocused ? 0 : 100}px)`,
    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transitionDelay: isPasswordFocused && isRight ? '0.06s' : '0s',
  })

  /* ── SVG ───────────────────────────────────────────────────── */
  return (
    <svg
      viewBox="0 0 280 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto select-none pointer-events-none"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        {/* Clip the paws so they hide behind the body when at rest */}
        <clipPath id="bear-paw-clip">
          <rect x="0" y="0" width="280" height="162" />
        </clipPath>

        {/* Fur gradient - main body */}
        <radialGradient id="fur-main" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#D4956A" />
          <stop offset="50%" stopColor="#C68642" />
          <stop offset="100%" stopColor="#A86E2D" />
        </radialGradient>

        {/* Fur gradient - head */}
        <radialGradient id="fur-head" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#D9A05C" />
          <stop offset="45%" stopColor="#C68642" />
          <stop offset="100%" stopColor="#B0732E" />
        </radialGradient>

        {/* Muzzle gradient */}
        <radialGradient id="muzzle-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F5E0C4" />
          <stop offset="100%" stopColor="#E8C5A0" />
        </radialGradient>

        {/* Belly gradient */}
        <radialGradient id="belly-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F2D9B8" />
          <stop offset="100%" stopColor="#E2C09A" />
        </radialGradient>

        {/* Inner ear gradient */}
        <radialGradient id="ear-inner" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#E8A88A" />
          <stop offset="100%" stopColor="#D4956A" />
        </radialGradient>

        {/* Nose gradient */}
        <radialGradient id="bear-nose" cx="38%" cy="28%" r="55%">
          <stop offset="0%" stopColor="#5A4030" />
          <stop offset="100%" stopColor="#2D1B0E" />
        </radialGradient>

        {/* Paw pad gradient */}
        <radialGradient id="paw-pad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#E8A88A" />
          <stop offset="100%" stopColor="#D08060" />
        </radialGradient>

        {/* Subtle shadow */}
        <radialGradient id="bear-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Eye white gradient */}
        <radialGradient id="eye-white" cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F0F0" />
        </radialGradient>

        {/* Leaf on head */}
        <linearGradient id="leaf-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5DB85D" />
          <stop offset="100%" stopColor="#3A8C3A" />
        </linearGradient>
      </defs>

      <g ref={bearContainerRef}>
        {/* ── Shadow ──────────────────────────────────────── */}
        <ellipse cx="140" cy="208" rx="58" ry="6" fill="url(#bear-shadow)" />

        {/* ── Body ────────────────────────────────────────── */}
        <ellipse cx="140" cy="194" rx="72" ry="40" fill="url(#fur-main)" />
        {/* Belly */}
        <ellipse cx="140" cy="192" rx="46" ry="28" fill="url(#belly-grad)" />
        {/* Belly fur detail lines */}
        <path d="M125 182 Q128 178 131 182" fill="none" stroke="#D4A86A" strokeWidth="0.8" opacity="0.4" />
        <path d="M137 179 Q140 175 143 179" fill="none" stroke="#D4A86A" strokeWidth="0.8" opacity="0.4" />
        <path d="M149 182 Q152 178 155 182" fill="none" stroke="#D4A86A" strokeWidth="0.8" opacity="0.4" />

        {/* ── Head group (tilts with eye-tracking) ────────── */}
        <g ref={headGroupRef}>
          {/* Ears - outer with fur edge detail */}
          <circle cx="78" cy="42" r="26" fill="url(#fur-head)" />
          <circle cx="78" cy="42" r="15" fill="url(#ear-inner)" />
          {/* Ear fur tufts left */}
          <path d="M62 32 Q58 26 64 28" fill="#C68642" stroke="#B0732E" strokeWidth="0.5" />
          <path d="M66 28 Q63 22 68 24" fill="#C68642" stroke="#B0732E" strokeWidth="0.5" />

          <circle cx="202" cy="42" r="26" fill="url(#fur-head)" />
          <circle cx="202" cy="42" r="15" fill="url(#ear-inner)" />
          {/* Ear fur tufts right */}
          <path d="M218 32 Q222 26 216 28" fill="#C68642" stroke="#B0732E" strokeWidth="0.5" />
          <path d="M214 28 Q217 22 212 24" fill="#C68642" stroke="#B0732E" strokeWidth="0.5" />

          {/* Head */}
          <circle cx="140" cy="96" r="67" fill="url(#fur-head)" />

          {/* Forehead fur texture */}
          <path d="M118 62 Q122 58 126 62" fill="none" stroke="#B87A3A" strokeWidth="0.7" opacity="0.3" />
          <path d="M134 58 Q138 54 142 58" fill="none" stroke="#B87A3A" strokeWidth="0.7" opacity="0.3" />
          <path d="M150 60 Q154 56 158 60" fill="none" stroke="#B87A3A" strokeWidth="0.7" opacity="0.3" />

          {/* Cheek fur puffs */}
          <ellipse cx="76" cy="100" rx="10" ry="7" fill="#C68642" opacity="0.5" />
          <ellipse cx="204" cy="100" rx="10" ry="7" fill="#C68642" opacity="0.5" />

          {/* Muzzle */}
          <ellipse cx="140" cy="113" rx="40" ry="30" fill="url(#muzzle-grad)" />

          {/* Blush */}
          <circle cx="88" cy="108" r="12" fill="rgba(255,130,130,0.22)" />
          <circle cx="192" cy="108" r="12" fill="rgba(255,130,130,0.22)" />

          {/* ── Eyebrows ─────────────────────────── */}
          <path
            d="M98 72 Q106 66 118 72"
            fill="none"
            stroke="#8B5E34"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{
              transform: isEmailFocused ? 'translateY(-2px)' : isPasswordFocused ? 'translateY(1px)' : 'none',
              transition: 'transform 300ms ease',
            }}
          />
          <path
            d="M162 72 Q174 66 182 72"
            fill="none"
            stroke="#8B5E34"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{
              transform: isEmailFocused ? 'translateY(-2px)' : isPasswordFocused ? 'translateY(1px)' : 'none',
              transition: 'transform 300ms ease',
            }}
          />

          {/* ── Left eye ─────────────────────────── */}
          <g style={eyeGroupStyle(112, 88)}>
            {/* Eye shadow */}
            <ellipse cx="112" cy="90" rx="13" ry="15" fill="rgba(0,0,0,0.04)" />
            {/* Eye white */}
            <ellipse cx="112" cy="88" rx="12" ry="14" fill="url(#eye-white)" stroke="#C8A882" strokeWidth="0.5" />
            {/* Iris */}
            <circle
              ref={leftPupilRef}
              cx="112"
              cy="88"
              r="7"
              fill="#3D2B1F"
              style={{ willChange: 'transform' }}
            />
            {/* Inner iris detail */}
            <circle cx="112" cy="88" r="4" fill="#2A1A0F" style={{ pointerEvents: 'none' }} />
            {/* Main shine */}
            <circle
              ref={leftShineRef}
              cx="109"
              cy="84"
              r="3"
              fill="white"
              opacity="0.92"
              style={{ willChange: 'transform' }}
            />
            {/* Small secondary shine */}
            <circle cx="115" cy="92" r="1.5" fill="white" opacity="0.5" />
          </g>

          {/* ── Right eye ────────────────────────── */}
          <g style={eyeGroupStyle(168, 88)}>
            <ellipse cx="168" cy="90" rx="13" ry="15" fill="rgba(0,0,0,0.04)" />
            <ellipse cx="168" cy="88" rx="12" ry="14" fill="url(#eye-white)" stroke="#C8A882" strokeWidth="0.5" />
            <circle
              ref={rightPupilRef}
              cx="168"
              cy="88"
              r="7"
              fill="#3D2B1F"
              style={{ willChange: 'transform' }}
            />
            <circle cx="168" cy="88" r="4" fill="#2A1A0F" style={{ pointerEvents: 'none' }} />
            <circle
              ref={rightShineRef}
              cx="165"
              cy="84"
              r="3"
              fill="white"
              opacity="0.92"
              style={{ willChange: 'transform' }}
            />
            <circle cx="171" cy="92" r="1.5" fill="white" opacity="0.5" />
          </g>

          {/* Nose */}
          <ellipse cx="140" cy="108" rx="8" ry="6" fill="url(#bear-nose)" />
          {/* Nose highlight */}
          <ellipse cx="137" cy="106" rx="3" ry="2" fill="white" opacity="0.22" />
          {/* Nostril hints */}
          <circle cx="137" cy="110" r="1.2" fill="#1A0F06" opacity="0.3" />
          <circle cx="143" cy="110" r="1.2" fill="#1A0F06" opacity="0.3" />

          {/* Mouth – normal smile */}
          <path
            d="M130 118 Q135 124 140 120 Q145 124 150 118"
            fill="none"
            stroke="#3D2B1F"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              opacity: isPasswordFocused ? 0 : 1,
              transition: 'opacity 250ms ease',
            }}
          />

          {/* Mouth – shy / nervous wiggle */}
          <path
            d="M128 120 Q133 117 138 120 Q142 123 146 120 Q150 117 154 120"
            fill="none"
            stroke="#3D2B1F"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{
              opacity: isPasswordFocused ? 1 : 0,
              transition: 'opacity 250ms ease',
            }}
          />

          {/* Whisker dots */}
          <circle cx="96" cy="112" r="1" fill="#8B5E34" opacity="0.35" />
          <circle cx="92" cy="108" r="1" fill="#8B5E34" opacity="0.35" />
          <circle cx="94" cy="116" r="1" fill="#8B5E34" opacity="0.35" />
          <circle cx="184" cy="112" r="1" fill="#8B5E34" opacity="0.35" />
          <circle cx="188" cy="108" r="1" fill="#8B5E34" opacity="0.35" />
          <circle cx="186" cy="116" r="1" fill="#8B5E34" opacity="0.35" />

          {/* ── Leaf accessory on head ────────────── */}
          <g style={{ transform: 'rotate(-15deg)', transformOrigin: '162px 38px' }}>
            {/* Stem */}
            <path d="M162 48 Q164 40 160 32" fill="none" stroke="#4A8C3A" strokeWidth="1.5" strokeLinecap="round" />
            {/* Leaf shape */}
            <path
              d="M160 32 Q152 26 156 18 Q162 22 168 16 Q166 26 160 32Z"
              fill="url(#leaf-green)"
              stroke="#3A7A2E"
              strokeWidth="0.6"
            />
            {/* Leaf vein */}
            <path d="M160 31 Q160 25 162 20" fill="none" stroke="#3A7A2E" strokeWidth="0.5" opacity="0.5" />
          </g>
        </g>

        {/* ── Paws (clipped → emerge from body) ───────────── */}
        <g clipPath="url(#bear-paw-clip)">
          {/* Left paw */}
          <g style={pawBaseStyle(false)}>
            <rect
              x="82"
              y="70"
              width="44"
              height="34"
              rx="15"
              fill="url(#fur-main)"
              stroke="#A86E2D"
              strokeWidth="0.8"
            />
            {/* Paw pads */}
            <ellipse cx="104" cy="91" rx="12" ry="7" fill="url(#paw-pad)" />
            <circle cx="92" cy="78" r="5" fill="url(#paw-pad)" />
            <circle cx="104" cy="75" r="5" fill="url(#paw-pad)" />
            <circle cx="116" cy="78" r="5" fill="url(#paw-pad)" />
            {/* Pad detail lines */}
            <ellipse cx="104" cy="91" rx="6" ry="3.5" fill="none" stroke="#C07050" strokeWidth="0.5" opacity="0.4" />
          </g>

          {/* Right paw */}
          <g style={pawBaseStyle(true)}>
            <rect
              x="154"
              y="70"
              width="44"
              height="34"
              rx="15"
              fill="url(#fur-main)"
              stroke="#A86E2D"
              strokeWidth="0.8"
            />
            <ellipse cx="176" cy="91" rx="12" ry="7" fill="url(#paw-pad)" />
            <circle cx="164" cy="78" r="5" fill="url(#paw-pad)" />
            <circle cx="176" cy="75" r="5" fill="url(#paw-pad)" />
            <circle cx="188" cy="78" r="5" fill="url(#paw-pad)" />
            <ellipse cx="176" cy="91" rx="6" ry="3.5" fill="none" stroke="#C07050" strokeWidth="0.5" opacity="0.4" />
          </g>
        </g>
      </g>
    </svg>
  )
}
