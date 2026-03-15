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
    // Efek Flash Putih
    const flash = document.createElement("div");
    flash.className = "flash-effect";
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 100);

    // Proses ambil gambar dari video ke canvas
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext("2d");
    
    // Mirror mode
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    capturedPhotos.push(dataUrl);
    
    photoCount++;
    
    if (photoCount < maxPhotos) {
        // Jeda untuk ganti gaya
        setTimeout(startPhotoboothCycle, 2000);
    } else {
        // === SEMUA FOTO SELESAI ===
        // 1. Matikan stream kamera (opsional, biar icon kamera di browser hilang)
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }

        // 2. Tampilkan Layar Loading (Gambar 1)
        const loadingModal = document.getElementById('loadingModal');
        if (loadingModal) loadingModal.style.display = 'flex';

        // 3. Proses penggabungan ke frame (kasih jeda biar loading terasa asli)
        setTimeout(processFinalImage, 2000);
    }
}

function processFinalImage() {
    const finalCanvas = document.createElement("canvas");
    // Ukuran strip (misal: lebar 800px, tinggi 2400px)
    finalCanvas.width = 800;  
    finalCanvas.height = 2400; 
    const ctx = finalCanvas.getContext("2d");

    // Ambil nama frame dari localStorage
    const frameName = localStorage.getItem("selectedFrame") || "frame-overlay-1";
    const frameImg = new Image();
    frameImg.src = `img/${frameName}.png`; 
    
    frameImg.onload = () => {
        // 1. Gambar Frame sebagai background utama
        ctx.drawImage(frameImg, 0, 0, finalCanvas.width, finalCanvas.height);

        let loadedPhotos = 0;
        capturedPhotos.forEach((photoUrl, index) => {
            const img = new Image();
            img.src = photoUrl;
            img.onload = () => {
                // Tentukan posisi foto (X, Y, Lebar, Tinggi)
                // Sesuaikan koordinat ini dengan desain bolongan frame kamu
                const xPos = 60; 
                const yPos = 70 + (index * 545); 
                const imgWidth = 680;
                const imgHeight = 510; // Rasio 4:3

                // Taruh foto di belakang frame agar rapi
                ctx.globalCompositeOperation = 'destination-over';
                ctx.drawImage(img, xPos, yPos, imgWidth, imgHeight);
                ctx.globalCompositeOperation = 'source-over';
                
                loadedPhotos++;

                // Jika sudah semua foto "dijahit" ke canvas
                if (loadedPhotos === maxPhotos) {
                    const finalDataUrl = finalCanvas.toDataURL("image/png");
                    
                    // Tampilkan di preview
                    const framePreview = document.getElementById('framePreview');
                    const finalImgElement = new Image();
                    finalImgElement.src = finalDataUrl;
                    framePreview.innerHTML = '';
                    framePreview.appendChild(finalImgElement);

                    // Sembunyikan Loading, Tampilkan Hasil (Gambar 2)
                    document.getElementById('loadingModal').style.display = 'none';
                    document.getElementById('resultModal').style.display = 'flex';

                    // Siapkan fungsi download
                    document.getElementById('downloadBtn').onclick = () => {
                        const link = document.createElement('a');
                        link.href = finalDataUrl;
                        link.download = `Snaplet-${Date.now()}.png`;
                        link.click();
                    };
                }
            };
        });
    };
}