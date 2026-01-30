import { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'

function App() {
  const [scanning, setScanning] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            GRAIL SCANNER
          </h1>
          <p className="text-xl text-gray-300">
            Forensic Vintage Authentication Powered by Gemini 3 Pro
          </p>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-morphism rounded-3xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Point. Scan. Authenticate.
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Transform your phone into a forensic authentication lab.
              GRAIL SCANNER uses Gemini 3's multimodal reasoning to date vintage items,
              verify authenticity markers, and estimate market value - no expertise required.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-4xl mb-2">📸</div>
                <h3 className="font-semibold text-white mb-1">Capture</h3>
                <p className="text-sm text-gray-400">
                  Point camera at vintage item
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-4xl mb-2">🔬</div>
                <h3 className="font-semibold text-white mb-1">Analyze</h3>
                <p className="text-sm text-gray-400">
                  AI forensic investigation
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="font-semibold text-white mb-1">Verify</h3>
                <p className="text-sm text-gray-400">
                  Authentication report card
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScanning(!scanning)}
              className="w-full scan-gradient text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              {scanning ? 'Stop Scanning' : 'Start Scanning'}
            </motion.button>
          </div>

          {/* Features */}
          <div className="glass-morphism rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              Powered by Gemini 3 Pro
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-white">Deep Forensic Reasoning</h4>
                  <p className="text-sm text-gray-400">
                    Multi-step authentication with thinking level: high
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-white">Fine-Grained Vision</h4>
                  <p className="text-sm text-gray-400">
                    Textile weave patterns via media resolution: high
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-white">Function Calling Tools</h4>
                  <p className="text-sm text-gray-400">
                    RN lookup, brand patterns, era dating forensics
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-white">Real-Time Market Intel</h4>
                  <p className="text-sm text-gray-400">
                    Google Search grounding with structured output
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 text-gray-400"
        >
          <p>Built for Gemini 3 Hackathon 2026</p>
          <p className="text-sm mt-2">
            Democratizing years of expertise through AI-powered forensic analysis
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default App
