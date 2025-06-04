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
  const role = document.getElementById("role").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.username === username && u.password === password && u.role === role);

  if (user) {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("userRole").innerText = role.charAt(0).toUpperCase() + role.slice(1);
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

  // Hapus semua class form-* jika ada
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

