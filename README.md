



# 🕵️ Anonymous Secrets App

A full-stack Node.js web application that lets users **share their secrets anonymously** after signing up or logging in via email/password or **Google OAuth**. Secrets are stored in a **MongoDB** database and displayed publicly — without revealing the identity of the person behind them.

---

## 🚀 Features

- 🔐 User authentication using:
  - Local strategy (username + password)
  - Google OAuth 2.0
- 🗝️ Anonymous secret submission (only for authenticated users)
- 🌐 Secrets are publicly visible but not tied to any user
- 🧠 Session management using `express-session`
- 🛡️ Passwords securely hashed and salted with `passport-local-mongoose`
- 💾 Data persistence via MongoDB and Mongoose ODM
- 📄 Templated UI using EJS

---

## 🛠️ Tech Stack

- **Frontend**: EJS, HTML, CSS
- **Backend**: Node.js, Express.js
- **Authentication**: Passport.js (local + Google OAuth 2.0)
- **Database**: MongoDB (via Mongoose)
- **Session Management**: express-session
- **Environment Variables**: dotenv

---

## 📦 Dependencies

```bash
express
ejs
body-parser
mongoose
passport
passport-local
passport-local-mongoose
passport-google-oauth20
express-session
dotenv
mongoose-find-or-create
````

---

## 📸 Screenshots

> *(Add your app screenshots here to visually represent home page, login, secrets, and submit pages.)*

---

## 🧪 How it Works

1. Users can **register** or **log in** using:

   * Email & password
   * Google account via OAuth
2. Authenticated users are allowed to:

   * View secrets submitted by others
   * Submit their own secret anonymously
3. Submitted secrets are saved to MongoDB and displayed on the `/secrets` page.
4. No usernames or personal data are shown alongside secrets.

---

## 🔧 Installation & Usage

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/anonymous-secrets-app.git
   cd anonymous-secrets-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   CLIENT_ID=your-google-oauth-client-id
   CLIENT_SECRET=your-google-oauth-client-secret
   ```

4. **Start MongoDB locally** (make sure MongoDB is installed and running)

5. **Run the app**

   ```bash
   node app.js
   ```

6. **Visit the app**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Folder Structure

```
├── public/             # Static assets (CSS/images if any)
├── views/              # EJS templates
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── secrets.ejs
│   └── submit.ejs
├── .env                # Environment variables (not committed)
├── app.js              # Main server file
└── package.json
```

---

## ⚠️ Known Issues

* Only Google profiles with a public name will create valid accounts.
* Submitting multiple secrets will overwrite the previous one for a user.

---

## ✅ To Do / Future Improvements

* Allow users to submit multiple secrets instead of just one
* Add email verification (optional)
* Add likes/comments on secrets
* Improve front-end UI and responsiveness

---

## 📃 License

MIT License. Free to use and modify for educational or non-commercial purposes.

---


## 💬 Feedback

Feel free to open an issue or PR if you find a bug or want to improve something!

```

---

You can save this as `README.md` in your project root. Let me know if you want it tailored further to your GitHub repo or want screenshots added!
```
