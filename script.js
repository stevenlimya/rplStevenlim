function togglePage(page) {
  const loginPage = document.getElementById("loginPage");
  const registerPage = document.getElementById("registerPage");

  if (page === "register") {
    loginPage.classList.add("hidden");
    registerPage.classList.remove("hidden");
  } else {
    registerPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
  }
}

function register() {
  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const role = document.getElementById("newRole").value;

  if (username && password) {
    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find(user => user.username === username)) {
      alert("Username sudah terdaftar!");
      return;
    }

    users.push({ username, password, role });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registrasi berhasil! Silakan login.");
    togglePage('login');
  } else {
    alert("Mohon isi semua kolom!");
  }
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const selectedRole = document.getElementById("role").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const user = users.find(u =>
    u.username === username &&
    u.password === password &&
    (
      (selectedRole === "admin" || selectedRole === "manajer")
        ? (u.role === "admin" || u.role === "manajer")
        : u.role === selectedRole
    )
  );

  if (user) {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    const displayRole = (user.role === "admin" || user.role === "manajer") ? "Admin/Manajer" : selectedRole;
    document.getElementById("userRole").innerText = displayRole;

    if (user.role === "admin" || user.role === "manajer") {
      document.getElementById("adminTools").classList.remove("hidden");
    } else {
      document.getElementById("adminTools").classList.add("hidden");
    }
  } else {
    alert("Login gagal! Periksa kembali username, password, dan role Anda.");
  }
}

function showAlert(message) {
  const alertBox = document.getElementById("alertBox");
  alertBox.innerText = message;
  alertBox.classList.remove("hidden");

  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 3000);
}

function showForm(type) {
  const container = document.getElementById("formContainer");
  container.classList.remove("form-absen", "form-cuti", "form-kasbon");

  let formHTML = `<div id="alertBox" class="alert hidden"></div>`;

  if (type === "cuti") {
    container.classList.add("form-cuti");
    formHTML += `
      <h3>Form Pengajuan Cuti</h3>
      <input type="date" placeholder="Mulai Cuti"/>
      <input type="date" placeholder="Selesai Cuti"/>
      <textarea placeholder="Alasan"></textarea>
      <button onclick="showAlert('Berhasil Mengajukan Cuti!')">Ajukan Cuti</button>
    `;
  } else if (type === "kasbon") {
    container.classList.add("form-kasbon");
    formHTML += `
      <h3>Form Pengajuan Kasbon</h3>
      <input type="number" min="0" max="5000000" placeholder="Jumlah"/>
      <textarea placeholder="Alasan"></textarea>
      <button onclick="showAlert('Berhasil Mengajukan Kasbon!')">Ajukan Kasbon</button>
    `;
  } else if (type === "absen") {
    container.classList.add("form-absen");
    formHTML += `
      <h3>Form Absensi</h3>
      <input type="date"/>
      <label><input type="checkbox" /> Hadir</label>
      <button onclick="showAlert('Berhasil Meng-absen!')">Simpan Absensi</button>
    `;
  }

  container.innerHTML = formHTML;
}

function showAdminPanel(type) {
  const container = document.getElementById("formContainer");
  container.classList.remove("form-absen", "form-cuti", "form-kasbon");

  let html = `<div id="alertBox" class="alert hidden"></div>`;

  if (type === "absensi") {
    html += `
      <h3>Kelola Data Absensi</h3>
      <input type="text" placeholder="Nama Karyawan"/>
      <select>
        <option>Hadir</option>
        <option>Izin</option>
        <option>Alpha</option>
      </select>
      <button onclick="showAlert('Data Absensi Diperbarui')">Simpan Perubahan</button>
    `;
  } else if (type === "cuti") {
    html += `
      <h3>Persetujuan Cuti</h3>
      <strong>Nama:</strong> Agus<br>
      <strong>Tanggal:</strong> 12–14 Juni<br>
      <button onclick="showAlert('Cuti Disetujui')">Setujui</button>
      <button onclick="showAlert('Cuti Ditolak')">Tolak</button>
    `;
  } else if (type === "kasbon") {
    html += `
      <h3>Persetujuan Kasbon</h3>
      <strong>Nama:</strong> Dina<br>
      <strong>Jumlah:</strong> Rp 1.000.000<br>
      <button onclick="showAlert('Kasbon Disetujui')">Setujui</button>
      <button onclick="showAlert('Kasbon Ditolak')">Tolak</button>
    `;
  }

  container.innerHTML = html;
}


