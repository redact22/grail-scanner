import { motion } from 'framer-motion'
import type { AuthenticationResult } from '../types'

interface DemoModeProps {
  onSelectDemo: (result: AuthenticationResult) => void
  onClose: () => void
}

export function DemoMode({ onSelectDemo, onClose }: DemoModeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-morphism rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Demo Gallery</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-300 mb-6">
          Explore pre-authenticated vintage items. Perfect for demos or when no API key is configured.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {DEMO_ITEMS.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectDemo(item.expectedResult)}
              className="glass-morphism rounded-xl p-4 text-left hover:border-cyan-400/50 transition-all"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-3 flex items-center justify-center text-4xl">
                {item.emoji}
              </div>
              <h3 className="text-white font-semibold mb-1">{item.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{item.description}</p>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                item.expectedResult.isAuthentic
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {item.expectedResult.confidence}% confidence
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Demo data with realistic authentication results
const DEMO_ITEMS = [
  {
    id: 'nike-windbreaker',
    name: '1992 Nike Air Windbreaker',
    description: 'Vintage Nike Air track jacket with embroidered Swoosh',
    emoji: '🧥',
    imageUrl: '/demos/nike-windbreaker.jpg',
    expectedResult: {
      isAuthentic: true,
      confidence: 94,
      confidenceLevel: 'very_high' as const,
      category: 'jacket' as const,
      brandEra: {
        brand: 'Nike',
        era: 'Early 1990s Golden Age',
        yearRange: [1991, 1993] as [number, number],
        confidence: 92,
        markers: [
          'Embroidered Swoosh (pre-1995 construction)',
          'Triple-stitched seams',
          'Nylon shell with mesh lining',
          'Color-blocked panels (classic 90s aesthetic)',
        ],
      },
      rnLookup: {
        rnNumber: 'RN 56323',
        companyName: 'Nike, Inc.',
        registrationYear: 1974,
        calculatedYear: 1992,
        status: 'active' as const,
        formula: '(56323 - 13670) / 2635 + 1959 ≈ 1975 (company established)',
      },
      brandPattern: {
        brand: 'Nike',
        era: '1990-1995',
        authenticityScore: 94,
        matchedPatterns: [
          'Center-back embroidered Swoosh',
          'Authentic nylon fabric weight',
          'Period-correct zipper pull',
          'Vintage Nike tag placement',
        ],
        redFlags: [],
        details: 'All authentication markers consistent with 1991-1993 production. Tag stitching and material composition match Nike factory standards from this era.',
      },
      dateForensics: {
        estimatedEra: 'Early 1990s',
        yearRange: [1991, 1993] as [number, number],
        confidence: 89,
        evidence: [
          'RN number dates to early 90s production',
          'Nylon weave pattern matches 1990-1993 Nike specification',
          'Embroidered Swoosh method discontinued after 1995',
          'Color palette matches 1992 Nike Air catalog',
        ],
        constructionDetails: [
          'Triple-needle stitching on seams',
          'Mesh inner lining with diamond pattern',
          'Elastic cuffs with ribbed construction',
        ],
        materialAnalysis: 'Shell: 100% nylon, Lining: 100% polyester mesh. Fabric weight and weave density consistent with early 90s Nike production standards.',
      },
      marketData: {
        estimatedValue: {
          low: 85,
          mid: 125,
          high: 175,
          currency: 'USD',
        },
        comparableSales: [
          {
            title: '1993 Nike Windbreaker',
            price: 120,
            platform: 'Grailed',
            date: '2026-01-15',
            condition: 'Very Good',
          },
          {
            title: 'Vintage Nike Air Jacket',
            price: 140,
            platform: 'eBay',
            date: '2026-01-08',
            condition: 'Excellent',
          },
          {
            title: '90s Nike Track Jacket',
            price: 95,
            platform: 'Depop',
            date: '2025-12-28',
            condition: 'Good',
          },
        ],
        marketTrend: 'rising' as const,
        demandLevel: 'high' as const,
      },
      reasoning: 'This Nike windbreaker exhibits all hallmarks of authentic early 1990s production. The embroidered Swoosh placement, triple-stitched construction, and RN number cross-validation provide high confidence. The color-blocked design and nylon material are period-appropriate. No counterfeit markers detected.',
      redFlags: [],
      verifiedMarkers: [
        'Authentic embroidered Swoosh',
        'Period-correct RN tag',
        'Genuine Nike zipper hardware',
        'Proper seam construction',
      ],
      timestamp: Date.now(),
      processingTime: 4200,
    },
  },
  {
    id: 'levis-big-e',
    name: "Vintage Levi's 501 Big E",
    description: "Pre-1971 Levi's 501 with Big E red tab",
    emoji: '👖',
    imageUrl: '/demos/levis-big-e.jpg',
    expectedResult: {
      isAuthentic: true,
      confidence: 87,
      confidenceLevel: 'high' as const,
      category: 'denim' as const,
      brandEra: {
        brand: "Levi's",
        era: 'Big E Era (1960s-early 70s)',
        yearRange: [1966, 1971] as [number, number],
        confidence: 88,
        markers: [
          'Capital E on red tab',
          'Single-stitch arcuate',
          'Hidden rivets',
          'Selvedge denim',
        ],
      },
      rnLookup: null,
      brandPattern: {
        brand: "Levi's",
        era: '1966-1971',
        authenticityScore: 87,
        matchedPatterns: [
          'Big E red tab (production ended 1971)',
          'Single-stitch back pocket arcuate',
          'Cone Mills selvedge denim',
          'Hidden rivet construction',
        ],
        redFlags: [
          'Minor fading suggests moderate wear (expected for vintage)',
        ],
        details: 'Authentic Big E era 501s. The capital E on the red tab definitively dates these to pre-1971. Selvedge construction and hidden rivets are period-correct.',
      },
      dateForensics: {
        estimatedEra: 'Late 1960s',
        yearRange: [1966, 1971] as [number, number],
        confidence: 91,
        evidence: [
          'Big E red tab (discontinued January 1971)',
          'Cone Mills selvedge ID visible',
          'Single-stitch arcuate (pre-1983)',
          'Button fly with Levi Strauss & Co. stamp',
        ],
        constructionDetails: [
          'Copper rivets with hidden back pocket design',
          'Chain-stitched hem',
          'Five-button fly',
        ],
        materialAnalysis: 'Cone Mills White Oak selvedge denim, 13-14oz weight. Indigo rope-dyed warp with natural cotton weft. Weave pattern and selvage edge consistent with late 1960s production.',
      },
      marketData: {
        estimatedValue: {
          low: 450,
          mid: 650,
          high: 950,
          currency: 'USD',
        },
        comparableSales: [
          {
            title: "Levi's 501 Big E 1960s",
            price: 680,
            platform: 'Etsy Vintage',
            date: '2026-01-20',
            condition: 'Excellent',
          },
          {
            title: 'Vintage 501 Big E Selvedge',
            price: 595,
            platform: 'eBay',
            date: '2026-01-12',
            condition: 'Very Good',
          },
          {
            title: "1960s Levi's 501 Big E",
            price: 720,
            platform: 'Grailed',
            date: '2025-12-30',
            condition: 'Excellent',
          },
        ],
        marketTrend: 'stable' as const,
        demandLevel: 'very_high' as const,
      },
      reasoning: "Authentic Big E era Levi's 501. The capital E on the red tab is the definitive authentication marker - Levi's switched to lowercase e in January 1971. Selvedge construction, single-stitch arcuate, and hidden rivets all match era specifications. High collector value due to scarcity and historical significance.",
      redFlags: [],
      verifiedMarkers: [
        'Big E red tab',
        'Selvedge selvage edge',
        'Single-stitch arcuate',
        'Hidden back pocket rivets',
        'Cone Mills denim',
      ],
      timestamp: Date.now(),
      processingTime: 5100,
    },
  },
  {
    id: 'fake-polo-sport',
    name: 'Suspect Ralph Lauren Polo Sport',
    description: 'Questionable 1990s Polo Sport fleece with inconsistencies',
    emoji: '🏴',
    imageUrl: '/demos/fake-polo-sport.jpg',
    expectedResult: {
      isAuthentic: false,
      confidence: 42,
      confidenceLevel: 'low' as const,
      category: 'sportswear' as const,
      brandEra: {
        brand: 'Ralph Lauren (suspect)',
        era: 'Claimed: 1990s Polo Sport',
        yearRange: [1995, 2000] as [number, number],
        confidence: 35,
        markers: [
          'Logo placement irregular',
          'Stitching quality inconsistent',
          'Material weight feels off',
        ],
      },
      rnLookup: {
        rnNumber: 'RN 41381',
        companyName: 'Polo Ralph Lauren Corporation',
        registrationYear: 1967,
        calculatedYear: null,
        status: 'active' as const,
        formula: '(41381 - 13670) / 2635 + 1959 ≈ 1969 (RN formula check)',
      },
      brandPattern: {
        brand: 'Ralph Lauren',
        era: 'Claimed 1990s',
        authenticityScore: 38,
        matchedPatterns: [
          'Basic Polo Sport logo shape',
        ],
        redFlags: [
          'Logo embroidery thread quality inferior',
          'Flag colors appear faded/incorrect',
          'Stitching density too low for authentic RL',
          'Fleece material rougher than genuine Polo Sport',
          'Zipper pull lacks authentic Polo branding',
          'Care tag font differs from period standards',
        ],
        details: 'Multiple authentication failures. The Polo Sport logo embroidery shows poor thread quality and irregular stitching density - inconsistent with Ralph Lauren manufacturing standards. The fleece material weight and texture do not match authentic 1990s Polo Sport specifications.',
      },
      dateForensics: {
        estimatedEra: 'Likely modern reproduction',
        yearRange: [2015, 2025] as [number, number],
        confidence: 68,
        evidence: [
          'RN number correct but tag construction modern',
          'Fleece material appears newer (synthetic blend not used in 90s)',
          'Zipper hardware style post-2010',
          'Care tag washing symbols use modern ISO format',
        ],
        constructionDetails: [
          'Overlock stitching on seams (cheaper modern method)',
          'Polyester fleece blend (90s used heavier cotton blends)',
          'Heat-transferred size label (vintage used sewn tags)',
        ],
        materialAnalysis: 'Fleece composition appears to be 80% polyester / 20% cotton. Authentic 1990s Polo Sport fleece was typically 70% cotton / 30% polyester or 100% cotton. Fabric hand and weight inconsistent with era.',
      },
      marketData: {
        estimatedValue: {
          low: 15,
          mid: 25,
          high: 40,
          currency: 'USD',
        },
        comparableSales: [
          {
            title: 'Replica Polo Sport Fleece',
            price: 28,
            platform: 'Generic Marketplace',
            date: '2026-01-18',
            condition: 'New',
          },
          {
            title: 'Vintage Style Polo Jacket',
            price: 35,
            platform: 'AliExpress',
            date: '2026-01-10',
            condition: 'New',
          },
        ],
        marketTrend: 'stable' as const,
        demandLevel: 'low' as const,
      },
      reasoning: 'This item exhibits multiple authentication failures that indicate it is likely a modern reproduction or counterfeit. Key concerns: (1) Logo embroidery quality significantly below Ralph Lauren standards, (2) Fleece material composition and weight inconsistent with 1990s Polo Sport, (3) Construction methods (overlock seams, heat-transferred labels) indicate modern fast-fashion manufacturing, (4) Hardware and zipper details lack authentic Polo branding. While the RN number is correct for Polo Ralph Lauren, the tag construction and garment details do not match authentic vintage production.',
      redFlags: [
        'Poor logo embroidery quality',
        'Incorrect material composition',
        'Modern construction techniques',
        'Missing authentic hardware details',
        'Care tag format anachronistic',
        'Fleece texture inconsistent with era',
      ],
      verifiedMarkers: [],
      timestamp: Date.now(),
      processingTime: 3800,
    },
  },
]
