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

        // 5. PANGGIL PROSES GABUNG FOTO (Beri jeda 3 detik agar loading terlihat)
        setTimeout(() => {
            processResult(); 
        }, 3000);
    }
}



function processResult() {
    console.log("Memulai proses penggabungan foto...");
    const canvas = document.getElementById('resultCanvas');
    const ctx = canvas.getContext('2d');
    
    const selectedFrame = localStorage.getItem("selectedFrame") || "frame-overlay-1.png"; 
    console.log("Frame yang digunakan:", selectedFrame);

    const frameImg = new Image();
    frameImg.src = `img/${selectedFrame}`; 

    frameImg.onload = () => {
        console.log("Frame berhasil dimuat. Ukuran:", frameImg.width, "x", frameImg.height);
        canvas.width = frameImg.width;
        canvas.height = frameImg.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const photoW = 380;   
        const photoH = 280;   
        const xPos = (canvas.width - photoW) / 2; 
        const startY = 65;    
        const gap = 25;       

        console.log("Memproses", capturedPhotos.length, "foto...");

        const promises = capturedPhotos.map((photoData, index) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const yPos = startY + (index * (photoH + gap));
                    ctx.drawImage(img, xPos, yPos, photoW, photoH);
                    console.log(`Foto ke-${index + 1} berhasil digambar.`);
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Gagal memuat data foto ke-${index + 1}`);
                    reject();
                };
                img.src = photoData;
            });
        });

        Promise.all(promises)
            .then(() => {
                console.log("Semua foto selesai digambar. Menimpa dengan frame...");
                ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(frameImg, 0, 0);
                console.log("Proses selesai. Memanggil showFinalResult().");
                showFinalResult();
            })
            .catch(err => {
                console.error("Terjadi error saat menggambar foto:", err);
                showFinalResult();
            });
    };

    frameImg.onerror = () => {
        console.error("GAGAL MEMUAT FRAME! Periksa path: img/" + selectedFrame);
        alert("File frame tidak ditemukan: img/" + selectedFrame);
        document.getElementById('loadingModal').style.display = 'none';
    };
}