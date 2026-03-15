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

const countdownEl = document.getElementById("countdown");
let photoCount = 0;
const maxPhotos = 4;
const capturedPhotos = []; // Array untuk menampung hasil foto

readyBtn.addEventListener("click", () => {
    // Cek apakah kamera sudah aktif
    // Jika srcObject null (kamera belum diizinkan), maka diem aja (nge-stuck)
    if (!video.srcObject) return;

    // Jika kamera aktif, baru jalankan ini
    tipsModal.style.display = "none";
    startPhotoboothCycle();
});

function startPhotoboothCycle() {
    if (photoCount < maxPhotos) {
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
                takePhoto();
            }
        }, 1000);
    }
}


function takePhoto() {
    // 1. Efek Flash
    const flash = document.createElement("div");
    flash.className = "flash-effect";
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 100);
    
    // 2. Ambil gambar dari video
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext("2d");
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 3. Simpan ke array
    const dataUrl = canvas.toDataURL("image/png");
    capturedPhotos.push(dataUrl);
    photoCount++;

    // 4. Logika Selesai
    if (photoCount < maxPhotos) {
        // Lanjut ke foto berikutnya
        setTimeout(startPhotoboothCycle, 2000);
    } else {
        // === SEMUA FOTO SELESAI ===

        // 1. Matikan aliran kamera
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }

        // 2. HILANGKAN BOX FOTO & ISINYA
        const cameraContainer = document.querySelector('.camera-container');
        if (cameraContainer) {
            cameraContainer.style.display = 'none';
        }

       // Munculkan Loading Murni (Tanpa Box)
        const loadingModal = document.getElementById('loadingModal');
        if (loadingModal) loadingModal.style.display = 'flex';

        console.log("Loading aktif: Hanya spinner dan teks.");
    }
}