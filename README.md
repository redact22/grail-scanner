# GRAIL SCANNER

**Forensic Vintage Authentication Powered by Gemini 3 Pro**

Point your phone at any vintage clothing item. GRAIL SCANNER uses Gemini 3's multimodal reasoning to authenticate it in real-time -- dating the era, verifying brand markers, and estimating market value. No expertise required.

**Live Demo**: [grail-scanner.vercel.app](https://grail-scanner.vercel.app)

---

## Gemini 3 Hackathon Submission

- **Category**: AI Applications
- **Prize Pool**: $100,000 total ($50k grand prize)
- **Deadline**: February 9, 2026, 5:00 PM PST

---

## The Problem

**90% of vintage clothing has authentication concerns.** The $450B+ counterfeit market makes it nearly impossible for casual buyers to verify era of manufacture, brand authenticity, material composition, or fair market value. Professional authentication costs $50-200+ per item and takes days.

**GRAIL SCANNER democratizes decades of expert knowledge through AI-powered forensic analysis -- instant, free, on your phone.**

---

## Gemini 3 Features Used (7+)

| # | Feature | How We Use It |
|---|---------|---------------|
| 1 | **Thinking Level (high)** | Deep forensic reasoning across multi-step authentication |
| 2 | **Media Resolution (high)** | Fine-grained vision for textile weave patterns, stitch density, label fonts |
| 3 | **Function Calling (4 tools)** | RN/WPL lookup, brand pattern DB, date forensics, market search |
| 4 | **Multi-Turn Conversation** | Tool results feed back into Gemini for synthesis |
| 5 | **Grounding (Google Search)** | Real-time market pricing and comparable sales |
| 6 | **Structured Output** | Type-safe JSON authentication reports |
| 7 | **Self-Correction Loop** | Re-analyzes when confidence < 70%, improving accuracy |

### Authentication Pipeline

```
Camera Capture --> Gemini 3 Pro --> Forensic Tools --> Market Intel --> Report
     |             thinking:high        |                |              |
getUserMedia    + Function Calling   RN Lookup     Google Search   Confidence
+ file upload   + Media Resolution   Brand DB      Grounding       Score Card
                + Self-Correction    Date Forensics                 Share
```

---

## Quick Start

### Prerequisites

- Node.js 20+ and npm
- [Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key) (free tier available)
- Modern browser with camera access

### Run Locally

```bash
git clone https://github.com/redact22/grail-scanner.git
cd grail-scanner
npm install

# Configure your API key
cp .env.example .env
# Edit .env: VITE_GEMINI_API_KEY=your_key_here

npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Demo Gallery works without an API key.

### Build for Production

```bash
npm run build      # TypeScript check + Vite build
npm run preview    # Preview production build locally
```

---

## How It Works

### 1. Capture
Point your camera at a vintage item or upload a photo. Supports front/back camera switching on mobile.

### 2. Analyze
Gemini 3 Pro examines the image with high media resolution, identifying:
- Brand logos, labels, and tags
- Stitching patterns and construction techniques
- Material composition and wear patterns
- Hardware details (zippers, buttons, rivets)

### 3. Tool Calling
The AI calls 4 forensic tools to cross-reference its visual analysis:

- **`rn_lookup`** -- Looks up FTC Registered Numbers to identify manufacturer and registration year. Uses the dating formula: `(RN - 13670) / 2635 + 1959`
- **`brand_patterns`** -- Verifies era-specific authentication markers (e.g., Nike's embroidered vs. printed Swoosh, Levi's Big E vs. lowercase e tab)
- **`date_forensics`** -- Analyzes 18+ construction markers (selvedge denim, union labels, zipper types) to date the item
- **`market_search`** -- Searches current market pricing with era-based value multipliers

### 4. Self-Correction
If confidence falls below 70%, GRAIL SCANNER automatically re-examines with enhanced scrutiny, looking for additional markers and subtle details.

### 5. Report
A comprehensive authentication report with:
- Authentic/Suspect verdict with confidence score
- Brand verification (matched patterns + red flags)
- RN/WPL lookup with formula
- Date forensics with evidence list
- Market value range with comparable sales and trend

---

## Demo Gallery

No API key? The built-in demo gallery showcases three pre-authenticated items:

| Item | Verdict | Confidence | Value Range |
|------|---------|------------|-------------|
| 1992 Nike Air Windbreaker | Authentic | 94% | $85 - $175 |
| Vintage Levi's 501 Big E | Authentic | 87% | $450 - $950 |
| Suspect Ralph Lauren Polo Sport | Not Authentic | 42% | $15 - $40 |

---

## Project Structure

```
grail-scanner/
├── src/
│   ├── components/
│   │   ├── App.tsx                  # 3-view state machine (home/scanner/results)
│   │   ├── CameraCapture.tsx        # getUserMedia + file upload + overlay
│   │   ├── AuthenticationReport.tsx  # Full report with confidence meter
│   │   ├── DemoMode.tsx             # Pre-loaded demo gallery
│   │   └── ScanOverlay.tsx          # Animated forensic scan overlay
│   ├── services/
│   │   └── gemini.ts               # Gemini 3 Pro integration + self-correction
│   ├── tools/
│   │   └── index.ts                # 4 function calling tools
│   └── types/
│       └── index.ts                # 25+ TypeScript interfaces
├── vercel.json                      # Deployment config with security headers
└── package.json                     # Zero runtime deps beyond React + Gemini SDK
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18.3 | Component architecture |
| Language | TypeScript 5.7 (strict) | Type safety, zero `any` |
| Build | Vite 6.0 | Fast HMR + optimized production builds |
| Styling | Tailwind CSS 3.4 | Utility-first responsive design |
| Animation | Framer Motion 11.15 | Scan overlay, transitions, micro-interactions |
| AI | Gemini 3 Pro | Multimodal reasoning + function calling |
| SDK | @google/generative-ai 0.21 | Official Google AI SDK |
| Deploy | Vercel | Production hosting with edge CDN |

**Bundle**: 341 KB JS (107 KB gzipped) + 22 KB CSS (5 KB gzipped)

---

## Target Users

- **Thrift shoppers** -- verify potential finds before buying
- **Resellers** -- price inventory accurately with market data
- **Collectors** -- authenticate high-value vintage pieces
- **Anyone** -- learn about vintage clothing authentication

---

## Security & Privacy

- API keys stored in environment variables (never committed)
- Camera access requires explicit browser permission
- No image storage -- processed in-memory only
- No user tracking, analytics, or cookies
- Open source for transparency
- Security headers configured (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)

---

## Development Progress

- [x] **Days 1-2**: Foundation -- React + TypeScript + Vite + Tailwind scaffold
- [x] **Days 3-4**: Core Engine -- Camera capture, Gemini integration, 4 function calling tools, self-correction loop (1,833 lines)
- [x] **Days 5-6**: UI/UX -- Demo gallery, animated scan overlay, glass morphism, responsive design (920 lines)
- [x] **Days 7-8**: Demo Flow -- Wire demo mode, share results, Vercel deployment, SDK type fixes
- [ ] **Days 9-10**: Video & submission materials
- [ ] **Day 11**: Final submission

---

## License

MIT License -- See [LICENSE](LICENSE)

---

## Links

- **Live Demo**: [grail-scanner.vercel.app](https://grail-scanner.vercel.app)
- **Source Code**: [github.com/redact22/grail-scanner](https://github.com/redact22/grail-scanner)
- **Hackathon**: Gemini 3 Hackathon 2026

---

*Democratizing years of vintage expertise through AI-powered forensic analysis.*
