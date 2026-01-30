// ============================================================
// GRAIL SCANNER - Forensic Authentication Tools
// Function calling tools for Gemini 3 Pro
// ============================================================

import type {
  RNLookupResult,
  BrandPatternResult,
  DateForensicsResult,
  MarketSearchResult,
} from '../types'

// ============================================================
// Tool 1: RN/WPL Lookup
// ============================================================

/** RN Dating Formula: (RN - 13670) / 2635 + 1959 */
function calculateRNYear(rnNumber: number): number | null {
  if (rnNumber < 13670) return null // Pre-formula series
  return Math.round((rnNumber - 13670) / 2635 + 1959)
}

/** Known RN database (subset for demo) */
const RN_DATABASE: Record<string, { company: string; year?: number }> = {
  '42850': { company: 'Nike Inc.', year: 1970 },
  '55531': { company: 'Gap Inc.', year: 1975 },
  '73277': { company: 'Levi Strauss & Co.', year: 1982 },
  '73909': { company: 'Ralph Lauren Corporation', year: 1982 },
  '77388': { company: 'Tommy Hilfiger', year: 1984 },
  '91518': { company: 'The North Face', year: 1989 },
  '101243': { company: 'Patagonia Inc.', year: 1992 },
  '114798': { company: 'Carhartt Inc.', year: 1997 },
  '56002': { company: "Levi's (alternate)", year: 1975 },
  '41381': { company: 'Pendleton Woolen Mills', year: 1969 },
  '15763': { company: 'L.L.Bean Inc.', year: 1960 },
  '26094': { company: 'Fruit of the Loom', year: 1964 },
}

function rnLookup(args: Record<string, string>): RNLookupResult {
  const rawNumber = args.rn_number || ''
  const cleaned = rawNumber.replace(/[^0-9]/g, '')
  const rnNum = parseInt(cleaned)

  if (isNaN(rnNum)) {
    return {
      rnNumber: rawNumber,
      companyName: 'Invalid RN number',
      registrationYear: null,
      calculatedYear: null,
      status: 'not_found',
      formula: 'N/A',
    }
  }

  const knownEntry = RN_DATABASE[cleaned]
  const calculatedYear = calculateRNYear(rnNum)

  return {
    rnNumber: `RN ${cleaned}`,
    companyName: knownEntry?.company || `Unknown (RN ${cleaned})`,
    registrationYear: knownEntry?.year || null,
    calculatedYear,
    status: knownEntry ? 'active' : (calculatedYear ? 'active' : 'not_found'),
    formula: `(${rnNum} - 13670) / 2635 + 1959 = ${calculatedYear || 'N/A'}`,
  }
}

// ============================================================
// Tool 2: Brand Pattern Verification
// ============================================================

interface BrandPatternDB {
  eras: Record<string, {
    patterns: string[]
    redFlags: string[]
    details: string
  }>
}

