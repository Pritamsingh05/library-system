const STORAGE_KEY = "library_demo_frontend_v2";

const defaultData = {
  people: [
    {
      id: "LIB12345",
      name: "Aman Sharma",
      dob: "2003-08-12",
      role: "B.Tech CSE Student",
      validUpto: "2026-12-31",
      regNo: "REG-1001",
      photoSrc: "",
      signSrc: "",
      status: "outside",
      inTime: "",
      outTime: ""
    },
    {
      id: "LIB54321",
      name: "Neha Patel",
      dob: "2002-01-22",
      role: "Faculty",
      validUpto: "2027-03-31",
      regNo: "FAC-2002",
      photoSrc: "",
      signSrc: "",
      status: "in",
      inTime: "09:15 AM",
      outTime: ""
    }
  ],
  notices: [
    {
      text: "Library will remain open till 8:00 PM on Friday.",
      time: new Date().toLocaleString()
    }
  ]
};

let appData = loadData();
let currentPerson = null;

const $ = (id) => document.getElementById(id);

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(defaultData);

  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(defaultData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function getDate() {
  return new Date().toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function updateClock() {
  $("liveDate").textContent = getDate();
  $("liveTime").textContent = getTime();
}
updateClock();
setInterval(updateClock, 1000);

function normalizeId(value) {
  return value.replace(/\s+/g, "").toUpperCase();
}

function findPerson(id) {
  return appData.people.find((p) => p.id.toUpperCase() === id.toUpperCase());
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function renderCounts() {
  const total = appData.people.length;
  const inside = appData.people.filter((p) => p.status === "in").length;
  const outside = total - inside;
  const notices = appData.notices.length;

  $("supTotalRegistered").textContent = total;
  $("supInside").textContent = inside;
  $("supOutside").textContent = outside;
  $("supNotices").textContent = notices;
}

function renderLists() {
  const recordList = $("recordList");
  const insideList = $("insideList");
  const noticeList = $("noticeList");

  recordList.innerHTML = "";
  insideList.innerHTML = "";
  noticeList.innerHTML = "";

  appData.people.forEach((person) => {
    const el = document.createElement("div");
    el.className = "item";

    el.innerHTML = `
      <div class="item-thumb">
        ${
          person.photoSrc
            ? `<img src="${person.photoSrc}" alt="${person.name}">`
            : `${getInitials(person.name)}`
        }
      </div>
      <div>
        <strong>${person.name}</strong>
        <small>${person.id} • ${person.role}</small>
      </div>
    `;

    recordList.appendChild(el);
  });

  const insidePeople = appData.people.filter((p) => p.status === "in");
  if (insidePeople.length === 0) {
    insideList.innerHTML = `<div class="item"><div class="item-thumb">0</div><div><strong>No one inside right now</strong><small>Library is empty.</small></div></div>`;
  } else {
    insidePeople.forEach((person) => {
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `
        <div class="item-thumb">
          ${
            person.photoSrc
              ? `<img src="${person.photoSrc}" alt="${person.name}">`
              : `${getInitials(person.name)}`
          }
        </div>
        <div>
          <strong>${person.name}</strong>
          <small>${person.id} • In Time: ${person.inTime || "—"}</small>
        </div>
      `;
      insideList.appendChild(el);
    });
  }

  if (appData.notices.length === 0) {
    noticeList.innerHTML = `<div class="item"><div class="item-thumb">N</div><div><strong>No notices</strong><small>Add notice from admin.</small></div></div>`;
  } else {
    appData.notices.forEach((notice) => {
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `
        <div class="item-thumb">!</div>
        <div>
          <strong>Notice</strong>
          <small>${notice.time}</small>
          <p>${notice.text}</p>
        </div>
      `;
      noticeList.appendChild(el);
    });
  }
}

function renderMediaBox(boxId, src, fallbackText) {
  const box = $(boxId);

  if (src) {
    box.innerHTML = `<img src="${src}" alt="${fallbackText}">`;
  } else {
    box.innerHTML = `<span>${fallbackText}</span>`;
  }
}

function clearFields() {
  currentPerson = null;
  $("idInput").value = "";
  $("nameField").textContent = "—";
  $("dobField").textContent = "—";
  $("inTimeField").textContent = "—";
  $("outTimeField").textContent = "—";
  $("regField").textContent = "—";
  $("statusField").textContent = "—";
  $("validField").textContent = "—";
  renderMediaBox("photoBox", "", "Face Photo");
  renderMediaBox("signBox", "", "Signature Photo");
  $("entryMessage").textContent = "Search an ID to show details.";
}

function showPerson(person) {
  currentPerson = person;
  $("nameField").textContent = person.name;
  $("dobField").textContent = person.dob;
  $("inTimeField").textContent = person.inTime || "—";
  $("outTimeField").textContent = person.outTime || "—";
  $("regField").textContent = person.regNo;
  $("statusField").textContent = person.status.toUpperCase();
  $("validField").textContent = person.validUpto;

  renderMediaBox("photoBox", person.photoSrc, "Face Photo");
  renderMediaBox("signBox", person.signSrc, "Signature Photo");

  $("entryMessage").textContent =
    person.status === "in"
      ? `${person.name} is inside the library.`
      : `${person.name} is currently outside the library.`;
}

function fileToResizedDataURL(file, maxSize = 900, quality = 0.9) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height >= width && height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.onerror = () => reject(new Error("Invalid image file."));
      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error("File reading failed."));
    reader.readAsDataURL(file);
  });
}

