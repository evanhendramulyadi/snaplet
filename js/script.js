/* =========================================================
   FUNGSI GLOBAL & NAVIGASI
   ========================================================= */

// Pindah dari Landing Page ke Pilih Frame
const startBtn = document.getElementById("startBtn");

if (startBtn) {
    startBtn.addEventListener("click", () => {
        window.location.href = "choose_frame.html";
    });
}

// Fungsi untuk memilih frame
// Dipanggil dari onclick di HTML
function saveFrame(frameName) {
    localStorage.setItem("selectedFrame", frameName);
    window.location.href = "photobooth.html";
}


/* =========================================================
   LOGIKA PHOTOBOOTH
   Hanya berjalan jika elemen photobooth tersedia
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
   ELEMEN UI
   ========================================================= */

const instrTextElem = document.getElementById("captureInstructionText");
const countdownEl = document.getElementById("countdown");


/* =========================================================
   SETUP KAMERA
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
                console.error("Gagal menjalankan video:", err);
            }
        };

    } catch (err) {
        cameraStream = null;

        console.error("Kamera tidak dapat diakses:", err);

        // Kamera gagal tidak langsung memunculkan error ke user.
        // Modal tetap bisa ditutup oleh tombol Ready.
    }
}


/* =========================================================
   TOMBOL READY
   ========================================================= */

if (readyBtn) {
    readyBtn.addEventListener("click", () => {

        // Modal langsung hilang
        if (tipsModal) {
            tipsModal.style.display = "none";
        }

        // Cegah tombol ditekan berkali-kali
        readyBtn.disabled = true;

        // Hanya mulai photobooth jika kamera aktif
        if (cameraStream && cameraStream.active) {
            startPhotoboothCycle();
        }
    });
}


/* =========================================================
   INISIALISASI KAMERA
   ========================================================= */

if (video) {
    setupCamera();
}


/* =========================================================
   MEMULAI SIKLUS FOTO
   ========================================================= */

function startPhotoboothCycle() {

    if (photoCount >= maxPhotos) {
        return;
    }

    // Pastikan elemen countdown tersedia
    if (!countdownEl) {
        console.error("Elemen #countdown tidak ditemukan.");
        return;
    }

    // Update teks instruksi
    if (instrTextElem) {
        instrTextElem.innerText = captureTexts[photoCount];
        instrTextElem.style.display = "block";
        instrTextElem.style.visibility = "visible";
    }

    // Countdown
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

            // Ambil foto
            takePhoto();
        }

    }, 1000);
}


/* =========================================================
   MENGAMBIL FOTO
   ========================================================= */

function takePhoto() {

    if (!video) return;

    // Pastikan kamera memiliki ukuran video
    if (!video.videoWidth || !video.videoHeight) {
        console.error("Ukuran video belum tersedia.");

        // Coba lagi setelah sebentar
        setTimeout(() => {
            takePhoto();
        }, 500);

        return;
    }


    /* -----------------------------------------------------
       1. EFEK FLASH
       ----------------------------------------------------- */

    const flash = document.createElement("div");

    flash.className = "flash-effect";

    document.body.appendChild(flash);

    setTimeout(() => {
        flash.remove();
    }, 100);


    /* -----------------------------------------------------
       2. SETUP CANVAS
       ----------------------------------------------------- */

    const canvas = document.createElement("canvas");

    canvas.width = 1030;
    canvas.height = 650;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Canvas context tidak tersedia.");
        return;
    }


    /* -----------------------------------------------------
       3. LOGIKA CROP
       ----------------------------------------------------- */

    const videoW = video.videoWidth;
    const videoH = video.videoHeight;

    const targetRatio = 1030 / 650;
    const currentRatio = videoW / videoH;

    let sw;
    let sh;
    let sx;
    let sy;

    if (currentRatio > targetRatio) {

        // Video terlalu lebar
        // Potong bagian kiri dan kanan

        sh = videoH;
        sw = videoH * targetRatio;

        sx = (videoW - sw) / 2;
        sy = 0;

    } else {

        // Video terlalu tinggi
        // Potong bagian atas dan bawah

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
       5. GAMBAR FOTO HASIL CROP
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
       6. SIMPAN FOTO
       ----------------------------------------------------- */

    const dataUrl = canvas.toDataURL("image/png");

    capturedPhotos.push(dataUrl);

    photoCount++;


    /* -----------------------------------------------------
       7. CEK APAKAH SUDAH 4 FOTO
       ----------------------------------------------------- */

    if (photoCount < maxPhotos) {

        // Lanjut foto berikutnya
        setTimeout(() => {
            startPhotoboothCycle();
        }, 2000);

    } else {

        /* =================================================
           SEMUA FOTO SELESAI
           ================================================= */


        /* -------------------------------------------------
           8. MATIKAN KAMERA
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
           9. SEMBUNYIKAN TEKS INSTRUKSI
           ------------------------------------------------- */

        if (instrTextElem) {
            // visibility agar layout tidak meloncat
            instrTextElem.style.visibility = "hidden";
        }


        /* -------------------------------------------------
           10. HILANGKAN CAMERA CONTAINER
           ------------------------------------------------- */

        const cameraContainer =
            document.querySelector(".camera-container");

        if (cameraContainer) {
            cameraContainer.style.display = "none";
        }


        /* -------------------------------------------------
           11. TAMPILKAN LOADING
           ------------------------------------------------- */

        const loadingModal =
            document.getElementById("loadingModal");

        if (loadingModal) {
            loadingModal.style.display = "flex";
        }

        console.log(
            "Loading aktif: proses penggabungan foto dimulai."
        );


        /* -------------------------------------------------
           12. PROSES HASIL
           ------------------------------------------------- */

        setTimeout(() => {
            processResult();
        }, 3000);
    }
}


