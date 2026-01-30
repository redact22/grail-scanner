import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { ScanProgress } from '../types'

interface ScanOverlayProps {
  visible: boolean
  progress?: ScanProgress | null
}

export function ScanOverlay({ visible, progress }: ScanOverlayProps) {
  const [statusIndex, setStatusIndex] = useState(0)

  // Cycle through forensic status messages
  useEffect(() => {
    if (!visible) {
      setStatusIndex(0)
      return
    }

    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % FORENSIC_STATUSES.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [visible])

  if (!visible) return null

  const currentStatus = progress?.message || FORENSIC_STATUSES[statusIndex]
  const stepProgress = progress
    ? (progress.step / progress.totalSteps) * 100
    : undefined

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 pointer-events-none z-10"
      >
        {/* Animated grid lines */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Horizontal scanning lines */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
              style={{ top: `${(i / 11) * 100}%` }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}

          {/* Vertical scanning lines */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-400/30 to-transparent"
              style={{ left: `${(i / 11) * 100}%` }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1 + 0.5,
              }}
            />
          ))}

          {/* Sweeping scan line */}
          <motion.div
            className="absolute left-0 right-0 h-1"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(34,211,238,0.8), transparent)',
              boxShadow: '0 0 20px rgba(34,211,238,0.6), 0 0 40px rgba(34,211,238,0.4)',
            }}
            animate={{
              top: ['0%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        {/* Corner targeting brackets */}
        <div className="absolute inset-0 p-4">
          {/* Top-left bracket */}
          <motion.div
            className="absolute top-4 left-4"
            animate={{
              opacity: [1, 0.5, 1],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <svg width="48" height="48" className="text-cyan-400">
              <path
                d="M 8 0 L 0 0 L 0 8 M 0 0 L 8 0"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              />
              <path
                d="M 0 0 L 0 8 M 0 0 L 8 0"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="drop-shadow-[0_0_12px_rgba(34,211,238,1)]"
              />
            </svg>
          </motion.div>

          {/* Top-right bracket */}
          <motion.div
            className="absolute top-4 right-4"
            animate={{
              opacity: [1, 0.5, 1],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.2,
            }}
          >
            <svg width="48" height="48" className="text-cyan-400">
              <path
                d="M 40 0 L 48 0 L 48 8"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              />
              <path
                d="M 40 0 L 48 0 L 48 8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="drop-shadow-[0_0_12px_rgba(34,211,238,1)]"
              />
            </svg>
          </motion.div>

          {/* Bottom-left bracket */}
          <motion.div
            className="absolute bottom-4 left-4"
            animate={{
              opacity: [1, 0.5, 1],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.4,
            }}
          >
            <svg width="48" height="48" className="text-cyan-400">
              <path
                d="M 0 40 L 0 48 L 8 48"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              />
              <path
                d="M 0 40 L 0 48 L 8 48"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="drop-shadow-[0_0_12px_rgba(34,211,238,1)]"
              />
            </svg>
          </motion.div>

          {/* Bottom-right bracket */}
          <motion.div
            className="absolute bottom-4 right-4"
            animate={{
              opacity: [1, 0.5, 1],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.6,
            }}
          >
            <svg width="48" height="48" className="text-cyan-400">
              <path
                d="M 48 40 L 48 48 L 40 48"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              />
              <path
                d="M 48 40 L 48 48 L 40 48"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="drop-shadow-[0_0_12px_rgba(34,211,238,1)]"
              />
            </svg>
          </motion.div>
        </div>

        {/* Outer glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow:
              'inset 0 0 60px rgba(34,211,238,0.2), inset 0 0 40px rgba(168,85,247,0.15)',
          }}
          animate={{
            boxShadow: [
              'inset 0 0 60px rgba(34,211,238,0.2), inset 0 0 40px rgba(168,85,247,0.15)',
              'inset 0 0 80px rgba(34,211,238,0.3), inset 0 0 60px rgba(168,85,247,0.25)',
              'inset 0 0 60px rgba(34,211,238,0.2), inset 0 0 40px rgba(168,85,247,0.15)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Status text container */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.div
            className="glass-morphism rounded-xl p-4 border border-cyan-400/30"
            animate={{
              borderColor: [
                'rgba(34,211,238,0.3)',
                'rgba(34,211,238,0.6)',
                'rgba(34,211,238,0.3)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            {/* Progress bar */}
            {stepProgress !== undefined && (
              <div className="w-full bg-gray-700/50 rounded-full h-1 mb-3">
                <motion.div
                  className="h-1 rounded-full scan-glow"
                  style={{
                    background:
                      'linear-gradient(90deg, #22d3ee 0%, #a855f7 100%)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stepProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Status text */}
            <motion.div
              key={currentStatus}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center justify-center gap-3"
            >
              {/* Animated spinner */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
              />

              <span className="text-cyan-400 font-mono text-sm md:text-base font-semibold tracking-wide">
                {currentStatus}
              </span>

              {/* Blinking cursor */}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                className="text-cyan-400 text-lg"
              >
                _
              </motion.span>
            </motion.div>

            {/* Tool name if available */}
            {progress?.toolName && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-purple-400 text-xs font-mono text-center mt-2"
              >
                Tool: {progress.toolName}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Particle effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -20, -40],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Cycling forensic status messages
const FORENSIC_STATUSES = [
  'SCANNING TEXTILE WEAVE PATTERNS...',
  'ANALYZING BRAND AUTHENTICATION MARKERS...',
  'CROSS-REFERENCING RN/WPL DATABASE...',
  'DETECTING CONSTRUCTION ANOMALIES...',
  'MEASURING STITCH DENSITY...',
  'VERIFYING HARDWARE SIGNATURES...',
  'DATING FABRIC COMPOSITION...',
  'QUERYING MARKET INTELLIGENCE...',
  'RUNNING SELF-CORRECTION LOOP...',
  'CALCULATING CONFIDENCE SCORE...',
]
