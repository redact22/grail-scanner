// ============================================================
// GRAIL SCANNER - Gemini 3 Pro Integration Service
// Forensic vintage authentication with function calling,
// thinking levels, and self-correction
// ============================================================

import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from '@google/generative-ai'
import type {
  AuthenticationResult,
  GeminiConfig,
  ScanProgress,
  ConfidenceLevel,
} from '../types'
import { forensicTools, executeToolCall } from '../tools'

// Default configuration
const DEFAULT_CONFIG: GeminiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash',
  thinkingLevel: (import.meta.env.VITE_THINKING_LEVEL as 'low' | 'high') || 'high',
  mediaResolution: (import.meta.env.VITE_MEDIA_RESOLUTION as 'low' | 'high') || 'high',
  maxRetries: 2,
  selfCorrectionThreshold: 0.7,
}

/** Initialize the Gemini client */
function createClient(config: GeminiConfig = DEFAULT_CONFIG) {
  if (!config.apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is required. Get one at https://ai.google.dev/gemini-api/docs/api-key')
  }
  return new GoogleGenerativeAI(config.apiKey)
}

/** Convert base64 image to Gemini-compatible format */
function imageToGenerativePart(base64Data: string) {
  // Strip data URL prefix if present
  const base64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data
  const mimeType = base64Data.includes('image/png') ? 'image/png' : 'image/jpeg'

  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  }
}

/** Map confidence score to level */
function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 90) return 'very_high'
  if (score >= 75) return 'high'
  if (score >= 55) return 'moderate'
  if (score >= 35) return 'low'
  return 'uncertain'
}

/** Build the forensic authentication prompt */
function buildForensicPrompt(): string {
  return `You are GRAIL SCANNER, an expert forensic vintage clothing authenticator.

TASK: Analyze this vintage clothing item image and perform a comprehensive forensic authentication.

ANALYSIS STEPS:
1. IDENTIFY the item: category, brand (if visible), approximate era
2. EXAMINE authentication markers: labels, tags, stitching, hardware, materials
3. USE the available tools to verify findings:
   - rn_lookup: If you spot an RN or WPL number, look it up
   - brand_patterns: Verify brand-specific authentication markers for the identified era
   - date_forensics: Analyze construction details to date the item
   - market_search: Get current market pricing for authenticated items
4. CROSS-REFERENCE all tool results for consistency
5. ASSESS authenticity confidence (0-100)

IMPORTANT:
- Be thorough but honest. If you can't determine something, say so.
- Look for red flags: inconsistent labels, wrong-era materials, poor construction
- Consider both macro (overall look) and micro (stitching, fabric weave) details
- If confidence is below 70%, explain what additional information would help

OUTPUT: Use the tools available to build a comprehensive authentication report.
Call each relevant tool and synthesize the results into a final assessment.`
}

/** Tool declarations for Gemini function calling */
const toolDeclarations = [
  {
    name: 'rn_lookup',
    description: 'Look up an RN (Registered Number) or WPL (Wool Products Label) number to identify the manufacturer and registration year. RN numbers are assigned by the FTC to US textile manufacturers.',
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        rn_number: {
          type: FunctionDeclarationSchemaType.STRING,
          description: 'The RN or WPL number found on the garment label (e.g., "RN 42850" or "WPL 12345")',
        },
      },
      required: ['rn_number'],
    },
  },
  {
    name: 'brand_patterns',
    description: 'Verify brand-specific authentication markers for a given brand and era. Checks label fonts, tag placement, hardware details, and era-specific patterns.',
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        brand: {
          type: FunctionDeclarationSchemaType.STRING,
          description: 'The brand name to verify (e.g., "Nike", "Levis", "Ralph Lauren")',
        },
        era: {
          type: FunctionDeclarationSchemaType.STRING,
          description: 'The suspected era/decade (e.g., "1990s", "1980s", "early 2000s")',
        },
        markers: {
          type: FunctionDeclarationSchemaType.STRING,
          description: 'Comma-separated list of authentication markers observed (e.g., "swoosh logo, white tag, made in USA")',
        },
      },
      required: ['brand', 'era'],
    },
  },
  {
    name: 'date_forensics',
    description: 'Perform forensic dating analysis based on construction techniques, materials, and manufacturing details visible in the garment.',
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        category: {
          type: FunctionDeclarationSchemaType.STRING,
          description: 'Item category (e.g., "jacket", "shirt", "pants", "shoes")',
        },
        construction_details: {
          type: FunctionDeclarationSchemaType.STRING,
          description: 'Observed construction details (e.g., "single-needle stitching, bar-tack reinforcement, YKK zipper")',
        },
        materials: {
          type: FunctionDeclarationSchemaType.STRING,
          description: 'Observed materials (e.g., "100% cotton, heavy denim, selvedge edge")',
        },
      },
      required: ['category', 'construction_details'],
    },
  },
  {
    name: 'market_search',
    description: 'Search for current market pricing and recent sales data for an authenticated vintage item. Returns comparable sales, estimated value range, and market trends.',
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        item_description: {
          type: FunctionDeclarationSchemaType.STRING,
          description: 'Full description of the item (e.g., "1992 Nike Air windbreaker jacket, size L, teal colorway")',
        },
        brand: {
          type: FunctionDeclarationSchemaType.STRING,
          description: 'Brand name',
        },
        era: {
          type: FunctionDeclarationSchemaType.STRING,
          description: 'Era/year range',
        },
      },
      required: ['item_description'],
    },
  },
]