/* =========================================================
   PROSES PENGGABUNGAN FOTO + FRAME
   ========================================================= */

function processResult() {

    console.log("Memulai proses penggabungan foto...");

    const canvas = document.getElementById("resultCanvas");

    if (!canvas) {
        console.error("Elemen #resultCanvas tidak ditemukan.");
        showFinalResult();
        return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Canvas context tidak tersedia.");
        showFinalResult();
        return;
    }


    /* -----------------------------------------------------
       1. AMBIL FRAME DARI LOCAL STORAGE
       ----------------------------------------------------- */

    let selectedFrame =
        localStorage.getItem("selectedFrame") ||
        "frame-overlay-1";


    /* -----------------------------------------------------
       2. PASTIKAN ADA EKSTENSI PNG
       ----------------------------------------------------- */

    if (!selectedFrame.endsWith(".png")) {
        selectedFrame += ".png";
    }

    console.log(
        "Mencari file frame:",
        selectedFrame
    );


    /* -----------------------------------------------------
       3. LOAD FRAME
       ----------------------------------------------------- */

    const frameImg = new Image();

    frameImg.src = `img/${selectedFrame}`;


    frameImg.onload = () => {

        console.log("Frame berhasil dimuat!");


        /* -------------------------------------------------
           4. SET UKURAN CANVAS SESUAI FRAME
           ------------------------------------------------- */

        canvas.width = frameImg.width;
        canvas.height = frameImg.height;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* -------------------------------------------------
           5. POSISI FOTO DALAM FRAME
           ------------------------------------------------- */

        const photoW = 1030;
        const photoH = 650;

        const xPos =
            (canvas.width - photoW) / 2;

        // Jarak dari atas frame ke foto pertama
        const startY = 115;

        // Jarak antar foto
        const gap = 67;


        /* -------------------------------------------------
           6. GAMBAR 4 FOTO
           ------------------------------------------------- */

        const promises = capturedPhotos.map(
            (photoData, index) => {

                return new Promise(
                    (resolve, reject) => {

                        const img = new Image();

                        img.onload = () => {

                            const yPos =
                                startY +
                                (index * (photoH + gap));

                            ctx.drawImage(
                                img,
                                xPos,
                                yPos,
                                photoW,
                                photoH
                            );

                            resolve();
                        };

                        img.onerror = reject;

                        img.src = photoData;
                    }
                );
            }
        );


        /* -------------------------------------------------
           7. SETELAH SEMUA FOTO SELESAI
           ------------------------------------------------- */

        Promise.all(promises)

            .then(() => {

                // Frame berada di atas foto
                ctx.globalCompositeOperation =
                    "source-over";

                ctx.drawImage(
                    frameImg,
                    0,
                    0
                );

                console.log(
                    "Penggabungan selesai."
                );

                showFinalResult();
            })

            .catch((err) => {

                console.error(
                    "Gagal menggambar foto:",
                    err
                );

                // Tetap tampilkan hasil
                // agar user tidak stuck
                showFinalResult();
            });
    };


    /* -----------------------------------------------------
       8. JIKA FRAME TIDAK DITEMUKAN
       ----------------------------------------------------- */

    frameImg.onerror = () => {

        console.error(
            "FILE FRAME TIDAK DITEMUKAN:",
            frameImg.src
        );

        alert(
            "Error: File " +
            selectedFrame +
            " tidak ditemukan!"
        );


        const loadingModal =
            document.getElementById("loadingModal");

        if (loadingModal) {
            loadingModal.style.display = "none";
        }
    };
}


/* =========================================================
   TAMPILKAN LAYAR HASIL
   ========================================================= */

function showFinalResult() {

    const loadingModal =
        document.getElementById("loadingModal");

    if (loadingModal) {
        loadingModal.style.display = "none";
    }


    const resultArea =
        document.getElementById("resultArea");

    if (resultArea) {
        resultArea.style.display = "flex";
    }

    console.log("Hasil ditampilkan!");
}


/* =========================================================
   TOMBOL DOWNLOAD
   ========================================================= */

const downloadBtn =
    document.getElementById("downloadBtn");

if (downloadBtn) {

    downloadBtn.addEventListener("click", () => {

        const canvas =
            document.getElementById("resultCanvas");

        if (!canvas) {
            console.error(
                "resultCanvas tidak ditemukan."
            );
            return;
        }


        const link =
            document.createElement("a");

        link.download =
            "snaplet-photobooth.png";

        link.href =
            canvas.toDataURL("image/png");

        link.click();

        console.log(
            "Foto berhasil didownload."
        );
    });
}


/* =========================================================
   TOMBOL CLOSE / KEMBALI KE HOME
   ========================================================= */

const closeBtn =
    document.getElementById("closeBtn");

if (closeBtn) {

    closeBtn.addEventListener("click", () => {

        // Hapus frame yang dipilih
        localStorage.removeItem(
            "selectedFrame"
        );

        // Kembali ke halaman awal
        window.location.href =
            "index.html";
    });
}