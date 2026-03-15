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
    if (!video) return;

    try {
        const constraints = {
            video: {
                facingMode: "user",
                width: { ideal: 1024 }, 
                height: { ideal: 768 }
            },
            audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            video.play();
        };
    } catch (err) {
        // Gagal diam saja tanpa notif
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