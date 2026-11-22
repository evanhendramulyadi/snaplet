/* =========================================================
   GLOBAL FUNCTIONS & NAVIGATION
   ========================================================= */

// Navigate from Landing Page to Choose Frame
const startBtn = document.getElementById("startBtn");

if (startBtn) {
    startBtn.addEventListener("click", () => {
        window.location.href = "choose_frame.html";
    });
}

// Function to select a frame
// Called from onclick in HTML
function saveFrame(frameName) {
    localStorage.setItem("selectedFrame", frameName);
    window.location.href = "photobooth.html";
}


/* =========================================================
   PHOTOBOOTH LOGIC
   Only runs if photobooth elements exist
   ========================================================= */

const video = document.getElementById("video");
const tipsModal = document.getElementById("tipsModal");
const readyBtn = document.getElementById("readyBtn");

let cameraStream = null;
let photoCount = 0;

const maxPhotos = 4;
const capturedPhotos = [];

const captureTexts = [
    "Cheese!",
    "Smile!",
    "Look at the Camera!",
    "Pose!"
];


/* =========================================================
   UI ELEMENTS
   ========================================================= */

const instrTextElem = document.getElementById("captureInstructionText");
const countdownEl = document.getElementById("countdown");


/* =========================================================
   CAMERA SETUP
   ========================================================= */

async function setupCamera() {
    if (!video) return;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: { ideal: 1024 },
                height: { ideal: 768 }
            },
            audio: false
        });

        cameraStream = stream;
        video.srcObject = stream;

        video.onloadedmetadata = async () => {
            try {
                await video.play();
            } catch (err) {
                console.error("Failed to play video:", err);
            }
        };

    } catch (err) {
        cameraStream = null;
        console.error("Camera access failed:", err);
        // Camera failure does not immediately show an error to user.
        // Modal can still be dismissed by the Ready button.
    }
}


/* =========================================================
   READY BUTTON
   ========================================================= */

if (readyBtn) {
    readyBtn.addEventListener("click", () => {
        // Hide modal immediately
        if (tipsModal) {
            tipsModal.style.display = "none";
        }

        // Prevent button from being clicked multiple times
        readyBtn.disabled = true;

        // Only start photobooth if camera is active
        if (cameraStream && cameraStream.active) {
            startPhotoboothCycle();
        }
    });
}


/* =========================================================
   CAMERA INITIALIZATION
   ========================================================= */

if (video) {
    setupCamera();
}


/* =========================================================
   START PHOTO CYCLE
   ========================================================= */

function startPhotoboothCycle() {
    if (photoCount >= maxPhotos) {
        return;
    }

    // Ensure countdown element exists
    if (!countdownEl) {
        console.error("#countdown element not found.");
        return;
    }

    // Update instruction text
    if (instrTextElem) {
        instrTextElem.innerText = captureTexts[photoCount];
        instrTextElem.style.display = "block";
        instrTextElem.style.visibility = "visible";
    }

    // Countdown timer
    let timer = 3;
    countdownEl.innerText = timer;
    countdownEl.style.display = "flex";

    const countdownInterval = setInterval(() => {
        timer--;

        if (timer > 0) {
            countdownEl.innerText = timer;
        } else {
            clearInterval(countdownInterval);
            countdownEl.style.display = "none";

            // Capture photo
            takePhoto();
        }
    }, 1000);
}


/* =========================================================
   CAPTURE PHOTO
   ========================================================= */

