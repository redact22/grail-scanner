import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CameraCapture } from './components/CameraCapture'
import { AuthenticationReport } from './components/AuthenticationReport'
import { DemoMode } from './components/DemoMode'
import { authenticateItem, isGeminiConfigured } from './services/gemini'
import type { AuthenticationResult, ScanProgress } from './types'
import './App.css'

type AppView = 'home' | 'scanner' | 'results'

function App() {
  const [view, setView] = useState<AppView>('home')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<AuthenticationResult | null>(null)
  const [progress, setProgress] = useState<ScanProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDemo, setShowDemo] = useState(false)
  const [isDemoResult, setIsDemoResult] = useState(false)

  const handleCapture = useCallback(async (imageData: string) => {
    setScanning(true)
    setError(null)
    setResult(null)
    setIsDemoResult(false)

    try {
      const authResult = await authenticateItem(imageData, {}, setProgress)
      setResult(authResult)
      setView('results')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      setError(message)
    } finally {
      setScanning(false)
      setProgress(null)
    }
  }, [])

  const handleStartScan = useCallback(() => {
    setView('scanner')
    setResult(null)
    setError(null)
    setIsDemoResult(false)
  }, [])

  const handleBackHome = useCallback(() => {
    setView('home')
    setResult(null)
    setScanning(false)
    setProgress(null)
    setError(null)
    setIsDemoResult(false)
  }, [])

  const handleDemoSelect = useCallback((demoResult: AuthenticationResult) => {
    setResult(demoResult)
    setIsDemoResult(true)
    setShowDemo(false)
    setView('results')
  }, [])

  const handleShareResult = useCallback(async () => {
    if (!result) return

    const shareText = [
      `GRAIL SCANNER - Authentication Report`,
      ``,
      `Status: ${result.isAuthentic ? 'AUTHENTIC' : 'SUSPECT'}`,
      `Confidence: ${result.confidence}%`,
      `Brand: ${result.brandEra.brand}`,
      `Era: ${result.brandEra.era} (${result.brandEra.yearRange[0]}-${result.brandEra.yearRange[1]})`,
      `Estimated Value: $${result.marketData.estimatedValue.low} - $${result.marketData.estimatedValue.high}`,
      ``,
      result.verifiedMarkers.length > 0
        ? `Verified: ${result.verifiedMarkers.join(', ')}`
        : '',
      result.redFlags.length > 0
        ? `Red Flags: ${result.redFlags.join(', ')}`
        : '',
      ``,
      `Scanned with GRAIL SCANNER - AI forensic authentication`,
    ].filter(Boolean).join('\n')

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GRAIL SCANNER Report',
          text: shareText,
        })
      } catch {
        // User cancelled or share failed - fall back to clipboard
        await copyToClipboard(shareText)
      }
    } else {
      await copyToClipboard(shareText)
    }
  }, [result])

  const configured = isGeminiConfigured()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <button onClick={handleBackHome} className="inline-block">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              GRAIL SCANNER
            </h1>
          </button>
          <p className="text-lg text-gray-300">
            Forensic Vintage Authentication Powered by Gemini 3 Pro
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* HOME VIEW */}
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-morphism rounded-3xl p-6 md:p-8 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Point. Scan. Authenticate.
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  Transform your phone into a forensic authentication lab.
                  GRAIL SCANNER uses Gemini 3's multimodal reasoning to date vintage items,
                  verify authenticity markers, and estimate market value — no expertise required.
                </p>

                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
                  <div className="bg-white/5 rounded-lg p-3 md:p-4 text-center">
                    <div className="text-3xl md:text-4xl mb-2">📸</div>
                    <h3 className="font-semibold text-white text-sm md:text-base mb-1">Capture</h3>
                    <p className="text-xs md:text-sm text-gray-400">
                      Point camera at item
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 md:p-4 text-center">
                    <div className="text-3xl md:text-4xl mb-2">🔬</div>
                    <h3 className="font-semibold text-white text-sm md:text-base mb-1">Analyze</h3>
                    <p className="text-xs md:text-sm text-gray-400">
                      AI forensic scan
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 md:p-4 text-center">
                    <div className="text-3xl md:text-4xl mb-2">✅</div>
                    <h3 className="font-semibold text-white text-sm md:text-base mb-1">Verify</h3>
                    <p className="text-xs md:text-sm text-gray-400">
                      Authentication report
                    </p>
                  </div>
                </div>

                {!configured && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                    <p className="text-yellow-300 text-sm">
                      <strong>Setup Required:</strong> Copy <code className="bg-white/10 px-1 rounded">.env.example</code> to <code className="bg-white/10 px-1 rounded">.env</code> and add your Gemini API key.
                      <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                        Get a free key
                      </a>
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStartScan}
                    className="flex-1 scan-gradient text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Start Scanning
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowDemo(true)}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors border border-white/20"
                  >
                    Demo
                  </motion.button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="glass-morphism rounded-3xl p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
                  Powered by 7+ Gemini 3 Features
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {FEATURES.map((feature) => (
                    <div key={feature.title} className="flex items-start space-x-3">
                      <span className="text-green-400 text-xl mt-0.5">✓</span>
                      <div>
                        <h4 className="font-semibold text-white">{feature.title}</h4>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SCANNER VIEW */}
          {view === 'scanner' && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={handleBackHome}
                className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
              >
                ← Back
              </button>

              <CameraCapture
                onCapture={handleCapture}
                onError={(err) => setError(err)}
                scanning={scanning}
                progress={progress}
              />

              {/* Progress Display */}
              {scanning && progress && (
                <AuthenticationReport result={null} progress={progress} scanning={true} />
              )}

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center"
                >
                  <p className="text-red-300">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-300 text-sm mt-2 underline"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* RESULTS VIEW */}
          {view === 'results' && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handleBackHome}
                  className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                  ← New Scan
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleShareResult}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    title="Share result"
                  >
                    Share
                  </button>
                  <button
                    onClick={handleStartScan}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Scan Again
                  </button>
                </div>
              </div>

              {isDemoResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 text-center"
                >
                  <p className="text-purple-300 text-sm">
                    Demo result — scan a real item with your camera for live Gemini 3 analysis
                  </p>
                </motion.div>
              )}

              <AuthenticationReport result={result} progress={null} scanning={false} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo Mode Modal */}
        <AnimatePresence>
          {showDemo && (
            <DemoMode
              onSelectDemo={handleDemoSelect}
              onClose={() => setShowDemo(false)}
            />
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 text-gray-500"
        >
          <p className="text-sm">Built for Gemini 3 Hackathon 2026</p>
          <p className="text-xs mt-1">
            Democratizing expertise through AI-powered forensic analysis
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/** Copy text to clipboard with fallback */
async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

const FEATURES = [
  {
    title: 'Deep Forensic Reasoning',
    description: 'Multi-step authentication with thinking level: high',
  },
  {
    title: 'Fine-Grained Vision',
    description: 'Textile weave patterns via media resolution: high',
  },
  {
    title: 'Function Calling (4 Tools)',
    description: 'RN lookup, brand patterns, date forensics, market search',
  },
  {
    title: 'Real-Time Market Intel',
    description: 'Google Search grounding for live pricing data',
  },
  {
    title: 'Self-Correction Loop',
    description: 'Re-analyzes on low confidence using thought signatures',
  },
  {
    title: 'Structured Output',
    description: 'Type-safe JSON authentication reports',
  },
]

export default App
