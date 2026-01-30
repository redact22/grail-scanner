import { motion } from 'framer-motion'
import type { AuthenticationResult, ScanProgress } from '../types'

interface AuthenticationReportProps {
  result: AuthenticationResult | null
  progress: ScanProgress | null
  scanning: boolean
}

export function AuthenticationReport({ result, progress, scanning }: AuthenticationReportProps) {
  if (scanning && progress) {
    return <ScanProgressDisplay progress={progress} />
  }

  if (!result) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-8 space-y-4"
    >
      {/* Header Card */}
      <div className={`glass-morphism rounded-2xl p-6 border-2 ${
        result.isAuthentic ? 'border-green-400/50' : 'border-red-400/50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Authentication Report</h2>
          <div className={`px-4 py-1 rounded-full text-sm font-bold ${
            result.isAuthentic
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {result.isAuthentic ? 'AUTHENTIC' : 'SUSPECT'}
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Confidence</span>
            <span className={`font-bold ${getConfidenceColor(result.confidence)}`}>
              {result.confidence}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-3 rounded-full ${getConfidenceBarColor(result.confidence)}`}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Brand</div>
            <div className="text-white font-semibold text-sm">{result.brandEra.brand}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Era</div>
            <div className="text-white font-semibold text-sm">{result.brandEra.era}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Value</div>
            <div className="text-white font-semibold text-sm">
              ${result.marketData.estimatedValue.low} - ${result.marketData.estimatedValue.high}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Pattern Analysis */}
      <div className="glass-morphism rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">Brand Verification</h3>

        {result.brandPattern.matchedPatterns.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm text-green-400 mb-2">Verified Markers</h4>
            <div className="flex flex-wrap gap-2">
              {result.brandPattern.matchedPatterns.map((pattern, i) => (
                <span key={i} className="bg-green-500/10 text-green-300 px-3 py-1 rounded-full text-xs">
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.redFlags.length > 0 && (
          <div>
            <h4 className="text-sm text-red-400 mb-2">Red Flags</h4>
            <div className="flex flex-wrap gap-2">
              {result.redFlags.map((flag, i) => (
                <span key={i} className="bg-red-500/10 text-red-300 px-3 py-1 rounded-full text-xs">
                  {flag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RN Lookup */}
      {result.rnLookup && (
        <div className="glass-morphism rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">RN/WPL Lookup</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">RN Number: </span>
              <span className="text-white font-mono">{result.rnLookup.rnNumber}</span>
            </div>
            <div>
              <span className="text-gray-400">Company: </span>
              <span className="text-white">{result.rnLookup.companyName}</span>
            </div>
            <div>
              <span className="text-gray-400">Registered: </span>
              <span className="text-white">{result.rnLookup.registrationYear || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-gray-400">Formula Year: </span>
              <span className="text-white">{result.rnLookup.calculatedYear || 'N/A'}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 font-mono">
            {result.rnLookup.formula}
          </div>
        </div>
      )}

      {/* Date Forensics */}
      <div className="glass-morphism rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">Date Forensics</h3>
        <div className="mb-3">
          <span className="text-gray-400 text-sm">Estimated Era: </span>
          <span className="text-white font-semibold">{result.dateForensics.estimatedEra}</span>
          <span className="text-gray-400 text-sm ml-2">
            ({result.dateForensics.yearRange[0]} - {result.dateForensics.yearRange[1]})
          </span>
        </div>
        {result.dateForensics.evidence.length > 0 && (
          <div>
            <h4 className="text-sm text-gray-400 mb-2">Evidence</h4>
            <ul className="space-y-1">
              {result.dateForensics.evidence.map((evidence, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start">
                  <span className="text-cyan-400 mr-2">*</span>
                  {evidence}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Market Intelligence */}
      <div className="glass-morphism rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">Market Intelligence</h3>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">Low</div>
            <div className="text-green-400 font-bold">${result.marketData.estimatedValue.low}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center border border-cyan-400/30">
            <div className="text-xs text-gray-400">Estimated</div>
            <div className="text-cyan-400 font-bold text-lg">${result.marketData.estimatedValue.mid}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">High</div>
            <div className="text-green-400 font-bold">${result.marketData.estimatedValue.high}</div>
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-gray-400">Trend: </span>
            <span className={`font-semibold ${
              result.marketData.marketTrend === 'rising' ? 'text-green-400' :
              result.marketData.marketTrend === 'declining' ? 'text-red-400' : 'text-gray-300'
            }`}>
              {result.marketData.marketTrend === 'rising' ? '↑' : result.marketData.marketTrend === 'declining' ? '↓' : '→'}
              {' '}{result.marketData.marketTrend}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Demand: </span>
            <span className="text-white font-semibold">{result.marketData.demandLevel}</span>
          </div>
        </div>

        {result.marketData.comparableSales.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm text-gray-400 mb-2">Comparable Sales</h4>
            <div className="space-y-2">
              {result.marketData.comparableSales.map((sale, i) => (
                <div key={i} className="flex justify-between items-center text-xs bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-gray-300 truncate mr-2">{sale.platform}</span>
                  <span className="text-gray-400">{sale.condition}</span>
                  <span className="text-green-400 font-bold">${sale.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Processing Info */}
      <div className="text-center text-xs text-gray-500 pb-8">
        Processed in {(result.processingTime / 1000).toFixed(1)}s | {new Date(result.timestamp).toLocaleString()}
      </div>
    </motion.div>
  )
}

function ScanProgressDisplay({ progress }: { progress: ScanProgress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Forensic Analysis</h3>
          <span className="text-sm text-cyan-400 font-mono">
            Step {progress.step}/{progress.totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(progress.step / progress.totalSteps) * 100}%` }}
            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
          />
        </div>

        {/* Current status */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"
          />
          <span className="text-gray-300 text-sm">{progress.message}</span>
        </div>

        {/* Tool call info */}
        {progress.toolName && (
          <div className="bg-white/5 rounded-lg p-3 mt-3">
            <div className="text-xs text-gray-400 mb-1">Active Tool</div>
            <div className="text-cyan-400 font-mono text-sm">{progress.toolName}</div>
            {progress.toolResult && (
              <div className="text-xs text-gray-500 mt-1 font-mono truncate">
                {progress.toolResult}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'text-green-400'
  if (confidence >= 75) return 'text-green-300'
  if (confidence >= 55) return 'text-yellow-400'
  if (confidence >= 35) return 'text-orange-400'
  return 'text-red-400'
}

function getConfidenceBarColor(confidence: number): string {
  if (confidence >= 90) return 'bg-green-500'
  if (confidence >= 75) return 'bg-green-400'
  if (confidence >= 55) return 'bg-yellow-500'
  if (confidence >= 35) return 'bg-orange-500'
  return 'bg-red-500'
}
