import './style.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const GITHUB_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI

console.log(GITHUB_CLIENT_ID)

document.getElementById('login-btn').addEventListener('click', () => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user`;
  console.log(GITHUB_CLIENT_ID)
  window.location.href = authUrl;
});


function getCsrfToken() {
  const match = document.cookie.match(new RegExp('(^| )csrf_token=([^;]+)'));
  return match ? match[2] : null;
}

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
      document.getElementById("login-view").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      document.getElementById("status-message").innerText = "Negotiating secure cookies with backend...";

      try {
          const response = await fetch(`${BACKEND_URL}/auth/web/exchange`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include", 
              body: JSON.stringify({ code: code }) 
          });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("csrf_token", data.csrf_token)
              window.history.replaceState({}, document.title, "/");
              fetchSecureData();
          } else {
              document.getElementById("status-message").innerText = "Login failed. Check backend logs.";
          }
      } catch (err) {
          console.error(err);
      }
  } else {
      fetchSecureData(true);
  }
}

async function fetchSecureData(isInitialCheck = false) {
  const csrfToken = localStorage.getItem("csrf_token");
  
  if (!csrfToken && isInitialCheck) return;

  document.getElementById("login-view").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  try {
      const response = await fetch(`${BACKEND_URL}/api/portal/dashboard`, {
          method: "GET",
          credentials: "include", 
          headers: {
              "X-CSRF-Token": csrfToken 
          }
      });

      if (response.ok) {
          const data = await response.json();
          document.getElementById("status-message").innerText = "✅ Authenticated successfully via HttpOnly Cookie!";
          document.getElementById("secure-data").innerText = JSON.stringify(data, null, 2);
      } else {
          if (!isInitialCheck) {
              document.getElementById("status-message").innerText = "Session expired or invalid CSRF.";
          } else {
              document.getElementById("login-view").style.display = "block";
              document.getElementById("dashboard").style.display = "none";
          }
      }
  } catch (err) {
      console.error("Fetch error:", err);
  }
}

window.onload = init;