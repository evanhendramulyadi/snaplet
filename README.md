<p align="center">
  <img src="img/logo-snaplet.png" alt="Snaplet Logo" width="120">
</p>

<h1 align="center">Snaplet</h1>

<p align="center">
  <strong>A modern, browser-based photobooth web application that transforms your camera into an instant photobooth strip generator with custom aesthetic frames.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Language-HTML5%20%7C%20CSS3%20%7C%20JavaScript-blue?style=flat-square" alt="Tech Stack">
  <img src="https://img.shields.io/badge/API-HTML5%20Canvas%20%26%20MediaDevices-green?style=flat-square" alt="Web APIs">
  <img src="https://img.shields.io/badge/Dependencies-Zero-success?style=flat-square" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/Deployment-Vercel%20Ready-black?style=flat-square&logo=vercel" alt="Vercel Ready">
  <img src="https://img.shields.io/badge/Copyright-%C2%A9%202026%20Evan-red?style=flat-square" alt="Copyright Evan">
</p>

---

## 📸 Overview

**Snaplet** is a lightweight, responsive, and privacy-focused client-side photobooth website. Designed with a clean aesthetic and intuitive user interface, Snaplet enables users to take four sequential webcam snapshots guided by real-time countdowns and pose cues, automatically composite the photos into an artistic photobooth film strip, and download the finished high-resolution image in one click.

The application runs entirely within the client browser. Photos are processed and merged directly in-memory using the HTML5 Canvas 2D context, meaning user camera feeds and images never leave the local device.

---

## ✨ Key Features

- **Direct In-Browser Camera Capture**: Seamlessly accesses the user's webcam using the `MediaDevices.getUserMedia` API, featuring mirror previewing (`scaleX(-1)`) and automated camera shutoff upon sequence completion.
- **Automated 4-Shot Sequence**: Captures four successive photos with a 3-second visual countdown timer and friendly prompt cues (*"Cheese!"*, *"Smile!"*, *"Look at the Camera!"*, *"Pose!"*).
- **Realistic Camera Flash Effect**: Includes a synchronized CSS animation simulating a physical photobooth flash on every shot.
- **Custom Aesthetic Frame Selection**: Users can choose from multiple curated frame designs (Yellow, Classic Black, Blue & Green, and Red & Blue) stored and referenced across the workflow via `localStorage`.
- **Intelligent Aspect Ratio Cropping**: Automatically computes centering and crop boundaries ($1030 \times 650$) from diverse camera resolutions to ensure photos fit into frame windows without distortion.
- **High-Resolution Canvas Compositing**: Stacks all four snapshots with pixel-perfect spacing ($115\text{px}$ top offset, $67\text{px}$ inter-photo gap) and overlays high-fidelity PNG frame graphics using Canvas 2D compositing.
- **Instant Client-Side Download**: One-click download of the generated photo strip (`snaplet-photobooth.png`) rendered as high-quality PNG.
- **Total User Privacy**: 100% client-side execution with zero external analytics, zero tracking, and zero server-side storage of captured imagery.
- **Responsive & Accessible Design**: Optimized for desktop and tablet screens, featuring responsive layout fallbacks and helpful guides for mobile browser users.

---

## 🛠️ Tech Stack

Snaplet is intentionally engineered with zero third-party framework dependencies, ensuring lightning-fast load times and straightforward maintainability:

| Layer | Technology | Details |
|---|---|---|
| **Structure** | HTML5 | Semantic markup, Canvas API, Media Capture (`<video>`, `<canvas>`) |
| **Styling** | CSS3 | Vanilla CSS, Flexbox, Keyframe Animations, Backdrop Filter Blur, Media Queries |
| **Typography** | Google Fonts | [Poppins](https://fonts.google.com/specimen/Poppins) (Weights: 400, 500, 600, 700) |
| **Logic** | JavaScript (ES6+) | Vanilla JS, WebRTC (`getUserMedia`), Promises, LocalStorage, HTMLCanvasElement |
| **Dependencies**| None | 0 external libraries or npm runtime dependencies |

---

## 📂 Project Structure

```plaintext
snaplet/
│
├── index.html                   # Landing page with welcome hero and start CTA
├── choose_frame.html            # Interactive frame selection gallery
├── photobooth.html              # Main camera capture view and canvas rendering
├── how_to_use.html              # Detailed step-by-step user guide
├── about.html                   # Project background and team credits
├── google71259ab7778c0146.html  # Google Search Console verification file
│
├── css/
│   └── style.css                # Global styles, layout, modal overlays, and responsive breakpoints
│
├── js/
│   └── script.js                # Core logic: camera feed, countdown, cropping, compositing, download
│
└── img/
    ├── background.png           # Website background graphic
    ├── logo-snaplet.png         # Snaplet brand logo and favicon
    ├── logo-clario.png          # Clario collaborative team logo
    ├── frame-preview-1.png      # Frame 1 gallery thumbnail (Yellow)
    ├── frame-preview-2.png      # Frame 2 gallery thumbnail (Black)
    ├── frame-preview-3.png      # Frame 3 gallery thumbnail (Blue & Green)
    ├── frame-preview-4.png      # Frame 4 gallery thumbnail (Red & Blue)
    ├── frame-overlay-1.png      # High-res overlay frame 1 (1280x3000)
    ├── frame-overlay-2.png      # High-res overlay frame 2 (1280x3000)
    ├── frame-overlay-3.png      # High-res overlay frame 3 (1280x3000)
    └── frame-overlay-4.png      # High-res overlay frame 4 (1280x3000)
```

---

## 🚀 Local Development & Setup

Because Snaplet is a pure static web application, it can be run locally using any standard local web server.

> [!IMPORTANT]
> Modern web browsers restrict webcam access via `navigator.mediaDevices.getUserMedia` to **secure contexts** (`https://` or `http://localhost`). Opening `photobooth.html` directly via `file:///` may block camera permissions. Always run via a local HTTP server.

### Option 1: Using Node.js (`npx serve`)

If you have [Node.js](https://nodejs.org/) installed:

```bash
# Navigate to the project root and launch a static server
npx serve .
```

Then open `http://localhost:3000` in your web browser.

### Option 2: Using Python 3

```bash
# Start Python's built-in HTTP server
python -m http.server 8000
```

Then open `http://localhost:8000` in your web browser.

### Option 3: Using VS Code Live Server

1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension.
3. Right-click on `index.html` and select **Open with Live Server**.

---

## 🌐 Deployment to Vercel

Snaplet is fully static and ready for instant deployment to [Vercel](https://vercel.com):

1. **Via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```
2. **Via Git Integration**:
   - Push this repository to GitHub.
   - Go to [Vercel Dashboard](https://vercel.com/new), import the repository, and click **Deploy**.
   - No build command or output directory configuration is needed (leave defaults: static root).

---

## 👥 Credits

Snaplet was developed collaboratively under **Clario**, a creative group exploring design and technology:

- **Evan Hendra Mulyadi** – Team Leader & Web Developer ([@evanhendraa](https://www.instagram.com/evanhendraa))
- **Ivander Nathanael Thio** – Designer ([@ivandernathanaelthio](https://www.instagram.com/ivandernathanaelthio))
- **Alden Kestian Pramono** – Designer ([@kestiandn](https://www.instagram.com/kestiandn))

---

## ⚖️ Copyright & Intellectual Property

**© 2026 Evan. All Rights Reserved.**

This project is an original creation by **Evan**. 

This repository is made publicly available for the sole purpose of viewing, inspecting, and learning from the source code. Public access to this repository does not grant permission to copy, duplicate, redistribute, rename, rebrand, or publish this work or any part thereof under another name or claim it as one's own original creation. 

Any reuse, quotation, or study must strictly respect applicable copyright laws and the author's intellectual property rights. No open-source license is granted.

