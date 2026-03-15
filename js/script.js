document.getElementById("startBtn").addEventListener("click", function () {
  // Pindah ke halaman choose_frame
  window.location.href = "choose_frame.html";
});

const video = document.getElementById("video");
const tipsModal = document.getElementById("tipsModal");
const readyBtn = document.getElementById("readyBtn");

// Fungsi utama untuk menyalakan kamera
async function setupCamera() {
  // Kita gunakan konfigurasi paling simpel agar support semua perangkat
  const constraints = {
    video: true, // Ambil kamera default yang tersedia
    audio: false,
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    // Memastikan video diputar setelah stream didapat
    video.onloadedmetadata = () => {
      video.play();
    };

    console.log("Kamera berhasil terhubung!");
  } catch (err) {
    console.error("Gagal akses kamera: ", err);
    // Jika gagal karena masalah teknis, beri tahu user
    alert(
      "Kamera tidak ditemukan. Pastikan izin sudah diberikan dan kamera tidak dipakai aplikasi lain.",
    );
  }
}

// Logika tombol Ready (tutup notif saja dulu)
readyBtn.addEventListener("click", () => {
  tipsModal.style.display = "none";
  console.log("User siap, modal ditutup.");
});

// Jalankan kamera otomatis saat halaman dibuka
setupCamera();

function saveFrame(frameName) {
  // Menyimpan pilihan frame ke LocalStorage agar bisa dipanggil di photobooth.html
  localStorage.setItem("selectedFrame", frameName);

  // Berpindah ke halaman photobooth
  window.location.href = "photobooth.html";
}
