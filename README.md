# GRAIL SCANNER 🔬

**Forensic Vintage Authentication Powered by Gemini 3 Pro**

Point your phone at any vintage clothing item. GRAIL SCANNER uses Gemini 3's multimodal reasoning to authenticate it in real-time, dating the era, verifying brand markers, and estimating market value — no expertise required.

---

## 🏆 Gemini 3 Hackathon Submission

- **Category**: AI Applications
- **Prize Pool**: $100,000 total ($50k grand prize)
- **Deadline**: February 9, 2026, 5:00 PM PST
- **Status**: Days 1-2 Foundation Complete ✅

---

## ✨ Features

### Gemini 3 Pro Integration

GRAIL SCANNER leverages **7+ advanced Gemini 3 features**:

1. **Thinking Level (high/low)**: Deep forensic reasoning for multi-step authentication
2. **Media Resolution (high)**: Fine-grained vision for textile weave patterns and authentication markers
3. **Function Calling**: Custom tools for RN/WPL lookup, brand pattern verification, era dating forensics
4. **Thought Signatures**: Multi-turn reasoning continuity for self-correction
5. **Grounding with Google Search**: Real-time market pricing and comparable sales
6. **Structured Output**: Type-safe JSON results with validation
7. **Self-Correction Loop**: Re-analyze on low confidence scores

### Authentication Pipeline

```
Camera Capture → Gemini 3 Pro → Forensic Tools → Market Intelligence → Results
     ↓              (thinking:high)      ↓              ↓              ↓
getUserMedia    + Function Calling   RN Lookup    Google Search   Confidence
                + Media Resolution   Brand DB     Grounding       Report Card
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- [Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key) (free tier: 1,000 daily requests)
- Modern browser with camera access

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

---

## 🎯 Use Cases

### Problem Statement

**90% of vintage clothing has authentication concerns.** The $450B+ counterfeit market makes it nearly impossible for casual buyers to verify:

- Era/decade of manufacture
- Brand authenticity markers
- Material composition
- Market value estimation

**Solution**: GRAIL SCANNER democratizes decades of expertise through AI-powered forensic analysis.

### Target Users

- **Thrift shoppers** verifying potential finds
- **Resellers** pricing inventory accurately
- **Collectors** authenticating high-value pieces
- **Anyone** curious about vintage items

---

## 📁 Project Structure

```
grail-scanner/
├── src/
│   ├── components/       # React components
│   ├── services/         # Gemini API integration
│   ├── tools/            # Function calling tools
│   ├── types/            # TypeScript interfaces
│   ├── App.tsx           # Main application
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind CSS config
└── vite.config.ts        # Vite bundler config
```

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 18.3+ |
| **Language** | TypeScript | 5.7+ |
| **Build Tool** | Vite | 6.0+ |
| **Styling** | Tailwind CSS | 3.4+ |
| **Animation** | Framer Motion | 11.15+ |
| **AI** | Gemini 3 Pro | Latest |
| **SDK** | @google/generative-ai | 0.21+ |

---

## 🧪 Development Roadmap

### ✅ Days 1-2: Foundation (Jan 29-30)

- [x] Create fresh repository (separate from existing projects)
- [x] Scaffold React + TypeScript + Vite
- [x] Configure Tailwind CSS + Framer Motion
- [x] Set up @google/generative-ai SDK
- [x] Create landing page with feature overview
- [x] Push initial commit to GitHub

### 🔄 Days 3-4: Core Engine (Jan 31 - Feb 1)

- [ ] Implement camera capture (getUserMedia API)
- [ ] Basic Gemini 3 Pro vision integration
- [ ] Function calling tools (4+ tools):
  - `rn_lookup`: RN number → registration year
  - `brand_patterns`: Era-specific brand authentication
  - `date_forensics`: Material/construction dating
  - `market_search`: Real-time pricing via Google Search
- [ ] Multi-step authentication flow
- [ ] Thought Signatures integration
- [ ] Self-correction loop (retry on confidence < 0.7)

### 🎨 Days 5-6: UI & Polish (Feb 2-3)

- [ ] Forensic results display (animated report card)
- [ ] Scan overlay with real-time feedback
- [ ] Authentication confidence visualization
- [ ] Mobile-responsive layout
- [ ] Error handling and edge cases

### 🚀 Days 7-8: Demo Flow (Feb 4-5)

- [ ] Simulation fallback (for demo stability)
- [ ] Pre-loaded demo items (known authentication cases)
- [ ] Performance optimization (bundle size, lazy loading)
- [ ] **FEATURE FREEZE**
- [ ] Deploy to Vercel/Netlify (public, no login)

### 🎬 Days 9-10: Video & Docs (Feb 6-7)

- [ ] Record 3-minute demo video
- [ ] Write 200-word submission description
- [ ] Create architectural diagram
- [ ] Test production deployment
- [ ] Prepare Devpost submission

### 📤 Day 11: Submit (Feb 8)

- [ ] Final end-to-end testing
- [ ] Submit to Devpost before 5:00 PM PST (Feb 9)

---

## 📊 Judging Criteria Alignment

| Criterion | Weight | Our Score | Strategy |
|-----------|--------|-----------|----------|
| **Technical Execution** | 40% | ⭐⭐⭐⭐⭐ | 7+ Gemini 3 features, clean code |
| **Innovation** | 30% | ⭐⭐⭐⭐ | Forensic authentication is novel |
| **Impact** | 20% | ⭐⭐⭐⭐ | Solves $450B+ counterfeit problem |
| **Presentation** | 10% | ⭐⭐⭐⭐⭐ | Visual, real-time, tangible demo |

**Target**: Top 3 finish ($10k-$50k prize + AI Futures Fund interview)

---

## 🎥 Demo Video Storyboard

**Runtime**: ~3 minutes

1. **0:00-0:15** - Hook: "90% of vintage clothing has authentication concerns"
2. **0:15-0:30** - Problem: Show questionable listings, counterfeit statistics
3. **0:30-1:00** - Demo: User points camera at item, scan animation appears
4. **1:00-1:30** - Tool Calling: Show reasoning chain in real-time
5. **1:30-2:00** - Results: Authentication report card with confidence score
6. **2:00-2:20** - Live Market: Google Search grounding shows comparable sales
7. **2:20-2:45** - Architecture: Diagram showing Gemini 3 features integration
8. **2:45-3:00** - Impact: "Democratizes expertise. Built on Gemini 3."

---

## 🔐 Security & Privacy

- API keys stored in environment variables (never committed)
- Camera access requires explicit user permission
- No image storage (processed in-memory only)
- No user tracking or analytics
- Open source for transparency

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- **Google Gemini Team** for the Gemini 3 API and hackathon
- **Anthropic** for Claude Code development assistance
- **Vintage Community** for authentication expertise

---

## 📞 Contact

- **GitHub**: [grail-scanner](https://github.com/yourusername/grail-scanner)
- **Demo**: [grail-scanner.vercel.app](https://grail-scanner.vercel.app)
- **Hackathon**: [Gemini 3 Hackathon](https://gemini3.devpost.com/)

---

**Built with ❤️ for the Gemini 3 Hackathon 2026**

*Democratizing years of vintage expertise through AI-powered forensic analysis.*