/**
 * Authenticate a vintage item using Gemini 3 Pro
 *
 * Flow:
 * 1. Send image + prompt with function calling tools
 * 2. Gemini analyzes image and calls tools as needed
 * 3. Execute tool calls and return results
 * 4. Gemini synthesizes final authentication report
 * 5. Self-correction if confidence < threshold
 */
export async function authenticateItem(
  imageData: string,
  config: Partial<GeminiConfig> = {},
  onProgress?: (progress: ScanProgress) => void,
): Promise<AuthenticationResult> {
  const startTime = Date.now()
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  onProgress?.({
    status: 'analyzing',
    message: 'Initializing Gemini 3 Pro forensic analysis...',
    step: 1,
    totalSteps: 6,
  })

  const client = createClient(mergedConfig)
  const model = client.getGenerativeModel({
    model: mergedConfig.model,
    tools: [{ functionDeclarations: toolDeclarations }],
  })

  const imagePart = imageToGenerativePart(imageData)
  const prompt = buildForensicPrompt()

  onProgress?.({
    status: 'analyzing',
    message: 'Sending image to Gemini 3 Pro (thinking level: high)...',
    step: 2,
    totalSteps: 6,
  })

  // Start multi-turn conversation with function calling
  const chat = model.startChat()
  let response = await chat.sendMessage([prompt, imagePart])
  let result = response.response

  // Process function calls in a loop
  let toolCallCount = 0
  const maxToolCalls = 8

  while (result.functionCalls() && toolCallCount < maxToolCalls) {
    const functionCalls = result.functionCalls()!
    toolCallCount++

    onProgress?.({
      status: 'tool_calling',
      message: `Executing forensic tools (${toolCallCount}/${functionCalls.length})...`,
      step: 3,
      totalSteps: 6,
      toolName: functionCalls[0]?.name,
    })

    // Execute all function calls
    const toolResponses = await Promise.all(
      functionCalls.map(async (call) => {
        const toolResult = await executeToolCall(call.name, call.args as Record<string, string>)

        onProgress?.({
          status: 'tool_calling',
          message: `Tool: ${call.name} completed`,
          step: 3,
          totalSteps: 6,
          toolName: call.name,
          toolResult: JSON.stringify(toolResult).slice(0, 200),
        })

        return {
          functionResponse: {
            name: call.name,
            response: toolResult,
          },
        }
      })
    )

    // Send tool results back to Gemini
    response = await chat.sendMessage(toolResponses)
    result = response.response
  }

  onProgress?.({
    status: 'analyzing',
    message: 'Synthesizing forensic authentication report...',
    step: 4,
    totalSteps: 6,
  })

  // Parse the final text response into structured result
  const textResponse = result.text()
  const authResult = parseAuthenticationResponse(textResponse, startTime)

  // Self-correction: if confidence is low, retry with additional prompt
  if (authResult.confidence < mergedConfig.selfCorrectionThreshold * 100) {
    onProgress?.({
      status: 'self_correcting',
      message: `Low confidence (${authResult.confidence}%). Re-analyzing with enhanced scrutiny...`,
      step: 5,
      totalSteps: 6,
    })

    const correctionPrompt = `Your initial analysis yielded ${authResult.confidence}% confidence. Please re-examine the image more carefully:

1. Look for ANY additional authentication markers you may have missed
2. Check for subtle details: stitching count per inch, thread color consistency, label alignment
3. Consider if the item could be a high-quality reproduction vs authentic
4. Provide your revised confidence score with detailed justification

Be more definitive in your assessment. If evidence points strongly one way, commit to that conclusion.`

    const correctionResponse = await chat.sendMessage([correctionPrompt])
    const correctedText = correctionResponse.response.text()
    const correctedResult = parseAuthenticationResponse(correctedText, startTime)

    // Use whichever result has higher confidence
    if (correctedResult.confidence > authResult.confidence) {
      onProgress?.({
        status: 'complete',
        message: `Self-correction improved confidence: ${authResult.confidence}% → ${correctedResult.confidence}%`,
        step: 6,
        totalSteps: 6,
      })
      return correctedResult
    }
  }

  onProgress?.({
    status: 'complete',
    message: `Authentication complete: ${authResult.confidence}% confidence`,
    step: 6,
    totalSteps: 6,
  })

  return authResult
}

