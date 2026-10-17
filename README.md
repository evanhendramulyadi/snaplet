<p align="center">
  <img src="img/logo-snaplet.png" alt="Snaplet Logo" width="100">
</p>

<h1 align="center">Snaplet</h1>

<p align="center">
  <strong>A modern, browser-based photobooth web application engineered for instant sequential photo capture and custom aesthetic frame compositing directly in your browser.</strong>
</p>

<p align="center">
  <a href="https://snaplett.vercel.app" target="_blank"><strong>🌐 Live Demo: snaplett.vercel.app</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Language-HTML5%20%7C%20CSS3%20%7C%20JavaScript-blue?style=flat-square" alt="Tech Stack">
  <img src="https://img.shields.io/badge/API-HTML5%20Canvas%20%26%20MediaDevices-00b4d8?style=flat-square" alt="Web APIs">
  <img src="https://img.shields.io/badge/Dependencies-Zero-success?style=flat-square" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel" alt="Vercel Deployment">
  <img src="https://img.shields.io/badge/Copyright-All%20Rights%20Reserved-red?style=flat-square" alt="All Rights Reserved">
</p>

---

## 📌 Overview

**Snaplet** is a lightweight, responsive, and privacy-focused client-side photobooth web application designed to bring the classic photobooth experience straight to the web browser. Pairing a clean, warm aesthetic with responsive controls, Snaplet allows users to capture sequential camera snapshots guided by automated countdowns and pose cues, composite the photos into an artistic photo strip with customizable frames, and download the finished high-resolution image instantly.

The entire photobooth engine operates 100% in-memory within the client's browser. With zero server backends, zero external database transmissions, and zero tracking scripts, Snaplet ensures complete user privacy—camera streams and captured photos never leave the local device.

---

## 🌐 Live Deployment

