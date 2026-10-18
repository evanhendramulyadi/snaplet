<p align="center">
  <img src="img/logo-snaplet.png" alt="Snaplet Logo" width="100">
</p>

<h1 align="center">Snaplet</h1>

Snaplet is a modern, lightweight, and privacy-focused client-side photobooth web application. It transforms your browser into an automated photobooth that captures four sequential camera snapshots, crops and aligns them, composites them into custom aesthetic frames, and generates high-resolution photo strips ready for instant download.

---

## Live Demo

Experience Snaplet live on Vercel:  
**[https://snaplett.vercel.app](https://snaplett.vercel.app)**

---

## Key Features

- **In-Browser Camera Integration**: Live webcam preview with mirroring (`scaleX(-1)`) via `navigator.mediaDevices.getUserMedia`. Automatically shuts off camera hardware upon completion.
- **Automated 4-Shot Sequence**: Captures four successive photos with a 3-second visual countdown and live prompt cues (*"Cheese!"*, *"Smile!"*, *"Look at the Camera!"*, *"Pose!"*).
- **Physical Flash Effect**: Synchronized full-screen CSS flash animation simulating physical photobooth lighting on each capture.
- **Custom Aesthetic Frames**: Choice of 4 distinct overlay frames (Yellow, Classic Black, Blue & Green, Red & Blue) preserved across pages via `localStorage`.
- **Intelligent Centered Cropping**: Automatically computes crop bounds ($1030 \times 650$) based on webcam aspect ratio to ensure photos fit frame slots without distortion.
- **Client-Side Canvas Compositing**: Uses HTML5 Canvas 2D API (`source-over`) to stack snapshots vertically and overlay high-resolution graphic frames ($1280 \times 3000\text{px}$).
- **Instant High-Res PNG Download**: Direct one-click download (`snaplet-photobooth.png`) generated in-memory without server processing.
- **Privacy-First Architecture**: 100% client-side execution; camera streams and captured images are never uploaded to any remote server or third-party service.

---

## Tech Stack

- **HTML5**: Semantic markup, `<video>` capture element, and `<canvas>` graphics rendering.
- **CSS3**: Pure vanilla CSS, Flexbox layouts, keyframe animations, and responsive media queries.
- **JavaScript (ES6+)**: Client-side camera management, WebRTC (`getUserMedia`), Promises, and Canvas 2D API with zero external dependencies.
- **Google Fonts**: [Poppins](https://fonts.google.com/specimen/Poppins) typography.

---

## Local Setup

Modern web browsers require a secure context (`https://` or `http://localhost`) to access webcam hardware via `navigator.mediaDevices.getUserMedia`. Run Snaplet locally using any standard local web server:

### Option 1: Using Node.js
```bash
npx serve .
```
Then open `http://localhost:3000` in your web browser.

### Option 2: Using Python 3
```bash
python -m http.server 3000
```
Then open `http://localhost:3000` in your web browser.

### Option 3: Using VS Code Live Server
Open the project folder in Visual Studio Code, right-click `index.html`, and select **Open with Live Server**.

---

## Credits

<p align="center">
  <img src="img/logo-clario.png" alt="Clario Logo" width="80">
</p>

Snaplet was created and developed by **Clario**:
- **Evan Hendra Mulyadi** – Team Leader & Web Developer
- **Ivander Nathanael Thio** – Designer
- **Alden Kestian Pramono** – Designer

---

## Copyright & Ownership

© 2026 Clario. All Rights Reserved.

This repository is made publicly available for the sole purpose of viewing, learning from, and reviewing the source code. Public access does not grant permission to copy the entire project, rename or rebrand the software, remove original attributions, or claim it as your own creation.

No open-source license is granted. Any unauthorized reproduction, redistribution, or commercial use is strictly prohibited.