const BRAND_PATTERNS: Record<string, BrandPatternDB> = {
  nike: {
    eras: {
      '1970s': {
        patterns: ['Block letter NIKE logo', 'Made in Japan/Taiwan', 'Waffle outsole', 'Simple swoosh'],
        redFlags: ['Modern swoosh design', 'Made in China/Vietnam', 'Moisture-wicking materials'],
        details: 'Early Nike featured block letters and Japanese manufacturing. The swoosh was thinner and simpler.',
      },
      '1980s': {
        patterns: ['Grey tag', 'Silver/grey label', 'Made in Taiwan/Korea', 'Block font', 'Pin tag on collar'],
        redFlags: ['White label', 'Modern barcode format', 'Dri-FIT branding'],
        details: 'The Grey Tag era (1980-87) is highly collectible. Look for silver/grey woven labels.',
      },
      '1990s': {
        patterns: ['White tag', 'White label', 'Made in USA possible', 'Embroidered swoosh', 'Mini swoosh'],
        redFlags: ['Grey tag (too early)', 'Modern hang tag design', 'Flex/React branding'],
        details: 'White Tag era (1988-1998). Highly sought after. Mini swoosh and center swoosh are valuable.',
      },
      '2000s': {
        patterns: ['Size tag on inside', 'Modern hang tag', 'Tech fabric labels', 'Barcode tag'],
        redFlags: ['Missing care labels', 'Incorrect font spacing', 'Poor swoosh proportions'],
        details: 'Modern era Nike. Look for consistent label formatting and proper material composition tags.',
      },
    },
  },
  levis: {
    eras: {
      '1960s': {
        patterns: ['Big E (LEVI\'S)', 'Single-stitch hems', 'Redline selvedge', 'Paper patch'],
        redFlags: ['Lowercase e', 'Chain stitch hems', 'Modern rivets'],
        details: 'Big E era uses capital E in LEVI\'S. Extremely valuable. Check for selvedge denim.',
      },
      '1970s': {
        patterns: ['Small e (Levi\'s)', 'Orange tab possible', 'Care tag with numbers', 'Chain stitch hems'],
        redFlags: ['Big E (too early)', 'Modern leather patch', 'Stretch denim'],
        details: 'Transition from Big E to small e happened ~1971. Orange tab indicates non-501 line.',
      },
      '1980s': {
        patterns: ['Red tab small e', 'Leather patch', 'Made in USA', 'Cone Mills denim possible'],
        redFlags: ['Paper patch', 'Non-US manufacture', 'Modern button styles'],
        details: 'Made in USA era. Look for quality denim weight and Cone Mills fabric.',
      },
      '1990s': {
        patterns: ['Red tab small e', 'Various global manufacture', 'Silver tab line', 'Baggy/loose cuts'],
        redFlags: ['Incorrect tab placement', 'Poor rivet quality', 'Wrong pocket arc pattern'],
        details: 'Diverse manufacturing era. Silver Tab line is collectible. Check pocket arcs carefully.',
      },
    },
  },
  'ralph lauren': {
    eras: {
      '1980s': {
        patterns: ['Polo player logo', 'Made in USA', 'Single-needle construction', 'Button-down collar'],
        redFlags: ['Modern tag design', 'Made in Sri Lanka/China', 'Missing country of origin'],
        details: 'Golden era Ralph Lauren. Made in USA with premium construction. Look for single-needle stitching.',
      },
      '1990s': {
        patterns: ['Polo Sport line', 'Hi-Tech collection', 'Snow Beach', 'Stadium 1992'],
        redFlags: ['Incorrect flag design', 'Wrong font for era', 'Poor embroidery quality'],
        details: 'Highly collectible era. Polo Sport, Snow Beach, and Stadium 1992 command premium prices.',
      },
    },
  },
}

function brandPatterns(args: Record<string, string>): BrandPatternResult {
  const brand = (args.brand || '').toLowerCase().trim()
  const era = (args.era || '').trim()
  const observedMarkers = (args.markers || '').split(',').map(m => m.trim()).filter(Boolean)

  const brandData = BRAND_PATTERNS[brand]
  if (!brandData) {
    return {
      brand: args.brand || 'Unknown',
      era,
      authenticityScore: 50,
      matchedPatterns: [],
      redFlags: ['Brand not in database - manual verification required'],
      details: `Brand "${args.brand}" not found in forensic database. Manual authentication recommended.`,
    }
  }

  // Find closest era match
  const eraKeys = Object.keys(brandData.eras)
  const matchedEra = eraKeys.find(k => era.includes(k.replace('s', ''))) || eraKeys[eraKeys.length - 1]
  const eraData = brandData.eras[matchedEra]

  // Score based on pattern matching
  const matchedPatterns: string[] = []
  const redFlags: string[] = []

  eraData.patterns.forEach(pattern => {
    const patternLower = pattern.toLowerCase()
    if (observedMarkers.some(m => m.toLowerCase().includes(patternLower.slice(0, 10)))) {
      matchedPatterns.push(pattern)
    }
  })

  eraData.redFlags.forEach(flag => {
    const flagLower = flag.toLowerCase()
    if (observedMarkers.some(m => m.toLowerCase().includes(flagLower.slice(0, 10)))) {
      redFlags.push(flag)
    }
  })

  const patternScore = eraData.patterns.length > 0
    ? (matchedPatterns.length / eraData.patterns.length) * 100
    : 50
  const redFlagPenalty = redFlags.length * 15
  const authenticityScore = Math.max(0, Math.min(100, Math.round(patternScore - redFlagPenalty)))

  return {
    brand: args.brand || 'Unknown',
    era: matchedEra,
    authenticityScore,
    matchedPatterns: matchedPatterns.length > 0 ? matchedPatterns : eraData.patterns,
    redFlags: redFlags.length > 0 ? redFlags : [],
    details: eraData.details,
  }
}

