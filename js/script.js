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
let cameraStream = null; // Tambahkan ini di deretan variabel global paling atas
let photoCount = 0;
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
// 3. Logika Tombol Ready
if (readyBtn) {
    readyBtn.addEventListener('click', () => {
        // 1. Modal LANGSUNG HILANG saat diklik (walau kamera mati/nyala)
        if (tipsModal) {
            tipsModal.style.display = 'none';
        }

        // 2. CEK KAMERA: Hanya mulai proses foto kalau kamera aktif
        if (cameraStream && cameraStream.active) {
            startPhotoboothCycle(); 
        } 
        
        // Jika kamera mati, kode berhenti di sini. 
        // Hasilnya: Modal hilang, tapi layar cuma diam (ngestak).
    });
}
// Inisialisasi kamera jika elemen video ada
if (video) {
    setupCamera();
}


const instrTextElem = document.getElementById('captureInstructionText'); 
const countdownEl = document.getElementById("countdown");


const maxPhotos = 4;
const capturedPhotos = [];

const captureTexts = [
    "Cheese!",
    "Smile!",
    "Look at the Camera!",
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

        // 4. PANGGIL PROSES GABUNG FOTO
        // Jangan panggil showFinalResult di sini! Biarkan processResult yang panggil nanti.
        setTimeout(() => {
            processResult(); 
        }, 3000);
    }
    }

function processResult() {
    console.log("Memulai proses penggabungan foto...");
    const canvas = document.getElementById('resultCanvas');
    const ctx = canvas.getContext('2d');
    
    // 1. Ambil nama frame dari localStorage
    let selectedFrame = localStorage.getItem("selectedFrame") || "frame-overlay-1"; 
    
    // 2. Pastikan ada ekstensi .png
    if (!selectedFrame.endsWith('.png')) {
        selectedFrame += '.png';
    }
    
    console.log("Mencari file frame:", selectedFrame);

    const frameImg = new Image();
    frameImg.src = `img/${selectedFrame}`; 

    frameImg.onload = () => {
        console.log("Frame Berhasil Dimuat!");
        // Set ukuran canvas sesuai ukuran file frame asli
        canvas.width = frameImg.width;
        canvas.height = frameImg.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Pengaturan posisi foto di dalam frame (sesuaikan koordinat ini jika perlu)
        // --- Pengaturan Khusus Frame Windows XP Vertikal ---

const photoW = 800;   // Diperlebar agar mengisi kotak putih sepenuhnya
const photoH = 550;   // Ditinggikan agar menutupi area hitam/putih yang kosong
const xPos = (canvas.width - photoW) / 2; 

// Jarak dari atas frame ke lubang pertama
const startY = 115;    

// Jarak antar lubang (gap yang pas untuk frame ini cukup besar)
const gap = 85;     

        // 3. Proses menggambar 4 foto satu per satu
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

        // 4. Setelah semua foto SELESAI digambar, baru tempel frame dan buka hasil
        Promise.all(promises)
            .then(() => {
                // Gambar frame di atas foto (overlay)
                ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(frameImg, 0, 0);
                
                console.log("Penggabungan selesai. Memanggil showFinalResult...");
                
                // === INI PEMANGGILANNYA ===
                showFinalResult(); 
            })
            .catch(err => {
                console.error("Gagal menggambar foto", err);
                showFinalResult(); // Tetap panggil agar user tidak stuck di loading
            });
    };

    frameImg.onerror = () => {
        console.error("FILE FRAME TIDAK DITEMUKAN: " + frameImg.src);
        alert("Error: File " + selectedFrame + " tidak ditemukan!");
        // Jika file frame hilang, tutup loading agar tidak stak
        const loadingModal = document.getElementById('loadingModal');
        if (loadingModal) loadingModal.style.display = 'none';
    };
}

// 6. Tampilkan Layar Akhir (INI YANG TADI HILANG)
function showFinalResult() {
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) loadingModal.style.display = 'none';

    const resultArea = document.getElementById('resultArea');
    if (resultArea) resultArea.style.display = 'flex'; 
    console.log("Hasil ditampilkan!");
}


// --- LOGIKA TOMBOL HASIL ---

// 1. Fungsi Download
const downloadBtn = document.getElementById("downloadBtn");
if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
        const canvas = document.getElementById("resultCanvas");
        if (canvas) {
            const link = document.createElement("a");
            link.download = "snaplet-photobooth.png"; // Nama file saat didownload
            link.href = canvas.toDataURL("image/png");
            link.click();
            console.log("Foto berhasil didownload.");
        }
    });
}

// 2. Fungsi Close (Kembali ke Home)
const closeBtn = document.getElementById("closeBtn");
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        // Hapus data pilihan frame agar bersih saat mulai lagi
        localStorage.removeItem("selectedFrame");
        // Pindah ke halaman awal (sesuaikan namanya jika bukan index.html)
        window.location.href = "index.html"; 
    });
}