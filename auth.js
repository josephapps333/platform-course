/* ── DOM refs ───────────────────────────────────────────────── */
const loginScreen  = document.getElementById("login-screen");
const appEl        = document.getElementById("app");
const avatarImg    = document.getElementById("user-avatar");
const displayName  = document.getElementById("user-name");
const signOutBtn   = document.getElementById("btn-signout");
const signInBtn    = document.getElementById("btn-signin");

/* ── Google provider ────────────────────────────────────────── */
const provider = new firebase.auth.GoogleAuthProvider();

/* ── Sign in ────────────────────────────────────────────────── */
signInBtn.addEventListener("click", () => {
  firebase.auth().signInWithPopup(provider).catch(err => {
    console.error("Sign-in error:", err.message);
  });
});

/* ── Sign out ───────────────────────────────────────────────── */
signOutBtn.addEventListener("click", () => {
  firebase.auth().signOut();
});

/* ── Auth state listener ────────────────────────────────────── */
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // Show app, hide login screen
    loginScreen.style.display = "none";
    appEl.style.display       = "block";

    // Populate topbar
    avatarImg.src         = user.photoURL || "";
    avatarImg.alt         = user.displayName || "User";
    avatarImg.style.display = user.photoURL ? "block" : "none";
    displayName.textContent = user.displayName || user.email;

    // Boot the video player (only once), passing the user object
    if (typeof initApp === "function") initApp(user);
  } else {
    // Show login screen, hide app
    loginScreen.style.display = "flex";
    appEl.style.display       = "none";
  }
});
