/* ============================================================
   student-dashboard.js
   Profile edit functionality for student-dashboard2.html
   ============================================================ */

(function () {
  "use strict";

  /* ── Editable fields config ──
     Each entry: { id, field on user object, editable? }
  ── */
  const EDITABLE_FIELDS = [
    { id: "pf-name",  key: "fullName",     editable: true  },
    { id: "pf-email", key: "email",        editable: true  },
    { id: "pf-phone", key: "phoneNumber",  editable: true  },
    { id: "pf-dept",  key: "department",   editable: true  },
  ];

  const READ_ONLY_FIELDS = [
    { id: "pf-regnum",  key: "identifier"  },
    { id: "pf-regdate", key: "regDate"     },
    { id: "pf-role",    key: null, value: "Student" },
    { id: "pf-status",  key: null, value: "Approved" },
  ];

  /* ── Toast helper ── */
  function showToast(message, isError = false) {
    let toast = document.getElementById("profileToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "profileToast";
      toast.className = "profile-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.add("show");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  /* ── Validation ── */
  function validate(data) {
    if (!data.fullName || data.fullName.trim().length < 2) {
      return "Full name must be at least 2 characters.";
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return "Please enter a valid email address.";
    }
    if (data.phoneNumber && !/^[+\d\s\-()]{7,20}$/.test(data.phoneNumber)) {
      return "Please enter a valid phone number.";
    }
    return null;
  }

  /* ── Build editable profile HTML ── */
  function buildEditableProfile(user) {
    const initials = (user.avatar) || ((user.fullName || "S").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase());

    const avatarHtml = user.profileImage
      ? `<img src="${user.profileImage}" alt="${user.fullName}" class="profile-image" id="profileImage">`
      : `<div class="profile-avatar-large" id="profileAvatarLarge">${initials}</div>`;

    const safeVal = (val) => val ? String(val).replace(/"/g, "&quot;") : "";
    const regDate = user.regDate || (user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB") : "—");
    const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—";

    return `
      <!-- Action buttons -->
      <div class="profile-actions">
        <button class="btn-edit-profile" id="btnEditProfile" aria-label="Edit profile">
          ✏️ Edit Profile
        </button>
        <button class="btn-save-profile" id="btnSaveProfile" aria-label="Save profile changes">
          💾 Save
        </button>
        <button class="btn-cancel-profile" id="btnCancelProfile" aria-label="Cancel editing">
          ✕ Cancel
        </button>
      </div>

      <!-- Profile header -->
      <div class="profile-header">
        <div class="profile-image-wrapper">
          ${avatarHtml}
        </div>
        <div class="profile-header-info">
          <h3 class="profile-name" id="profileDisplayName">${user.fullName || "Student"}</h3>
          <p class="profile-identifier">${user.identifier || ""}</p>
          <span class="profile-status">Approved ✓</span>
        </div>
      </div>
      
      <!-- Profile picture upload section -->
      <div class="profile-image-container">
        <input type="file" id="imageUpload" accept="image/*">
        <button class="btn-change-photo" id="changePhotoBtn">📷 Change Photo</button>
      </div>
      
      <div class="profile-divider"></div>

      <!-- Editable fields -->
      <div class="info-row">
        <div class="info-icon">👤</div>
        <div class="profile-field-group">
          <div class="profile-field-label">Full Name</div>
          <input class="profile-field-input" id="pf-name" type="text" value="${safeVal(user.fullName)}" readonly aria-label="Full name">
        </div>
      </div>

      <div class="info-row">
        <div class="info-icon">📧</div>
        <div class="profile-field-group">
          <div class="profile-field-label">Email Address</div>
          <input class="profile-field-input" id="pf-email" type="email" value="${safeVal(user.email)}" readonly aria-label="Email address">
        </div>
      </div>

      <div class="info-row">
        <div class="info-icon">📱</div>
        <div class="profile-field-group">
          <div class="profile-field-label">Phone Number</div>
          <input class="profile-field-input" id="pf-phone" type="tel" value="${safeVal(user.phoneNumber) || ""}" placeholder="Not provided" readonly aria-label="Phone number">
        </div>
      </div>

      <div class="info-row">
        <div class="info-icon">🏫</div>
        <div class="profile-field-group">
          <div class="profile-field-label">Department / Programme</div>
          <input class="profile-field-input" id="pf-dept" type="text" value="${safeVal(user.department) || ""}" placeholder="Not specified" readonly aria-label="Department">
        </div>
      </div>

      <!-- Read-only fields -->
      <div class="info-row">
        <div class="info-icon">🆔</div>
        <div class="profile-field-group">
          <div class="profile-field-label">Registration Number</div>
          <input class="profile-field-input" id="pf-regnum" type="text" value="${safeVal(user.identifier)}" readonly aria-label="Registration number">
        </div>
      </div>

      <div class="info-row">
        <div class="info-icon">📅</div>
        <div class="profile-field-group">
          <div class="profile-field-label">Registration Date</div>
          <input class="profile-field-input" id="pf-regdate" type="text" value="${regDate}" readonly aria-label="Registration date">
        </div>
      </div>

      <div class="info-row">
        <div class="info-icon">🎓</div>
        <div class="profile-field-group">
          <div class="profile-field-label">Role</div>
          <input class="profile-field-input" id="pf-role" type="text" value="Student" readonly aria-label="Role">
        </div>
      </div>

      <div class="info-row">
        <div class="info-icon">✅</div>
        <div class="profile-field-group">
          <div class="profile-field-label">Account Status</div>
          <input class="profile-field-input" id="pf-status" type="text" value="Approved" readonly aria-label="Account status">
        </div>
      </div>

      <div class="info-row">
        <div class="info-icon">⏰</div>
        <div class="profile-field-group">
          <div class="profile-field-label">Member Since</div>
          <input class="profile-field-input" id="pf-member" type="text" value="${memberSince}" readonly aria-label="Member since">
        </div>
      </div>
    `;
  }

  /* ── Edit mode controller ── */
  function initProfileEdit(user) {
    const card = document.getElementById("profileCard");
    if (!card) return;

    /* Render editable profile */
    card.innerHTML = buildEditableProfile(user);

    /* ── Restore saved profile image from localStorage ── */
    const savedImage = user.profileImage || (() => {
      try {
        const s = JSON.parse(localStorage.getItem("geoCurrentUser") || "{}");
        return s.profileImage || null;
      } catch(_) { return null; }
    })();
    if (savedImage) {
      const wrapper = card.querySelector(".profile-image-wrapper");
      if (wrapper) {
        wrapper.innerHTML = `<img src="${savedImage}" alt="Profile photo" class="profile-image" id="profileImage" style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.3);">`;
      }
      const sidebarAv = document.getElementById("sidebarAvatar");
      if (sidebarAv) {
        sidebarAv.innerHTML = "";
        const img = document.createElement("img");
        img.src = savedImage;
        img.alt = "Avatar";
        img.style.cssText = "width:100%;height:100%;border-radius:50%;object-fit:cover;";
        sidebarAv.appendChild(img);
      }
      const topbarContainer = document.getElementById("topbarAvatarContainer");
      if (topbarContainer) {
        topbarContainer.innerHTML = `<img src="${savedImage}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
      }
    }

    const btnEdit   = document.getElementById("btnEditProfile");
    const btnSave   = document.getElementById("btnSaveProfile");
    const btnCancel = document.getElementById("btnCancelProfile");


    /* Snapshot of original values for cancel */
    let snapshot = {};

    function saveSnapshot() {
      EDITABLE_FIELDS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) snapshot[id] = el.value;
      });
    }

    function enterEditMode() {
      saveSnapshot();
      card.classList.add("profile-editing");
      EDITABLE_FIELDS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) el.removeAttribute("readonly");
      });
      btnEdit.classList.add("hidden");
      btnSave.classList.add("visible");
      btnCancel.classList.add("visible");
      /* Focus first editable field */
      const first = document.getElementById(EDITABLE_FIELDS[0].id);
      if (first) first.focus();
    }

    function exitEditMode() {
      card.classList.remove("profile-editing");
      EDITABLE_FIELDS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute("readonly", true);
      });
      btnEdit.classList.remove("hidden");
      btnSave.classList.remove("visible");
      btnCancel.classList.remove("visible");
    }

    function cancelEdit() {
      /* Restore snapshot values */
      EDITABLE_FIELDS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && snapshot[id] !== undefined) el.value = snapshot[id];
      });
      exitEditMode();
    }

    async function saveEdit() {
      /* Collect new values */
      const updated = {};
      EDITABLE_FIELDS.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (el) updated[key] = el.value.trim();
      });

      /* Validate */
      const error = validate(updated);
      if (error) { showToast(error, true); return; }

      /* ── Try PHP backend ─────────────────────────────────── */
      const token = GeoAuth.getToken();
      if (token) {
        try {
          const res  = await fetch(`${GEO_API}/auth/update_profile`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body:    JSON.stringify(updated)
          });
          const json = await res.json();
          if (res.ok && json.status) {
            /* Merge server response into cache */
            GeoAuth.setCurrentUser(Object.assign({}, user, json.data));
            Object.assign(user, json.data);
          } else {
            showToast(json.message || 'Could not save profile.', true);
            return;
          }
        } catch (_) {
          console.warn('GEO ACADEMY: API unreachable — saving to localStorage only.');
          persistToLocalStorage(updated);
        }
      } else {
        /* No token — localStorage only mode */
        persistToLocalStorage(updated);
      }

      /* Update visible name in profile header + sidebar */
      const nameDisplay = document.getElementById("profileDisplayName");
      if (nameDisplay) nameDisplay.textContent = updated.fullName || user.fullName;
      const sidebarName = document.getElementById("sidebarName");
      if (sidebarName) sidebarName.textContent = (updated.fullName || user.fullName).split(" ")[0];
      const topbarName = document.getElementById("topbarName");
      if (topbarName) topbarName.textContent = updated.fullName || user.fullName;
      const welcomeMsg = document.getElementById("welcomeMsg");
      if (welcomeMsg) welcomeMsg.textContent = `Welcome back, ${(updated.fullName || user.fullName).split(" ")[0]}! 🎓`;

      exitEditMode();
      showToast("✓ Profile updated successfully!");
    }

    function persistToLocalStorage(updated) {
      try {
        const stored  = JSON.parse(localStorage.getItem("geoCurrentUser") || "{}");
        const session = JSON.parse(localStorage.getItem("geo_session")    || "{}");
        Object.assign(stored,  updated);
        Object.assign(session, updated);
        localStorage.setItem("geoCurrentUser", JSON.stringify(stored));
        localStorage.setItem("geo_session",    JSON.stringify(session));
        Object.assign(user, updated);
      } catch (e) { console.warn("Could not persist profile:", e); }
    }

    /* ── Event listeners ── */
    btnEdit.addEventListener("click", enterEditMode);
    btnSave.addEventListener("click", saveEdit);
    btnCancel.addEventListener("click", cancelEdit);

    /* Allow Enter key to save, Escape to cancel while editing */
    card.addEventListener("keydown", (e) => {
      if (!card.classList.contains("profile-editing")) return;
      if (e.key === "Enter" && e.target.tagName === "INPUT") saveEdit();
      if (e.key === "Escape") cancelEdit();
    });

    /* ── Photo upload ── */
    const changePhotoBtn = document.getElementById("changePhotoBtn");
    const imageUpload    = document.getElementById("imageUpload");

    if (changePhotoBtn && imageUpload) {
      changePhotoBtn.addEventListener("click", () => imageUpload.click());

      imageUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        /* Validate type & size (max 2 MB) */
        if (!file.type.startsWith("image/")) {
          showToast("Please select an image file.", true);
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          showToast("Image must be smaller than 2 MB.", true);
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;

          /* Replace avatar display in profile header */
          const wrapper = card.querySelector(".profile-image-wrapper");
          if (wrapper) {
            wrapper.innerHTML = `<img src="${dataUrl}" alt="Profile photo" class="profile-image" id="profileImage" style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.3);">`;
          }

          /* Sync sidebar avatar */
          const sidebarAv = document.getElementById("sidebarAvatar");
          if (sidebarAv) {
            sidebarAv.innerHTML = "";
            const img = document.createElement("img");
            img.src = dataUrl;
            img.alt = "Avatar";
            img.style.cssText = "width:100%;height:100%;border-radius:50%;object-fit:cover;";
            sidebarAv.appendChild(img);
          }

          /* Sync topbar avatar */
          const topbarContainer = document.getElementById("topbarAvatarContainer");
          if (topbarContainer) {
            topbarContainer.innerHTML = `<img src="${dataUrl}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
          }

          /* Persist to localStorage */
          try {
            const stored = JSON.parse(localStorage.getItem("geoCurrentUser") || "{}");
            stored.profileImage = dataUrl;
            localStorage.setItem("geoCurrentUser", JSON.stringify(stored));
            Object.assign(user, { profileImage: dataUrl });
          } catch (err) {
            console.warn("Could not save profile image:", err);
          }

          showToast("✓ Profile photo updated!");
        };
        reader.readAsDataURL(file);

        /* Reset input so same file can be re-selected */
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body:    JSON.stringify(updated)
          });
          const json = await res.json();
          if (res.ok && json.status) {
            /* Merge server response into cache */
            GeoAuth.setCurrentUser(Object.assign({}, user, json.data));
            Object.assign(user, json.data);
          } else {
            showToast(json.message || 'Could not save profile.', true);
            return;
          }
        } catch (_) {
          console.warn('GEO ACADEMY: API unreachable — saving to localStorage only.');
          persistToLocalStorage(updated);
        }
      } else {
        /* No token — localStorage only mode */
        persistToLocalStorage(updated);
      }

      /* Update visible name in profile header + sidebar */
      const nameDisplay = document.getElementById("profileDisplayName");
      if (nameDisplay) nameDisplay.textContent = updated.fullName || user.fullName;
      const sidebarName = document.getElementById("sidebarName");
      if (sidebarName) sidebarName.textContent = (updated.fullName || user.fullName).split(" ")[0];
      const topbarName = document.getElementById("topbarName");
      if (topbarName) topbarName.textContent = updated.fullName || user.fullName;
      const welcomeMsg = document.getElementById("welcomeMsg");
      if (welcomeMsg) welcomeMsg.textContent = `Welcome back, ${(updated.fullName || user.fullName).split(" ")[0]}! 🎓`;

      exitEditMode();
      showToast("✓ Profile updated successfully!");
    }

    function persistToLocalStorage(updated) {
      try {
        const stored  = JSON.parse(localStorage.getItem("geoCurrentUser") || "{}");
        const session = JSON.parse(localStorage.getItem("geo_session")    || "{}");
        Object.assign(stored,  updated);
        Object.assign(session, updated);
        localStorage.setItem("geoCurrentUser", JSON.stringify(stored));
        localStorage.setItem("geo_session",    JSON.stringify(session));
        Object.assign(user, updated);
      } catch (e) { console.warn("Could not persist profile:", e); }
    }

    /* ── Event listeners ── */
    btnEdit.addEventListener("click", enterEditMode);
    btnSave.addEventListener("click", saveEdit);
    btnCancel.addEventListener("click", cancelEdit);

    /* Allow Enter key to save, Escape to cancel while editing */
    card.addEventListener("keydown", (e) => {
      if (!card.classList.contains("profile-editing")) return;
      if (e.key === "Enter" && e.target.tagName === "INPUT") saveEdit();
      if (e.key === "Escape") cancelEdit();
    });

    /* ── Photo upload ── */
    const changePhotoBtn = document.getElementById("changePhotoBtn");
    const imageUpload    = document.getElementById("imageUpload");

    if (changePhotoBtn && imageUpload) {
      changePhotoBtn.addEventListener("click", () => imageUpload.click());

      imageUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        /* Validate type & size (max 2 MB) */
        if (!file.type.startsWith("image/")) {
          showToast("Please select an image file.", true);
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          showToast("Image must be smaller than 2 MB.", true);
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;

          /* Replace avatar display in profile header */
          const wrapper = card.querySelector(".profile-image-wrapper");
          if (wrapper) {
            wrapper.innerHTML = `<img src="${dataUrl}" alt="Profile photo" class="profile-image" id="profileImage" style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.3);">`;
          }

          /* Sync sidebar avatar */
          const sidebarAv = document.getElementById("sidebarAvatar");
          if (sidebarAv) {
            sidebarAv.innerHTML = "";
            const img = document.createElement("img");
            img.src = dataUrl;
            img.alt = "Avatar";
            img.style.cssText = "width:100%;height:100%;border-radius:50%;object-fit:cover;";
            sidebarAv.appendChild(img);
          }

          /* Sync topbar avatar */
          const topbarContainer = document.getElementById("topbarAvatarContainer");
          if (topbarContainer) {
            topbarContainer.innerHTML = `<img src="${dataUrl}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
          }

          /* Persist to localStorage */
          try {
            const stored = JSON.parse(localStorage.getItem("geoCurrentUser") || "{}");
            stored.profileImage = dataUrl;
            localStorage.setItem("geoCurrentUser", JSON.stringify(stored));
            Object.assign(user, { profileImage: dataUrl });
          } catch (err) {
            console.warn("Could not save profile image:", err);
          }

          showToast("✓ Profile photo updated!");
        };
        reader.readAsDataURL(file);

        /* Reset input so same file can be re-selected */
        imageUpload.value = "";
      });
    }
  }

  /* ── Dashboard Data Fetcher ── */
  async function initDashboardData(user) {
    const token = GeoAuth.getToken();
    if (!token) return;

    try {
      const res = await fetch(`${GEO_API}/results`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      
      if (json.status && json.data) {
        const results = json.data;
        
        // Populate stats grid
        const statSubjects = document.getElementById('statSubjects');
        const statAverage = document.getElementById('statAverage');
        const statExams = document.getElementById('statExams');
        const statGrade = document.getElementById('statGrade');
        
        if (statSubjects) statSubjects.innerText = new Set(results.map(r => r.subject)).size;
        if (statExams) statExams.innerText = results.length;
        
        if (results.length > 0) {
          const avg = results.reduce((sum, r) => sum + r.score, 0) / results.length;
          if (statAverage) statAverage.innerText = Math.round(avg) + '%';
          
          let overallGrade = 'F9';
          if (avg >= 75) overallGrade = 'A1';
          else if (avg >= 70) overallGrade = 'B2';
          else if (avg >= 65) overallGrade = 'B3';
          else if (avg >= 60) overallGrade = 'C4';
          else if (avg >= 55) overallGrade = 'C5';
          else if (avg >= 50) overallGrade = 'C6';
          else if (avg >= 45) overallGrade = 'D7';
          else if (avg >= 40) overallGrade = 'E8';
          
          if (statGrade) statGrade.innerText = overallGrade;
        }

        // Populate results grid
        const resultsGrid = document.getElementById('studentResultsGrid');
        if (resultsGrid) {
          resultsGrid.innerHTML = '';
          if (results.length === 0) {
            resultsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.5); padding: 40px;">No results available yet.</div>';
          } else {
            results.forEach(r => {
              let scoreClass = 'average';
              let gradeClass = 'grade-c';
              let gradeText = r.grade + ' — Average';
              
              if (r.score >= 75) { scoreClass = 'excellent'; gradeClass = 'grade-a'; gradeText = r.grade + ' — Excellent'; }
              else if (r.score >= 60) { scoreClass = 'good'; gradeClass = 'grade-b'; gradeText = r.grade + ' — Good'; }
              else if (r.score < 50) { scoreClass = 'poor'; gradeClass = 'grade-f'; gradeText = r.grade + ' — Fail'; }
              
              const card = document.createElement('div');
              card.className = 'result-card admin-glass-panel';
              card.style.padding = '20px';
              card.style.borderRadius = '16px';
              card.style.textAlign = 'center';
              
              // We use inline styles for the colors to avoid missing CSS classes for dynamic stuff if they weren't defined generally
              let scoreColor = '#f59e0b';
              let gradeBg = 'rgba(245,158,11,0.2)';
              if (scoreClass === 'excellent') { scoreColor = '#10b981'; gradeBg = 'rgba(16,185,129,0.2)'; }
              else if (scoreClass === 'good') { scoreColor = '#3b82f6'; gradeBg = 'rgba(59,130,246,0.2)'; }
              else if (scoreClass === 'poor') { scoreColor = '#ef4444'; gradeBg = 'rgba(239,68,68,0.2)'; }

              card.innerHTML = `
                <div class="result-subject" style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">${r.subject}</div>
                <div class="result-score ${scoreClass}" style="font-size: 36px; font-weight: bold; color: ${scoreColor};">${r.score}</div>
                <span class="result-grade ${gradeClass}" style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-weight: 600; margin: 10px 0; background: ${gradeBg}; color: ${scoreColor};">${gradeText}</span>
                <div class="result-term" style="font-size: 12px; color: rgba(255,255,255,0.6);">${r.term} Term · ${r.sessionYear}</div>
              `;
              resultsGrid.appendChild(card);
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  }

  /* ── Expose to global scope so inline init script can call it ── */
  window.GeoStudentDashboard = { initProfileEdit, initDashboardData };

})();
