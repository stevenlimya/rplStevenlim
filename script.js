function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (username && password) {
    // Simulasi validasi login
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("userRole").innerText = role.charAt(0).toUpperCase() + role.slice(1);
  } else {
    alert("Mohon isi semua kolom!");
  }
}

function showForm(type) {
  const container = document.getElementById("formContainer");
  if (type === "cuti") {
    container.innerHTML = `
      <h3>Form Pengajuan Cuti</h3>
      <input type="date" placeholder="Mulai Cuti"/>
      <input type="date" placeholder="Selesai Cuti"/>
      <textarea placeholder="Alasan"></textarea>
      <button>Ajukan Cuti</button>
    `;
  } else if (type === "kasbon") {
    container.innerHTML = `
      <h3>Form Pengajuan Kasbon</h3>
      <input type="number" min="0" max="5000000" placeholder="Jumlah" min="0" max="5000000"/>
      <textarea placeholder="Alasan"></textarea>
      <button>Ajukan Kasbon</button>
    `;
  } else if (type === "absen") {
    container.innerHTML = `
      <h3>Form Absensi</h3>
      <input type="date"/>
      <label><input type="checkbox" /> Hadir</label>
      <button>Simpan Absensi</button>
    `;
  }
}