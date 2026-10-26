<p align="center">
  &nbsp;<img src="img/logo-snaplet.png" alt="Snaplet Logo" width="100">
</p>

<h1 align="center">Snaplet</h1>

Snaplet is a sleek, browser-based photobooth web application designed to let users capture sequential photos and generate custom-framed photobooth strips directly in their browser.

## 🌐 Live Demo

Experience the live application here:  
👉 **[Snaplet](https://snaplett.vercel.app/)**

## ✨ Key Features

- **Live Camera Integration**: Seamless webcam capture with mirrored preview (`scaleX(-1)`) via the native `MediaDevices.getUserMedia` API.
- **Automated 4-Shot Sequence**: Automatically captures four consecutive photos with a 3-second countdown timer and live pose cues (*"Cheese!"*, *"Smile!"*, *"Look at the Camera!"*, *"Pose!"*).
- **Physical Flash Effect**: Synchronized full-screen flash animation on each capture to replicate a physical photobooth flash.
- **Custom Aesthetic Frames**: Choice of 4 distinct overlay frames (Yellow, Classic Black, Blue & Green, and Red & Blue) preserved across pages via `localStorage`.
- **Intelligent Centered Cropping**: Automatically computes crop bounds ($1030 \times 650$) from webcam aspect ratios to prevent image distortion.
- **Client-Side Canvas Compositing**: Uses HTML5 Canvas 2D context to stack photos vertically and composite high-resolution overlay frames ($1280 \times 3000\text{px}$).
- **Instant High-Res PNG Download**: Direct one-click download (`snaplet-photobooth.png`) generated in-memory without server roundtrips.
- **Privacy-First Architecture**: 100% client-side execution; camera streams and captured images are never uploaded to any remote server.

## 🛠️ Tech Stack

- **HTML5**: Semantic document structure, `<video>` capture element, and `<canvas>` graphics rendering.
- **CSS3**: Modern layout with Flexbox, custom animations (`flashAnim`, `spin`, `fadeIn`), and responsive media queries.
- **JavaScript (ES6+)**: Pure vanilla JavaScript for camera streams, asynchronous promise-based image rendering, and DOM manipulation.
- **Hosting**: [Vercel](https://vercel.com)

## 💻 Local Setup Instructions

No build tools or external dependencies are required.

> **Note**: Modern web browsers require a secure context (`https://` or `http://localhost`) to access webcam hardware.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/evanhendramulyadi/snaplet.git
   cd snaplet
   ```

2. **Run the application**:
   - Serve it using a lightweight local development server:
     ```bash
     # Using Python
     python -m http.server 3000
     ```
     Then open `http://localhost:3000` in your browser, **or**
   - Open the project directory in VS Code, right-click `index.html`, and select **Open with Live Server**, **or**
   - Use Node.js:
     ```bash
     npx serve .
     ```

## 👥 Credits

<p align="center">
  <img src="img/logo-clario.png" alt="Clario Logo" width="80">
</p>

Snaplet was created and developed by **Clario**:
- **Evan Hendra Mulyadi** – Team Leader & Web Developer
- **Ivander Nathanael Thio** – Designer
- **Alden Kestian Pramono** – Designer

## 📄 Copyright & Ownership

© 2026–Present Clario. All Rights Reserved.

This project is an original work created by **Clario** (led and developed by Evan Hendra Mulyadi with design by Ivander Nathanael Thio and Alden Kestian Pramono).

This repository is publicly accessible solely for viewing, studying, and reviewing the source code. Public access does **not** grant permission to copy the entire project, rebrand or rename it, remove attribution, or claim it as your own creation. Re-use or distribution without explicit permission from the author is strictly prohibited.