// ============================================================
// Tool 3: Date Forensics
// ============================================================

interface ConstructionMarker {
  feature: string
  eraRange: [number, number]
  confidence: number
}

const CONSTRUCTION_MARKERS: ConstructionMarker[] = [
  { feature: 'single-needle', eraRange: [1950, 1990], confidence: 0.7 },
  { feature: 'chain stitch', eraRange: [1950, 1985], confidence: 0.8 },
  { feature: 'selvedge', eraRange: [1920, 1985], confidence: 0.85 },
  { feature: 'union label', eraRange: [1955, 1995], confidence: 0.9 },
  { feature: 'made in usa', eraRange: [1940, 2000], confidence: 0.6 },
  { feature: 'made in japan', eraRange: [1960, 1990], confidence: 0.7 },
  { feature: 'made in china', eraRange: [1985, 2026], confidence: 0.5 },
  { feature: 'ykk zipper', eraRange: [1960, 2026], confidence: 0.4 },
  { feature: 'talon zipper', eraRange: [1930, 1990], confidence: 0.85 },
  { feature: 'coats & clark', eraRange: [1950, 2010], confidence: 0.6 },
  { feature: 'bar tack', eraRange: [1960, 2026], confidence: 0.3 },
  { feature: 'rolled hem', eraRange: [1940, 1980], confidence: 0.75 },
  { feature: 'triple stitch', eraRange: [1970, 2026], confidence: 0.4 },
  { feature: 'polyester', eraRange: [1960, 2026], confidence: 0.3 },
  { feature: 'nylon', eraRange: [1940, 2026], confidence: 0.2 },
  { feature: 'rayon', eraRange: [1920, 2026], confidence: 0.3 },
  { feature: 'care label', eraRange: [1971, 2026], confidence: 0.8 },
  { feature: 'no care label', eraRange: [1920, 1971], confidence: 0.9 },
]

function dateForensics(args: Record<string, string>): DateForensicsResult {
  const details = (args.construction_details || '').toLowerCase()
  const materials = (args.materials || '').toLowerCase()
  const combined = `${details} ${materials}`

  const matchedMarkers: ConstructionMarker[] = []

  CONSTRUCTION_MARKERS.forEach(marker => {
    if (combined.includes(marker.feature)) {
      matchedMarkers.push(marker)
    }
  })

  if (matchedMarkers.length === 0) {
    return {
      estimatedEra: 'Undetermined',
      yearRange: [1960, 2020],
      confidence: 0.3,
      evidence: ['No specific construction markers identified'],
      constructionDetails: [details],
      materialAnalysis: materials || 'Not specified',
    }
  }

  // Calculate weighted year range
  let totalWeight = 0
  let weightedStart = 0
  let weightedEnd = 0

  matchedMarkers.forEach(marker => {
    totalWeight += marker.confidence
    weightedStart += marker.eraRange[0] * marker.confidence
    weightedEnd += marker.eraRange[1] * marker.confidence
  })

  const avgStart = Math.round(weightedStart / totalWeight)
  const avgEnd = Math.round(weightedEnd / totalWeight)

  // Narrow the range based on overlap
  const overlapStart = Math.max(...matchedMarkers.map(m => m.eraRange[0]))
  const overlapEnd = Math.min(...matchedMarkers.map(m => m.eraRange[1]))

  const finalStart = overlapStart <= overlapEnd ? overlapStart : avgStart
  const finalEnd = overlapStart <= overlapEnd ? overlapEnd : avgEnd

  const avgConfidence = totalWeight / matchedMarkers.length
  const decade = Math.floor(finalStart / 10) * 10

  return {
    estimatedEra: `${decade}s - ${Math.floor(finalEnd / 10) * 10}s`,
    yearRange: [finalStart, finalEnd],
    confidence: Math.min(0.95, avgConfidence + matchedMarkers.length * 0.05),
    evidence: matchedMarkers.map(m => `${m.feature}: ${m.eraRange[0]}-${m.eraRange[1]} (${Math.round(m.confidence * 100)}% confidence)`),
    constructionDetails: details.split(',').map(d => d.trim()).filter(Boolean),
    materialAnalysis: materials || 'Not specified',
  }
}

