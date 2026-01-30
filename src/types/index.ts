// ============================================================
// GRAIL SCANNER - Type Definitions
// Forensic Vintage Authentication powered by Gemini 3 Pro
// ============================================================

/** Authentication confidence level */
export type ConfidenceLevel = 'very_high' | 'high' | 'moderate' | 'low' | 'uncertain'

/** Item category for authentication */
export type ItemCategory =
  | 'jacket'
  | 'shirt'
  | 'pants'
  | 'dress'
  | 'shoes'
  | 'bag'
  | 'accessory'
  | 'hat'
  | 'outerwear'
  | 'sportswear'
  | 'denim'
  | 'unknown'

/** Brand era identification */
export interface BrandEra {
  brand: string
  era: string
  yearRange: [number, number]
  confidence: number
  markers: string[]
}

/** RN/WPL lookup result */
export interface RNLookupResult {
  rnNumber: string
  companyName: string
  registrationYear: number | null
  calculatedYear: number | null
  status: 'active' | 'inactive' | 'not_found'
  formula: string
}

/** Brand pattern verification */
export interface BrandPatternResult {
  brand: string
  era: string
  authenticityScore: number
  matchedPatterns: string[]
  redFlags: string[]
  details: string
}

/** Date forensics result */
export interface DateForensicsResult {
  estimatedEra: string
  yearRange: [number, number]
  confidence: number
  evidence: string[]
  constructionDetails: string[]
  materialAnalysis: string
}

/** Market search result */
export interface MarketSearchResult {
  estimatedValue: {
    low: number
    mid: number
    high: number
    currency: string
  }
  comparableSales: Array<{
    title: string
    price: number
    platform: string
    date: string
    condition: string
  }>
  marketTrend: 'rising' | 'stable' | 'declining'
  demandLevel: 'very_high' | 'high' | 'moderate' | 'low'
}

/** Complete authentication result */
export interface AuthenticationResult {
  /** Overall authentication status */
  isAuthentic: boolean
  /** Confidence score 0-100 */
  confidence: number
  /** Confidence level label */
  confidenceLevel: ConfidenceLevel
  /** Item category detected */
  category: ItemCategory

  /** Brand and era identification */
  brandEra: BrandEra

  /** RN/WPL lookup (if found) */
  rnLookup: RNLookupResult | null

  /** Brand pattern verification */
  brandPattern: BrandPatternResult

  /** Date forensics analysis */
  dateForensics: DateForensicsResult

  /** Market pricing intelligence */
  marketData: MarketSearchResult

  /** Gemini reasoning summary */
  reasoning: string

  /** Red flags found */
  redFlags: string[]

  /** Authentication markers verified */
  verifiedMarkers: string[]

  /** Raw thinking output from Gemini */
  thinkingOutput?: string

  /** Timestamp */
  timestamp: number

  /** Processing time in ms */
  processingTime: number
}

/** Scan state machine */
export type ScanStatus =
  | 'idle'
  | 'capturing'
  | 'uploading'
  | 'analyzing'
  | 'tool_calling'
  | 'self_correcting'
  | 'complete'
  | 'error'

/** Scan progress update */
export interface ScanProgress {
  status: ScanStatus
  message: string
  step: number
  totalSteps: number
  toolName?: string
  toolResult?: string
}

/** Tool call definition for Gemini function calling */
export interface ToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown>
}

/** Gemini API configuration */
export interface GeminiConfig {
  apiKey: string
  model: string
  thinkingLevel: 'low' | 'high'
  mediaResolution: 'low' | 'high'
  maxRetries: number
  selfCorrectionThreshold: number
}

/** Demo item for simulation fallback */
export interface DemoItem {
  id: string
  name: string
  description: string
  imageUrl: string
  expectedResult: AuthenticationResult
}
