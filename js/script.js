/**
 * FUNGSI GLOBAL & NAVIGASI
 */

// Pindah dari Landing Page ke Pilih Frame
const startBtn = document.getElementById("startBtn");
if (startBtn) {
    startBtn.addEventListener("click", () => {
        window.location.href = "choose_frame.html";
    });
}

// Fungsi untuk memilih frame (dipanggil dari onclick di HTML)
function saveFrame(frameName) {
    localStorage.setItem("selectedFrame", frameName);
    window.location.href = "photobooth.html";
}

/**
 * LOGIKA PHOTOBOOTH (Hanya jalan di photobooth.html)
 */
const video = document.getElementById("video");
const tipsModal = document.getElementById("tipsModal");
const readyBtn = document.getElementById("readyBtn");

// Fungsi untuk menyalakan kamera
async function setupCamera() {
    const constraints = {
        video: {
            // Minta rasio 4:3 ke browser
            aspectRatio: { ideal: 1.3333333333 }, 
            width: { ideal: 1280 },
            height: { ideal: 960 }
        },
        audio: false
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        
        video.onloadedmetadata = () => {
            video.play();
        };
    } catch (err) {
        console.error("Gagal akses kamera: ", err);
    }
}

// Logika menutup modal Tips
if (readyBtn && tipsModal) {
    readyBtn.addEventListener("click", () => {
        tipsModal.style.display = "none";
        console.log("User siap, modal ditutup.");
        // Di sini nanti tempat trigger countdown
    });
}

// Inisialisasi kamera jika elemen video ada
if (video) {
    setupCamera();
}