function takePhoto() {
    if (!video) return;

    // Ensure camera video dimensions are available
    if (!video.videoWidth || !video.videoHeight) {
        console.error("Video dimensions not yet available.");

        // Retry after a short delay
        setTimeout(() => {
            takePhoto();
        }, 500);

        return;
    }

    /* -----------------------------------------------------
       1. FLASH EFFECT
       ----------------------------------------------------- */
    const flash = document.createElement("div");
    flash.className = "flash-effect";
    document.body.appendChild(flash);

    setTimeout(() => {
        flash.remove();
    }, 100);

    /* -----------------------------------------------------
       2. CANVAS SETUP
       ----------------------------------------------------- */
    const canvas = document.createElement("canvas");
    canvas.width = 1030;
    canvas.height = 650;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Canvas context not available.");
        return;
    }

    /* -----------------------------------------------------
       3. CROP LOGIC
       ----------------------------------------------------- */
    const videoW = video.videoWidth;
    const videoH = video.videoHeight;

    const targetRatio = 1030 / 650;
    const currentRatio = videoW / videoH;

    let sw, sh, sx, sy;

    if (currentRatio > targetRatio) {
        // Video is too wide: crop left and right
        sh = videoH;
        sw = videoH * targetRatio;
        sx = (videoW - sw) / 2;
        sy = 0;
    } else {
        // Video is too tall: crop top and bottom
        sw = videoW;
        sh = videoW / targetRatio;
        sx = 0;
        sy = (videoH - sh) / 2;
    }

    /* -----------------------------------------------------
       4. MIRRORING
       ----------------------------------------------------- */
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    /* -----------------------------------------------------
       5. DRAW CROPPED PHOTO
       ----------------------------------------------------- */
    ctx.drawImage(
        video,
        sx,
        sy,
        sw,
        sh,
        0,
        0,
        canvas.width,
        canvas.height
    );

    /* -----------------------------------------------------
       6. SAVE PHOTO
       ----------------------------------------------------- */
    const dataUrl = canvas.toDataURL("image/png");
    capturedPhotos.push(dataUrl);
    photoCount++;

    /* -----------------------------------------------------
       7. CHECK IF 4 PHOTOS REACHED
       ----------------------------------------------------- */
    if (photoCount < maxPhotos) {
        // Proceed to next photo
        setTimeout(() => {
            startPhotoboothCycle();
        }, 2000);
    } else {
        /* =================================================
           ALL PHOTOS COMPLETED
           ================================================= */

        /* -------------------------------------------------
           8. STOP CAMERA
           ------------------------------------------------- */
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => {
                track.stop();
            });
            cameraStream = null;
        }

        if (video) {
            video.srcObject = null;
        }

        /* -------------------------------------------------
           9. HIDE INSTRUCTION TEXT
           ------------------------------------------------- */
        if (instrTextElem) {
            // Use visibility to prevent layout shifts
            instrTextElem.style.visibility = "hidden";
        }

        /* -------------------------------------------------
           10. HIDE CAMERA CONTAINER
           ------------------------------------------------- */
        const cameraContainer = document.querySelector(".camera-container");
        if (cameraContainer) {
            cameraContainer.style.display = "none";
        }

        /* -------------------------------------------------
           11. DISPLAY LOADING OVERLAY
           ------------------------------------------------- */
        const loadingModal = document.getElementById("loadingModal");
        if (loadingModal) {
            loadingModal.style.display = "flex";
        }

        console.log("Loading active: compositing process started.");

        /* -------------------------------------------------
           12. PROCESS RESULT
           ------------------------------------------------- */
        setTimeout(() => {
            processResult();
        }, 3000);
    }
}


/* =========================================================
   PHOTO + FRAME COMPOSITING PROCESS
   ========================================================= */