// ============================================================
// Tool 4: Market Search
// ============================================================

function marketSearch(args: Record<string, string>): MarketSearchResult {
  const description = args.item_description || ''
  const brand = (args.brand || '').toLowerCase()
  const era = args.era || ''

  // Simulated market data (in production, this would use Google Search grounding)
  const baseValues: Record<string, { low: number; high: number }> = {
    nike: { low: 80, high: 450 },
    levis: { low: 60, high: 800 },
    'ralph lauren': { low: 50, high: 600 },
    'the north face': { low: 70, high: 350 },
    patagonia: { low: 60, high: 300 },
    carhartt: { low: 40, high: 250 },
    champion: { low: 40, high: 200 },
    stussy: { low: 80, high: 500 },
    supreme: { low: 100, high: 2000 },
    default: { low: 30, high: 200 },
  }

  const brandValues = baseValues[brand] || baseValues.default

  // Adjust for era desirability
  let eraMultiplier = 1.0
  if (era.includes('1970') || era.includes('1980')) eraMultiplier = 1.8
  else if (era.includes('1990')) eraMultiplier = 1.4
  else if (era.includes('2000')) eraMultiplier = 0.8

  const low = Math.round(brandValues.low * eraMultiplier)
  const high = Math.round(brandValues.high * eraMultiplier)
  const mid = Math.round((low + high) / 2)

  return {
    estimatedValue: { low, mid, high, currency: 'USD' },
    comparableSales: [
      {
        title: `${description} - Similar condition`,
        price: mid + Math.round(Math.random() * 50 - 25),
        platform: 'eBay',
        date: '2026-01-15',
        condition: 'Good',
      },
      {
        title: `${description} - Excellent condition`,
        price: high - Math.round(Math.random() * 50),
        platform: 'Grailed',
        date: '2026-01-10',
        condition: 'Excellent',
      },
      {
        title: `${description} - Fair condition`,
        price: low + Math.round(Math.random() * 30),
        platform: 'Depop',
        date: '2025-12-28',
        condition: 'Fair',
      },
    ],
    marketTrend: eraMultiplier > 1.2 ? 'rising' : 'stable',
    demandLevel: eraMultiplier > 1.5 ? 'very_high' : eraMultiplier > 1.0 ? 'high' : 'moderate',
  }
}

// ============================================================
// Tool Router
// ============================================================

type ToolResult = RNLookupResult | BrandPatternResult | DateForensicsResult | MarketSearchResult

const TOOL_MAP: Record<string, (args: Record<string, string>) => ToolResult> = {
  rn_lookup: rnLookup,
  brand_patterns: brandPatterns,
  date_forensics: dateForensics,
  market_search: marketSearch,
}

/** Execute a tool call by name */
export async function executeToolCall(
  toolName: string,
  args: Record<string, string>,
): Promise<ToolResult> {
  const tool = TOOL_MAP[toolName]
  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`)
  }
  return tool(args)
}

/** Get all available forensic tools */
export const forensicTools = Object.keys(TOOL_MAP)
