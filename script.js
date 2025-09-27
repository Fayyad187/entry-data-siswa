// script.js
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxg8Pw1RcMdpj_TUa5rlT9-BfDgcwGvEpkKG6EAZFPoRaJZ2w1FoMzJuMe0m2_pt3xD-g/exec"; // <-- ganti dengan URL Apps Script

const form = document.getElementById("studentForm");
const feedback = document.getElementById("feedback");

function showMessage(type, text) {
  feedback.className = "feedback " + (type === "success" ? "success" : "error");
  feedback.textContent = text;
  // otomatis hilang setelah 5 detik
  setTimeout(() => {
    feedback.className = "feedback";
    feedback.textContent = "";
  }, 5000);
}

function validateForm(data) {
  // Validasi beberapa field penting
  if (!data.nama || data.nama.trim().length < 3) return "Nama harus diisi minimal 3 karakter.";
  if (!data.nisn || !/^\d{5,12}$/.test(data.nisn)) return "NISN harus angka (5–12 digit).";
  if (!data.kelas || data.kelas.trim() === "") return "Kelas harus diisi.";
  if (!data.jurusan || data.jurusan.trim() === "") return "Jurusan harus diisi.";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Format email tidak valid.";
  return null;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const payload = {
    nama: formData.get("nama"),
    nisn: formData.get("nisn"),
    nik: formData.get("nik"),
    jk: formData.get("jk"),
    tempat_lahir: formData.get("tempat_lahir"),
    tanggal_lahir: formData.get("tanggal_lahir"),
    kelas: formData.get("kelas"),
    jurusan: formData.get("jurusan"),
    alamat: formData.get("alamat"),
    hp: formData.get("hp"),
    email: formData.get("email"),
    tahun_masuk: formData.get("tahun_masuk")
  };

  const err = validateForm(payload);
  if (err) {
    showMessage("error", err);
    return;
  }

  try {
    // show loading
    const originalBtn = document.querySelector(".btn-primary").textContent;
    document.querySelector(".btn-primary").textContent = "Mengirim...";
    document.querySelector(".btn-primary").disabled = true;

    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload),
      mode: "cors"
    });

    const json = await res.json();

    if (res.ok && json.status === "success") {
      showMessage("success", "✅ Data berhasil dikirim ke spreadsheet.");
      form.reset();
    } else {
      showMessage("error", "Terjadi masalah saat mengirim: " + (json.message || res.statusText));
    }
  } catch (err) {
    showMessage("error", "Gagal mengirim data: " + err.message);
  } finally {
    document.querySelector(".btn-primary").textContent = originalBtn;
    document.querySelector(".btn-primary").disabled = false;
  }
});
