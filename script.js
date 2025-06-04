// script.js
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
    sessionStorage.setItem("loggedInUser", user.username);
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

function getLoggedInUsername() {
  return sessionStorage.getItem("loggedInUser") || "Tidak dikenal";
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
      <button onclick="ajukanCuti()">Ajukan Cuti</button>
    `;
  } else if (type === "kasbon") {
    container.classList.add("form-kasbon");
    formHTML += `
      <h3>Form Pengajuan Kasbon</h3>
      <input type="number" min="0" max="5000000" placeholder="Jumlah"/>
      <textarea placeholder="Alasan"></textarea>
      <button onclick="ajukanKasbon()">Ajukan Kasbon</button>
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

function ajukanCuti() {
  const mulai = document.querySelector('input[placeholder="Mulai Cuti"]').value;
  const selesai = document.querySelector('input[placeholder="Selesai Cuti"]').value;
  const alasan = document.querySelector('textarea').value;

  if (!mulai || !selesai || !alasan) return alert("Lengkapi semua data cuti!");

  const data = JSON.parse(localStorage.getItem("cuti") || "[]");
  data.push({ nama: getLoggedInUsername(), mulai, selesai, alasan, status: "Menunggu" });
  localStorage.setItem("cuti", JSON.stringify(data));
  showAlert("Pengajuan cuti berhasil dikirim!");
}

function ajukanKasbon() {
  const jumlah = document.querySelector('input[type="number"]').value;
  const alasan = document.querySelector('textarea').value;

  if (!jumlah || !alasan) return alert("Lengkapi semua data kasbon!");

  const data = JSON.parse(localStorage.getItem("kasbon") || "[]");
  data.push({ nama: getLoggedInUsername(), jumlah, alasan, status: "Menunggu" });
  localStorage.setItem("kasbon", JSON.stringify(data));
  showAlert("Pengajuan kasbon berhasil dikirim!");
}

function showAdminPanel(type) {
  if (type === "cuti") return renderCutiAdmin();
  if (type === "kasbon") return renderKasbonAdmin();

  const container = document.getElementById("formContainer");
  container.innerHTML = `
    <h3>Kelola Data Absensi</h3>
    <input type="text" placeholder="Nama Karyawan"/>
    <select>
      <option>Hadir</option>
      <option>Izin</option>
      <option>Alpha</option>
    </select>
    <button onclick="showAlert('Data Absensi Diperbarui')">Simpan Perubahan</button>
  `;
}

function renderCutiAdmin() {
  const container = document.getElementById("formContainer");
  const data = JSON.parse(localStorage.getItem("cuti") || "[]");

  let html = `<h3>Daftar Pengajuan Cuti</h3>`;
  data.forEach((item, index) => {
    html += `
      <div class="form-cuti" style="margin-bottom: 15px">
        <p><strong>${item.nama}</strong> | ${item.mulai} s.d ${item.selesai}</p>
        <p>Alasan: ${item.alasan}</p>
        <p>Status: ${item.status}</p>
        ${item.status === "Menunggu" ? `
          <button onclick="setujuiCuti(${index})">Setujui</button>
          <button onclick="tolakCuti(${index})">Tolak</button>
        ` : ""}
      </div>
    `;
  });
  container.innerHTML = html;
}

function renderKasbonAdmin() {
  const container = document.getElementById("formContainer");
  const data = JSON.parse(localStorage.getItem("kasbon") || "[]");

  let html = `<h3>Daftar Pengajuan Kasbon</h3>`;
  data.forEach((item, index) => {
    html += `
      <div class="form-kasbon" style="margin-bottom: 15px">
        <p><strong>${item.nama}</strong> - Rp ${item.jumlah}</p>
        <p>Alasan: ${item.alasan}</p>
        <p>Status: ${item.status}</p>
        ${item.status === "Menunggu" ? `
          <button onclick="setujuiKasbon(${index})">Setujui</button>
          <button onclick="tolakKasbon(${index})">Tolak</button>
        ` : ""}
      </div>
    `;
  });
  container.innerHTML = html;
}

function setujuiCuti(index) {
  const data = JSON.parse(localStorage.getItem("cuti"));
  data[index].status = "Disetujui";
  localStorage.setItem("cuti", JSON.stringify(data));
  renderCutiAdmin();
}

function tolakCuti(index) {
  const data = JSON.parse(localStorage.getItem("cuti"));
  data[index].status = "Ditolak";
  localStorage.setItem("cuti", JSON.stringify(data));
  renderCutiAdmin();
}

function setujuiKasbon(index) {
  const data = JSON.parse(localStorage.getItem("kasbon"));
  data[index].status = "Disetujui";
  localStorage.setItem("kasbon", JSON.stringify(data));
  renderKasbonAdmin();
}

function tolakKasbon(index) {
  const data = JSON.parse(localStorage.getItem("kasbon"));
  data[index].status = "Ditolak";
  localStorage.setItem("kasbon", JSON.stringify(data));
  renderKasbonAdmin();
}

function showRiwayat() {
  const container = document.getElementById("formContainer");
  const cuti = JSON.parse(localStorage.getItem("cuti") || "[]");
  const kasbon = JSON.parse(localStorage.getItem("kasbon") || "[]");
  const user = getLoggedInUsername();

  const userCuti = cuti.filter(item => item.nama === user);
  const userKasbon = kasbon.filter(item => item.nama === user);

  let html = `
    <h3>Riwayat Cuti & Kasbon</h3>
    <label>Filter Status:
      <select id="filterStatus" onchange="filterRiwayat()">
        <option value="">Semua</option>
        <option value="Menunggu">Menunggu</option>
        <option value="Disetujui">Disetujui</option>
        <option value="Ditolak">Ditolak</option>
      </select>
    </label>
    <label>Filter Tanggal:
      <input type="date" id="filterDate" onchange="filterRiwayat()" />
    </label>
    <input type="text" id="searchKeyword" placeholder="Cari alasan..." oninput="filterRiwayat()" />
    <button onclick="exportToExcel()">Export ke Excel</button>
    <button onclick="window.print()">Print / PDF</button>
    <div id="riwayatContainer">
      ${generateRiwayatHTML(userCuti, userKasbon)}
    </div>
  `;
  container.innerHTML = html;
  window._riwayatData = { cuti: userCuti, kasbon: userKasbon }; // Simpan data global
}

function generateRiwayatHTML(cuti, kasbon) {
  let html = "<h4>Cuti</h4>";
  if (cuti.length === 0) html += "<p>Tidak ada data cuti.</p>";
  else {
    cuti.forEach(item => {
      html += `
        <div>
          ${item.mulai} - ${item.selesai} | ${item.status} <br/>
          Alasan: ${item.alasan}
        </div><hr/>
      `;
    });
  }

  html += "<h4>Kasbon</h4>";
  if (kasbon.length === 0) html += "<p>Tidak ada data kasbon.</p>";
  else {
    kasbon.forEach(item => {
      html += `
        <div>
          Jumlah: Rp${item.jumlah} | ${item.status} <br/>
          Alasan: ${item.alasan}
        </div><hr/>
      `;
    });
  }

  return html;
}

function filterRiwayat() {
  const status = document.getElementById("filterStatus").value;
  const date = document.getElementById("filterDate").value;
  const keyword = document.getElementById("searchKeyword").value.toLowerCase();

  let cuti = window._riwayatData.cuti;
  let kasbon = window._riwayatData.kasbon;

  if (status) {
    cuti = cuti.filter(item => item.status === status);
    kasbon = kasbon.filter(item => item.status === status);
  }

  if (date) {
    cuti = cuti.filter(item => item.mulai <= date && item.selesai >= date);
    kasbon = kasbon.filter(item => {
      const kasbonDate = item.tanggal || "";
      return kasbonDate === date;
    });
  }

  if (keyword) {
    cuti = cuti.filter(item => item.alasan.toLowerCase().includes(keyword));
    kasbon = kasbon.filter(item => item.alasan.toLowerCase().includes(keyword));
  }

  document.getElementById("riwayatContainer").innerHTML = generateRiwayatHTML(cuti, kasbon);
}

function exportToExcel() {
  let cuti = window._riwayatData.cuti;
  let kasbon = window._riwayatData.kasbon;
  let csv = "Jenis,Tanggal/Jumlah,Alasan,Status\n";

  cuti.forEach(item => {
    csv += `Cuti,${item.mulai} s.d ${item.selesai},"${item.alasan}",${item.status}\n`;
  });

  kasbon.forEach(item => {
    csv += `Kasbon,${item.jumlah},"${item.alasan}",${item.status}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "riwayat_cuti_kasbon.csv";
  link.click();
}



