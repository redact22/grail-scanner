# GRAIL SCANNER - Hackathon Submission Materials

## Devpost Short Description (200 words)

GRAIL SCANNER turns your phone into a forensic authentication lab for vintage clothing. Point your camera at any vintage item and get an instant expert-level authentication report -- brand verification, era dating, construction analysis, and real-time market pricing.

The $450B+ counterfeit market makes vintage authentication a real problem. Professional authentication costs $50-200+ per item and takes days. GRAIL SCANNER democratizes this expertise for free, instantly, on any phone.

We leverage 7+ Gemini 3 features in a single authentication flow:

- **Thinking Level (high)** for deep forensic reasoning across multiple authentication steps
- **Media Resolution (high)** to analyze textile weave patterns, stitch density, and label fonts
- **Function Calling** with 4 custom tools: RN/WPL database lookup, brand pattern verification, date forensics (18+ construction markers), and market search
- **Multi-turn conversation** feeding tool results back for synthesis
- **Self-correction loop** that automatically re-examines when confidence falls below 70%
- **Grounding with Google Search** for real-time market pricing
- **Structured output** producing type-safe authentication reports

Built with React 18, TypeScript (strict, zero `any`), and the @google/generative-ai SDK. Deployed at grail-scanner.vercel.app with a demo gallery that works without an API key.

---

## Demo Video Script (3 minutes)

### OPENING (0:00 - 0:20)

[Screen: Split view -- left shows scrolling vintage listings, right shows "$450B+ counterfeit market" stat]

NARRATOR: "Ninety percent of vintage clothing buyers have no way to verify what they're buying. The counterfeit market exceeds 450 billion dollars. Professional authentication costs fifty to two hundred dollars per item. What if your phone could do it for free?"

[Transition: GRAIL SCANNER logo animates in]

NARRATOR: "This is GRAIL SCANNER."

### DEMO - AUTHENTIC ITEM (0:20 - 1:15)

[Screen: Phone camera pointed at a vintage Nike windbreaker]

NARRATOR: "Point your camera at any vintage item."

[User taps capture button. ScanOverlay activates -- grid lines, corner brackets, sweep line]

NARRATOR: "GRAIL SCANNER sends the image to Gemini 3 Pro with high media resolution, examining textile weave patterns, label fonts, and stitching details that the human eye would miss."

[Screen: Progress bar showing tool calls]

NARRATOR: "Gemini calls four forensic tools. First, the RN lookup tool -- it finds the FTC registration number on the label and cross-references our database. The RN dating formula calculates when this manufacturer was registered."

[Tool call: rn_lookup returns Nike, Inc., RN 56323]

NARRATOR: "Next, the brand patterns tool verifies era-specific authentication markers. For early 90s Nike, it checks for the embroidered Swoosh, triple-stitched seams, and period-correct zipper hardware."

[Tool call: brand_patterns returns 94% match, 4 verified markers, 0 red flags]

NARRATOR: "The date forensics tool analyzes 18 construction markers -- fabric weight, stitch density, care label format -- to narrow the manufacturing window."

[Tool call: date_forensics returns 1991-1993]

NARRATOR: "Finally, market search pulls comparable sales from major platforms."

[Results screen appears with confidence meter animating to 94%]

NARRATOR: "Verdict: Authentic. Ninety-four percent confidence. Estimated value: eighty-five to one hundred seventy-five dollars. Market trend: rising."

### DEMO - FAKE ITEM (1:15 - 1:50)

[Screen: User selects demo gallery item -- Suspect Polo Sport]

NARRATOR: "Now watch what happens with a suspected counterfeit."

[Results load showing red flags]

NARRATOR: "GRAIL SCANNER flags six red flags: poor logo embroidery quality, incorrect material composition, modern construction techniques on a claimed 1990s item. Confidence: forty-two percent. Verdict: Suspect."

[Screen: Red flags list expanding]

NARRATOR: "The self-correction loop automatically triggered here -- Gemini re-examined the item with enhanced scrutiny and confirmed its initial assessment."

### ARCHITECTURE (1:50 - 2:25)

[Screen: Architecture diagram]

NARRATOR: "Under the hood, GRAIL SCANNER uses seven-plus Gemini 3 features in a single authentication flow."

[Highlight each feature as mentioned]

NARRATOR: "Thinking level high for deep forensic reasoning. High media resolution for textile analysis. Function calling with four custom tools. Multi-turn conversation feeding tool results back to Gemini. Self-correction when confidence is low. Google Search grounding for live market data. And structured output for type-safe reports."

[Screen: Code snippet showing tool declarations]