function processResult() {
    console.log("Starting photo compositing process...");

    const canvas = document.getElementById("resultCanvas");
    if (!canvas) {
        console.error("#resultCanvas element not found.");
        showFinalResult();
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Canvas context not available.");
        showFinalResult();
        return;
    }

    /* -----------------------------------------------------
       1. RETRIEVE FRAME FROM LOCAL STORAGE
       ----------------------------------------------------- */
    let selectedFrame = localStorage.getItem("selectedFrame") || "frame-overlay-1";

    /* -----------------------------------------------------
       2. ENSURE PNG EXTENSION
       ----------------------------------------------------- */
    if (!selectedFrame.endsWith(".png")) {
        selectedFrame += ".png";
    }

    console.log("Looking for frame file:", selectedFrame);

    /* -----------------------------------------------------
       3. LOAD FRAME
       ----------------------------------------------------- */
    const frameImg = new Image();
    frameImg.src = `img/${selectedFrame}`;

    frameImg.onload = () => {
        console.log("Frame loaded successfully!");

        /* -------------------------------------------------
           4. SET CANVAS SIZE TO MATCH FRAME
           ------------------------------------------------- */
        canvas.width = frameImg.width;
        canvas.height = frameImg.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* -------------------------------------------------
           5. PHOTO POSITIONS WITHIN FRAME
           ------------------------------------------------- */
        const photoW = 1030;
        const photoH = 650;
        const xPos = (canvas.width - photoW) / 2;

        // Distance from top of frame to first photo
        const startY = 115;

        // Distance between photos
        const gap = 67;

        /* -------------------------------------------------
           6. DRAW 4 PHOTOS
           ------------------------------------------------- */
        const promises = capturedPhotos.map((photoData, index) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const yPos = startY + (index * (photoH + gap));
                    ctx.drawImage(img, xPos, yPos, photoW, photoH);
                    resolve();
                };
                img.onerror = reject;
                img.src = photoData;
            });
        });

        /* -------------------------------------------------
           7. AFTER ALL PHOTOS ARE DRAWN
           ------------------------------------------------- */
        Promise.all(promises)
            .then(() => {
                // Frame sits on top of photos
                ctx.globalCompositeOperation = "source-over";
                ctx.drawImage(frameImg, 0, 0);

                console.log("Compositing completed.");
                showFinalResult();
            })
            .catch((err) => {
                console.error("Failed to draw photo:", err);
                // Still show results so user is not stuck
                showFinalResult();
            });
    };

    /* -----------------------------------------------------
       8. IF FRAME IS NOT FOUND
       ----------------------------------------------------- */
    frameImg.onerror = () => {
        console.error("FRAME FILE NOT FOUND:", frameImg.src);
        alert("Error: File " + selectedFrame + " was not found!");

        const loadingModal = document.getElementById("loadingModal");
        if (loadingModal) {
            loadingModal.style.display = "none";
        }
    };
}


/* =========================================================
   DISPLAY RESULT SCREEN
   ========================================================= */

function showFinalResult() {
    const loadingModal = document.getElementById("loadingModal");
    if (loadingModal) {
        loadingModal.style.display = "none";
    }

    const resultArea = document.getElementById("resultArea");
    if (resultArea) {
        resultArea.style.display = "flex";
    }

    console.log("Results displayed!");
}


/* =========================================================
   PHOTO RESULT PROTECTION (DISABLE RIGHT-CLICK / SAVE AS)
   ========================================================= */

const resultCanvasElem = document.getElementById("resultCanvas");
if (resultCanvasElem) {
    resultCanvasElem.addEventListener("contextmenu", (e) => e.preventDefault());
}

const combinedResultContainer = document.getElementById("combinedResultContainer");
if (combinedResultContainer) {
    combinedResultContainer.addEventListener("contextmenu", (e) => e.preventDefault());
}


/* =========================================================
   DOWNLOAD BUTTON
   ========================================================= */

const downloadBtn = document.getElementById("downloadBtn");

if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
        const canvas = document.getElementById("resultCanvas");
        if (!canvas) {
            console.error("resultCanvas not found.");
            return;
        }

        const link = document.createElement("a");
        link.download = "snaplet-photobooth.png";
        link.href = canvas.toDataURL("image/png");
        link.click();

        console.log("Photo downloaded successfully.");
    });
}


/* =========================================================
   CLOSE BUTTON / RETURN TO HOME
   ========================================================= */

const closeBtn = document.getElementById("closeBtn");

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        // Remove selected frame
        localStorage.removeItem("selectedFrame");

        // Return to home page
        window.location.href = "index.html";
    });
}