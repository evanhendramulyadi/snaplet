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
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: { ideal: 1024 }, height: { ideal: 768 } },
            audio: false
        });
        cameraStream = stream; // Simpan stream di sini
        video.srcObject = stream;
        video.onloadedmetadata = () => video.play();
    } catch (err) {
        cameraStream = null; // Gagal, stream tetap null
    }
}

// Logika menutup modal Tips
if (readyBtn) {
    readyBtn.addEventListener('click', () => {
        // DIAM SAJA JIKA KAMERA BELUM SIAP
        if (!cameraStream || !cameraStream.active) {
            return; // Keluar dari fungsi tanpa melakukan apa-apa
        }

        // Jalankan hanya jika kamera sudah OK
        if (tipsModal) tipsModal.style.display = 'none';
        startPhotoboothCycle(); 
    });
}

// Inisialisasi kamera jika elemen video ada
if (video) {
    setupCamera();
}


const instrTextElem = document.getElementById('captureInstructionText'); 
const countdownEl = document.getElementById("countdown");

let cameraStream = null; // Tambahkan ini di deretan variabel global paling atas
let photoCount = 0;
const maxPhotos = 4;
const capturedPhotos = [];

const captureTexts = [
    "Cheese!",
    "Smile!",
    "Look At The Camera!",
    "Pose!"
];

function startPhotoboothCycle() {
    const instrTextElem = document.getElementById('captureInstructionText');
    const countdownEl = document.getElementById('countdown'); // Pastikan ID sesuai

    if (photoCount < maxPhotos) {
        // 1. UPDATE TEKS INSTRUKSI DULU
        if (instrTextElem) {
            instrTextElem.innerText = captureTexts[photoCount];
            instrTextElem.style.display = 'block';
        }

        // 2. LOGIKA COUNTDOWN
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
                
                // 3. AMBIL FOTO
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

// 2. SEMBUNYIKAN TEKS TAPI TETAP JAGA RUANGNYA (Penting!)
if (instrTextElem) {
    instrTextElem.style.visibility = 'hidden'; 
    // Pakai visibility agar layout tidak "loncat" naik
}

// 3. HILANGKAN BOX FOTO & ISINYA
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