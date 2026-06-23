// auth.js - Shared authentication utilities for GEO ACADEMY
// Supports the Node/Express backend (Bearer-token).

/* ── API base URL ──────────────────────────────────────────────────────────
   Dev  : Node.js server runs on port 3001  (npm run dev inside server/)
   Prod : reverse-proxied to same origin under /api
──────────────────────────────────────────────────────────────────────── */
const GEO_API = (() => {
  const h = window.location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return 'http://localhost:3001/api';
  return window.location.origin + '/api'; // Same-origin production deployment
})();

const GeoAuth = {
  getUsers() {
    return JSON.parse(localStorage.getItem("geo_users") || "[]");
  },

  saveUsers(users) {
    localStorage.setItem("geo_users", JSON.stringify(users));
  },

  /* ── Token management ─────────────────────────────────────── */
  getToken() {
    return localStorage.getItem('geo_auth_token') || null;
  },
  setToken(token) {
    if (token) localStorage.setItem('geo_auth_token', token);
    else        localStorage.removeItem('geo_auth_token');
  },

  /* ── User cache (geo_session) ─────────────────────────────── */
  getCurrentUser() {
    const data = localStorage.getItem("geo_session");
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser(user) {
    localStorage.setItem("geo_session", JSON.stringify(user));
    localStorage.setItem("geoCurrentUser", JSON.stringify(user)); // dashboard compat
  },

  /* ── Server-validated session fetch ──────────────────────────
     Called on dashboard load to verify token is still valid.
  ─────────────────────────────────────────────────────────────── */
  async fetchCurrentUser() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${GEO_API}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        this.setCurrentUser(json.data);
        return json.data;
      }
      // 401 / 403 → session expired
      if (res.status === 401 || res.status === 403) {
        this.clearSession();
        return null;
      }
    } catch (_) {
      // Server not running.
    }
    this.clearSession();
    return null;
  },


  logout() {
    const token = this.getToken();
    if (token) {
      // Fire-and-forget — don't block UI on network
      fetch(`${GEO_API}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {});
    }
    this.clearSession();
    window.location.href = this.getRootPath() + 'login2.html';
  },

  clearSession() {
    localStorage.removeItem('geo_auth_token');
    localStorage.removeItem('geo_session');
    localStorage.removeItem('geoCurrentUser');
  },


  saveRememberedCredentials(role, identifier) {
    const credentials = {
      role,
      identifier,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem("geo_remembered", JSON.stringify(credentials));
  },

  getRememberedCredentials() {
    const data = localStorage.getItem("geo_remembered");
    if (!data) return null;
    try {
      const { role, identifier, savedAt } = JSON.parse(data);
      return { role, identifier, savedAt };
    } catch(_) { return null; }
  },

  clearRememberedCredentials() {
    localStorage.removeItem("geo_remembered");
  },

  getRootPath() {
    return "";
  },

  requireAuth(expectedRole) {
    const user  = this.getCurrentUser();
    const token = this.getToken();
    if (!user) {
      window.location.href = this.getRootPath() + 'login2.html';
      return null;
    }
    if (!token) {
      this.clearSession();
      window.location.href = this.getRootPath() + 'login2.html';
      return null;
    }
    if (expectedRole && user.role !== expectedRole) {
      window.location.href = this.getRootPath() + 'login2.html';
      return null;
    }
    return user;
  },

  generateId(role) {
    return role + "-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
  },

  getInitials(name) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substr(0, 2);
  },

  showNotification(message, type = "success") {
    const existing = document.querySelector(".geo-notification");
    if (existing) existing.remove();

    const notif = document.createElement("div");
    notif.className = `geo-notification geo-notif-${type}`;
    notif.innerHTML = `
      <div class="notif-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</div>
      <div class="notif-text">${message}</div>
      <button class="notif-close" onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.classList.add("notif-show");
    }, 10);

    setTimeout(() => {
      notif.classList.remove("notif-show");
      setTimeout(() => notif.remove(), 400);
    }, 5000);
  }
};