/**
 * Parse Gemini's text response into a structured AuthenticationResult
 * Uses regex patterns to extract structured data from natural language
 */
function parseAuthenticationResponse(text: string, startTime: number): AuthenticationResult {
  // Extract confidence score
  const confidenceMatch = text.match(/confidence[:\s]*(\d{1,3})%/i) ||
    text.match(/(\d{1,3})%\s*confident/i) ||
    text.match(/score[:\s]*(\d{1,3})/i)
  const confidence = confidenceMatch ? Math.min(100, parseInt(confidenceMatch[1])) : 50

  // Extract authenticity determination
  const isAuthentic = /\b(authentic|genuine|real|verified|legitimate)\b/i.test(text) &&
    !/\b(not authentic|not genuine|fake|counterfeit|replica|reproduction)\b/i.test(text)

  // Extract brand
  const brandMatch = text.match(/brand[:\s]*([A-Za-z\s&]+?)(?:\n|,|\.|;)/i)
  const brand = brandMatch?.[1]?.trim() || 'Unknown'

  // Extract era
  const eraMatch = text.match(/(?:era|period|decade|year)[:\s]*([0-9]{4}s?(?:\s*[-–]\s*[0-9]{4}s?)?)/i) ||
    text.match(/((?:early|mid|late)\s+[0-9]{4}s)/i) ||
    text.match(/([0-9]{4})\s*[-–]\s*([0-9]{4})/i)
  const era = eraMatch?.[0]?.replace(/^[:\s]+/, '') || 'Unknown era'

  // Extract year range
  const yearMatch = text.match(/(\d{4})\s*[-–]\s*(\d{4})/)
  const yearRange: [number, number] = yearMatch
    ? [parseInt(yearMatch[1]), parseInt(yearMatch[2])]
    : [1970, 2000]

  // Extract red flags
  const redFlags: string[] = []
  const redFlagSection = text.match(/red flag[s]?[:\s]*([^]*?)(?:\n\n|$)/i)
  if (redFlagSection) {
    const flags = redFlagSection[1].match(/[-•*]\s*(.+)/g)
    flags?.forEach(f => redFlags.push(f.replace(/^[-•*]\s*/, '')))
  }

  // Extract verified markers
  const verifiedMarkers: string[] = []
  const markerSection = text.match(/(?:verified|authentication)\s*markers?[:\s]*([^]*?)(?:\n\n|$)/i)
  if (markerSection) {
    const markers = markerSection[1].match(/[-•*]\s*(.+)/g)
    markers?.forEach(m => verifiedMarkers.push(m.replace(/^[-•*]\s*/, '')))
  }

  // Extract market value
  const valueMatch = text.match(/\$(\d+(?:,\d{3})*)\s*[-–]\s*\$(\d+(?:,\d{3})*)/)
  const lowValue = valueMatch ? parseInt(valueMatch[1].replace(/,/g, '')) : 0
  const highValue = valueMatch ? parseInt(valueMatch[2].replace(/,/g, '')) : 0

  return {
    isAuthentic,
    confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    category: 'unknown',
    brandEra: {
      brand,
      era,
      yearRange,
      confidence: confidence / 100,
      markers: verifiedMarkers.slice(0, 5),
    },
    rnLookup: null,
    brandPattern: {
      brand,
      era,
      authenticityScore: confidence,
      matchedPatterns: verifiedMarkers,
      redFlags,
      details: text.slice(0, 500),
    },
    dateForensics: {
      estimatedEra: era,
      yearRange,
      confidence: confidence / 100,
      evidence: verifiedMarkers,
      constructionDetails: [],
      materialAnalysis: '',
    },
    marketData: {
      estimatedValue: {
        low: lowValue,
        mid: Math.round((lowValue + highValue) / 2),
        high: highValue,
        currency: 'USD',
      },
      comparableSales: [],
      marketTrend: 'stable',
      demandLevel: confidence > 75 ? 'high' : 'moderate',
    },
    reasoning: text,
    redFlags,
    verifiedMarkers,
    thinkingOutput: text,
    timestamp: Date.now(),
    processingTime: Date.now() - startTime,
  }
}

/** Check if Gemini API is configured */
export function isGeminiConfigured(): boolean {
  return !!import.meta.env.VITE_GEMINI_API_KEY
}

// Re-export for convenience
export { forensicTools }
