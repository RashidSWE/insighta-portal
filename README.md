Here is a clean, professional, and simple `README.md` for your Vite web portal repository. It covers everything another developer (or future you) needs to know to get the frontend running and connected to your FastAPI backend.

***

```markdown
# Insighta Labs+ Web Portal

This is the official web portal for Insighta Labs+. It is a lightweight, high-performance frontend built with Vite and Vanilla JavaScript. It securely connects to the Insighta Labs+ FastAPI backend using GitHub OAuth and strict cross-site cookie security.

## 🚀 Features

- **GitHub OAuth Login:** Seamless authentication using the GitHub Authorization Code flow.
- **Enterprise-Grade Security:** Utilizes `HttpOnly` cookies to store JWT access tokens, making it immune to XSS attacks.
- **CSRF Protection:** Implements robust Cross-Site Request Forgery (CSRF) header validation.
- **Vanilla JS:** Zero heavy framework dependencies; pure, fast DOM manipulation.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- The Insighta Labs+ FastAPI backend running locally or in the cloud.

## 🛠️ Setup & Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root of the project and add your specific configuration:
   ```env
   VITE_CLIENT_ID=your_github_oauth_client_id
   VITE_REDIRECT_URI=http://localhost:5173
   VITE_BACKEND_URL=[https://hng-projects.fastapicloud.dev](https://hng-projects.fastapicloud.dev) # Or http://localhost:8000 for local dev
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The portal will be available at `http://localhost:5173`.

## 🔐 GitHub OAuth App Configuration

To make the login flow work locally, ensure your GitHub OAuth App is configured correctly in your GitHub Developer Settings:

- **Homepage URL:** `http://localhost:5173`
- **Authorization callback URL:** `http://localhost:5173`

*(Note: When deploying to production, you will need to update these URLs in GitHub to match your live domain).*

## 🏗️ Architecture Note

This frontend does **not** handle or store JWT access tokens in `localStorage`. 
1. The frontend requests a `code` from GitHub.
2. It sends the `code` to the backend's `/auth/web/exchange` endpoint.
3. The backend negotiates the token and sets an `HttpOnly` cookie and a readable CSRF cookie.
4. All subsequent `fetch()` requests automatically include the secure cookie and manually attach the `X-CSRF-Token` header for backend validation.
```