function updateFilePreview(inputId, previewId, labelText) {
  const input = $(inputId);
  const preview = $(previewId);
  const file = input.files[0];

  if (!file) {
    preview.textContent = `No ${labelText.toLowerCase()} selected`;
    return;
  }

  preview.innerHTML = `
    <img src="${URL.createObjectURL(file)}" alt="${labelText}">
    <span>${file.name}</span>
  `;
}

$("newPhotoFile").addEventListener("change", () => {
  updateFilePreview("newPhotoFile", "newPhotoPreview", "Photo");
});

$("newSignFile").addEventListener("change", () => {
  updateFilePreview("newSignFile", "newSignPreview", "Signature");
});

$("searchBtn").addEventListener("click", () => {
  const id = normalizeId($("idInput").value);

  if (id.length !== 8) {
    $("entryMessage").textContent = "Please enter exactly 8 characters.";
    return;
  }

  const person = findPerson(id);

  if (!person) {
    clearFields();
    $("entryMessage").textContent = `No record found for ${id}.`;
    return;
  }

  showPerson(person);
});

$("idInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("searchBtn").click();
});

$("markInBtn").addEventListener("click", () => {
  if (!currentPerson) {
    $("entryMessage").textContent = "Search a person first.";
    return;
  }

  currentPerson.status = "in";
  currentPerson.inTime = getTime();
  currentPerson.outTime = "";
  showPerson(currentPerson);
  saveData();
  renderCounts();
  renderLists();
});

$("markOutBtn").addEventListener("click", () => {
  if (!currentPerson) {
    $("entryMessage").textContent = "Search a person first.";
    return;
  }

  currentPerson.status = "outside";
  currentPerson.outTime = getTime();
  showPerson(currentPerson);
  saveData();
  renderCounts();
  renderLists();
});

$("clearBtn").addEventListener("click", clearFields);

$("addPersonForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newId = normalizeId($("newId").value);
  const newName = $("newName").value.trim();
  const newDob = $("newDob").value;
  const newRole = $("newRole").value.trim();
  const newValidUpto = $("newValidUpto").value;
  const newReg = $("newReg").value.trim();

  const photoFile = $("newPhotoFile").files[0];
  const signFile = $("newSignFile").files[0];

  if (newId.length !== 8) {
    alert("ID must be exactly 8 characters.");
    return;
  }

  if (findPerson(newId)) {
    alert("This ID already exists.");
    return;
  }

  const photoSrc = await fileToResizedDataURL(photoFile, 900, 0.9);
  const signSrc = await fileToResizedDataURL(signFile, 700, 0.95);

  appData.people.unshift({
    id: newId,
    name: newName,
    dob: newDob,
    role: newRole,
    validUpto: newValidUpto,
    regNo: newReg,
    photoSrc,
    signSrc,
    status: "outside",
    inTime: "",
    outTime: ""
  });

  saveData();
  renderCounts();
  renderLists();
  $("addPersonForm").reset();
  $("newPhotoPreview").textContent = "No photo selected";
  $("newSignPreview").textContent = "No signature selected";
  alert("New person added successfully.");
});

$("addNoticeBtn").addEventListener("click", () => {
  const text = $("noticeText").value.trim();

  if (!text) {
    alert("Write a notice first.");
    return;
  }

  appData.notices.unshift({
    text,
    time: new Date().toLocaleString()
  });

  saveData();
  renderCounts();
  renderLists();
  $("noticeText").value = "";
  alert("Notice published.");
});

document.querySelectorAll(".menu-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".menu-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

renderCounts();
renderLists();
clearFields();