The application is deployed on Vercel and available globally:
- **Live URL**: [https://snaplett.vercel.app](https://snaplett.vercel.app)
- **Deployment Platform**: Vercel (Edge Network)
- **Build Configuration**: Zero build step required (Static HTML/CSS/JS)

---

## ✨ Key Features

### 📸 Automated Sequential Photobooth Engine
- **Automated 4-Shot Sequence**: Automatically captures four successive snapshots with a 3-second visual countdown and live prompt cues (*"Cheese!"*, *"Smile!"*, *"Look at the Camera!"*, *"Pose!"*).
- **Direct Mirror Camera Feed**: Integrates natively with `navigator.mediaDevices.getUserMedia`, applying horizontal mirroring (`scaleX(-1)`) to simulate a natural mirror reflection.
- **Hardware Resource Conservation**: Automatically stops all camera tracks (`MediaStreamTrack.stop()`) immediately upon completing the 4-shot sequence to release camera hardware.
- **Synchronized Physical Flash Effect**: Implements a synchronized full-screen CSS flash animation (`@keyframes flashAnim`) on each shot to replicate the physical photobooth experience.
- **Zero Network Transmission & Total Privacy**: No photos are uploaded to any external server or cloud bucket; all image data stays entirely in local browser memory.

### 🖼️ Frame Selection & Smart Canvas Compositing
- **Curated Aesthetic Frames**: Offers four distinct graphic frame overlays (Yellow, Classic Black, Blue & Green, and Red & Blue) persisted seamlessly across pages via `localStorage`.
- **Intelligent Aspect Ratio Cropping**: Dynamically calculates centered crop boundaries ($1030 \times 650$, aspect ratio $\approx 1.5846$) from diverse webcam resolutions to guarantee photos fit frame slots without distortion or stretching.
- **Pixel-Perfect Canvas Compositing**: Utilizes the HTML5 Canvas 2D Context (`source-over`) to stack all 4 cropped snapshots with exact offsets ($115\text{px}$ top offset, $67\text{px}$ inter-photo gap) and overlays high-fidelity PNG frame graphics ($1280 \times 3000\text{px}$).
- **Instant Client-Side PNG Export**: One-click download of the final composite photo strip (`snaplet-photobooth.png`) generated directly as a high-resolution PNG data URL.

### 🎨 Modern Interface & User Experience
- **Intuitive Multi-Step Workflow**: Fluid progression from the welcome landing page to frame gallery, photobooth studio, processing loader, and result preview.
- **Pre-Capture Tips & Safety Enforcement**: Informational tips modal ensuring user camera access is confirmed and readiness acknowledged before initiating the capture cycle.
- **Animated Processing State**: Clean animated CSS spinner during image compositing to provide clear user feedback.
- **Responsive Layout**: Engineered with vanilla CSS3 flexbox layouts, Google Fonts (Poppins), and responsive media query breakpoints optimized for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic W3C-compliant document structure, media capture video element (`<video>`), and graphics canvas (`<canvas>`).
- **CSS3**: Modern layout architecture utilizing Flexbox, keyframe animations (`flashAnim`, `spin`, `fadeIn`), backdrop filter blur, and responsive media queries.
- **JavaScript (ES6+)**: Pure vanilla JavaScript managing camera streams, asynchronous promise-based image rendering, `localStorage` state management, and DOM event lifecycles with zero external libraries or dependencies.
- **Web APIs**: Native browser `MediaDevices.getUserMedia`, `HTMLCanvasElement` 2D context, and Web Storage API (`localStorage`).

---

## 📁 Project Structure

```
snaplet/
├── css/
│   └── style.css                 # Global styling, animations, modals, and responsive breakpoints
├── img/
│   ├── background.png            # Main background texture
│   ├── logo-snaplet.png          # Snaplet brand logo and favicon
│   ├── logo-clario.png           # Clario collaborative team badge
│   ├── frame-preview-1.png       # Frame 1 gallery thumbnail (Yellow)
│   ├── frame-preview-2.png       # Frame 2 gallery thumbnail (Black)
│   ├── frame-preview-3.png       # Frame 3 gallery thumbnail (Blue & Green)
│   ├── frame-preview-4.png       # Frame 4 gallery thumbnail (Red & Blue)
│   ├── frame-overlay-1.png       # High-resolution photobooth overlay frame 1 (1280x3000)
│   ├── frame-overlay-2.png       # High-resolution photobooth overlay frame 2 (1280x3000)
│   ├── frame-overlay-3.png       # High-resolution photobooth overlay frame 3 (1280x3000)
│   └── frame-overlay-4.png       # High-resolution photobooth overlay frame 4 (1280x3000)
├── js/
│   └── script.js                 # Camera engine, countdown timer, canvas compositing, and download logic
├── about.html                    # Team credits and project background
├── choose_frame.html             # Interactive frame gallery selection view
├── google71259ab7778c0146.html   # Google Search Console site verification
├── how_to_use.html               # Step-by-step user instruction guide
├── index.html                    # Welcome landing page with start CTA
├── photobooth.html               # Live camera studio and photo strip generation
└── README.md                     # Project documentation and technical specification
```

---

## 💻 Getting Started

Because Snaplet is built strictly using standard web technologies, no build pipeline, compiler, or package manager (`npm`, `yarn`, `pnpm`) is required.

### Prerequisites
A modern web browser supporting `navigator.mediaDevices.getUserMedia` and the HTML5 Canvas API (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, Brave, etc.) with camera access enabled.

> [!IMPORTANT]
> Modern web browsers restrict webcam access via `navigator.mediaDevices.getUserMedia` to **secure contexts** (`https://` or `http://localhost`). Opening `photobooth.html` directly via `file:///` may block camera permissions. Always run via a local HTTP server.

### Local Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/evanhendramulyadi/snaplet.git
cd snaplet
```

#### 2. Run the Application

You can run Snaplet using any of the following methods:

- **Node.js Serve (Recommended)**:
  ```bash
  npx serve .
  ```
  Then navigate to `http://localhost:3000` in your web browser.

- **Python HTTP Server**:
  ```bash
  # Python 3
  python -m http.server 3000
  ```
  Then navigate to `http://localhost:3000` in your web browser.

- **VS Code Live Server Extension**:
  Open the project directory in Visual Studio Code, right-click `index.html`, and select **Open with Live Server**.

---

## 📖 How to Use

1. **Start the Photobooth**: Click **Start Photobooth** on the landing page (`index.html`). On mobile devices, Desktop Site mode is recommended for optimal framing.
2. **Choose a Frame**: Select your preferred photo frame from the gallery (`choose_frame.html`). Your selection is stored in `localStorage`.
3. **Allow Camera Access**: When prompted by your browser, grant camera permission to initialize the live preview.
4. **Review Tips & Click Ready**: Read the instructions on the tips modal and press **READY** to start the photobooth session.
5. **Pose for 4 Sequential Shots**: Follow the on-screen 3-second countdown timer and pose cues (*"Cheese!"*, *"Smile!"*, *"Look at the Camera!"*, *"Pose!"*). A flash animation triggers with each shot.
6. **Automatic Processing**: After the 4th photo, the camera stops automatically, and the application composites your photos behind your selected frame overlay on an HTML5 canvas.
7. **Download Your Photo**: Click **Download** to save your composite photobooth strip (`snaplet-photobooth.png`) as a high-resolution PNG, then click **Close** to return to the Home page.

---

## 🔬 Technical Architecture & Compositing Pipeline

### 1. Aspect Ratio Normalization & Centered Cropping
Webcam sensors output varying aspect ratios (such as $4:3$ or $16:9$). To fit into the photo frame slots ($1030 \times 650\text{px}$, target ratio $\approx 1.5846$) without geometric distortion, Snaplet dynamically evaluates `videoWidth / videoHeight` against `targetRatio`:
- **When video is wider than target ratio** (`currentRatio > targetRatio`):
  $$\text{sourceHeight} = \text{videoHeight}$$
  $$\text{sourceWidth} = \text{videoHeight} \times \text{targetRatio}$$
  $$\text{sourceX} = \frac{\text{videoWidth} - \text{sourceWidth}}{2}, \quad \text{sourceY} = 0$$
- **When video is taller than target ratio** (`currentRatio <= targetRatio`):
  $$\text{sourceWidth} = \text{videoWidth}$$
  $$\text{sourceHeight} = \frac{\text{videoWidth}}{\text{targetRatio}}$$
  $$\text{sourceX} = 0, \quad \text{sourceY} = \frac{\text{videoHeight} - \text{sourceHeight}}{2}$$

### 2. Horizontal Mirror Inversion
To replicate a natural mirror reflection, canvas coordinate space is horizontally inverted prior to drawing:
```javascript
ctx.translate(canvas.width, 0);
ctx.scale(-1, 1);
```

### 3. Asynchronous Promise-Based Compositing
Each snapshot is captured as a Base64 data URL and stored in an array. When processing results:
1. The canvas dimensions are configured to match the frame overlay graphic ($1280 \times 3000\text{px}$).
2. All four captured photos are loaded concurrently using `Promise.all()`.
3. Photos are rendered vertically at coordinates $(x_{\text{pos}}, \text{startY} + i \times (\text{photoH} + \text{gap}))$, where $x_{\text{pos}} = (\text{canvas.width} - 1030) / 2$, $\text{startY} = 115\text{px}$, $\text{photoH} = 650\text{px}$, and $\text{gap} = 67\text{px}$.
4. The frame overlay graphic is drawn on top with `ctx.globalCompositeOperation = "source-over"`, producing a seamless, high-fidelity photobooth film strip.

---

## ⚙️ Environment & Configuration

- **Zero Configuration**: No `.env` files, build scripts, or secret tokens are needed.
- **Client-Side Execution**: All processing, camera interaction, and canvas rendering occur strictly within the local browser context.
- **Privacy Assurance**: No secrets, camera feeds, or usage telemetry are logged or transmitted.

---

## 👥 Credits

Snaplet was created and developed by **Clario**, a collaborative team of friends exploring creative digital design and technology:

- **Evan Hendra Mulyadi** – Team Leader & Web Developer ([@evanhendraa](https://www.instagram.com/evanhendraa))
- **Ivander Nathanael Thio** – Designer ([@ivandernathanaelthio](https://www.instagram.com/ivandernathanaelthio))
- **Alden Kestian Pramono** – Designer ([@kestiandn](https://www.instagram.com/kestiandn))

---

## 📄 Copyright & Terms of Use

© 2026–Present Clario. All Rights Reserved.

### Intellectual Property & Repository Guidelines
This project is an original creation by **Clario** (led and developed by Evan Hendra Mulyadi with design contributions by Ivander Nathanael Thio and Alden Kestian Pramono).

This repository is maintained publicly for the purpose of transparency, portfolio display, technical study, and peer review of client-side web development and canvas compositing practices:

- **Review & Learning**: You are welcome to view, inspect, test, and learn from the source code and architectural patterns for individual study and research.
- **No Plagiarism or Unauthorized Rebranding**: Public visibility does not grant permission to duplicate the project, remove original attributions, rename or rebrand the software, and falsely claim authorship.
- **Usage & Redistribution**: Any reuse, adaptation, or derivative work must respect Clario's copyright and applicable terms. Re-implementing similar web photobooth concepts independently from scratch for educational purposes is welcomed and encouraged.