NARRATOR: "The entire codebase is TypeScript strict with zero 'any' types. Four forensic tools handle RN lookups with the FTC dating formula, brand pattern databases for Nike, Levi's, and Ralph Lauren, eighteen construction markers for date forensics, and market pricing with era-based value multipliers."

### IMPACT & CLOSE (2:25 - 3:00)

[Screen: Side-by-side -- thrift shopper using phone vs. professional authenticator at desk]

NARRATOR: "GRAIL SCANNER puts decades of authentication expertise in everyone's pocket. A thrift shopper at Goodwill gets the same forensic analysis that previously required a professional."

[Screen: Stats rolling -- "4 forensic tools", "18+ construction markers", "94% confidence on authentic items"]

NARRATOR: "It's free. It's instant. It runs in any browser. No account required."

[Screen: GRAIL SCANNER logo + URL]

NARRATOR: "GRAIL SCANNER. Democratizing expertise through AI-powered forensic analysis. Try it now at grail-scanner.vercel.app."

[End card: "Built on Gemini 3 Pro"]

---

## Submission Checklist

- [x] GitHub repository (public): github.com/redact22/grail-scanner
- [x] Live demo URL: grail-scanner.vercel.app
- [x] Demo works without login/signup
- [x] Demo gallery works without API key
- [x] README with setup instructions
- [x] MIT License
- [ ] 3-minute demo video (record)
- [ ] Devpost submission form
- [ ] Architecture diagram image

---

## Architecture Diagram (ASCII for reference)

```
                    ┌─────────────────────────────────────┐
                    │           GRAIL SCANNER              │
                    │        grail-scanner.vercel.app       │
                    └──────────────┬───────────────────────┘
                                   │
                    ┌──────────────▼───────────────────────┐
                    │         Camera Capture                │
                    │  getUserMedia + File Upload           │
                    │  1920x1080 JPEG @ 0.92 quality        │
                    └──────────────┬───────────────────────┘
                                   │ base64 image
                    ┌──────────────▼───────────────────────┐
                    │        Gemini 3 Pro                   │
                    │  thinking: high                       │
                    │  mediaResolution: high                │
                    │                                       │
                    │  ┌─────────────────────────────────┐  │
                    │  │    Multimodal Analysis           │  │
                    │  │  - Textile patterns              │  │
                    │  │  - Label/tag recognition         │  │
                    │  │  - Construction techniques       │  │
                    │  │  - Hardware identification       │  │
                    │  └──────────────┬──────────────────┘  │
                    │                 │ function calls       │
                    └─────────────────┼─────────────────────┘
                                      │
          ┌───────────────┬───────────┴────────┬──────────────────┐
          ▼               ▼                    ▼                  ▼
    ┌───────────┐  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
    │ rn_lookup │  │brand_patterns│  │date_forensics│  │market_search │
    │           │  │             │  │              │  │              │
    │ FTC RN DB │  │ Nike (4 era)│  │ 18 markers   │  │ Era pricing  │
    │ Dating    │  │ Levi's (4)  │  │ Construction │  │ Comparable   │
    │ formula   │  │ Ralph L (2) │  │ Materials    │  │ sales data   │
    └─────┬─────┘  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘
          │               │                │                  │
          └───────────────┴────────┬───────┴──────────────────┘
                                   │ tool results
                    ┌──────────────▼───────────────────────┐
                    │        Gemini 3 Pro (continued)       │
                    │  Multi-turn synthesis                 │
                    │                                       │
                    │  confidence < 70%?                    │
                    │     YES → Self-Correction Loop        │
                    │     NO  → Final Report                │
                    └──────────────┬───────────────────────┘
                                   │
                    ┌──────────────▼───────────────────────┐
                    │     Authentication Report             │
                    │  - Authentic/Suspect verdict          │
                    │  - Confidence score (0-100%)          │
                    │  - Brand verification                 │
                    │  - RN/WPL lookup + formula            │
                    │  - Date forensics + evidence          │
                    │  - Market value + comparables         │
                    │  - Share via Web Share API            │
                    └─────────────────────────────────────┘
```

---

## Key Differentiators for Judges

1. **Real utility**: Solves a genuine $450B problem, not a toy demo
2. **Depth of Gemini integration**: 7+ features working together, not just a chat wrapper
3. **Function calling mastery**: 4 custom tools with real forensic databases
4. **Self-correction**: The app gets smarter when uncertain -- demonstrates advanced AI patterns
5. **Production quality**: TypeScript strict, zero `any`, security headers, responsive, accessible
6. **Works offline**: Demo gallery functions without API key for reliable judging
7. **Domain expertise encoded**: RN dating formula, 18 construction markers, era-specific brand patterns
