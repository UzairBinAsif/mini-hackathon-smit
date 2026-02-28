import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorDiv = document.getElementById('auth-error');
const loginBtn = document.getElementById('login-btn');

// Real-time form validation
function validateLogin() {
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add('input-error');
        isValid = false;
    } else {
        emailInput.classList.remove('input-error');
        emailInput.classList.add('input-success');
    }

    if (passwordInput.value.length < 6) {
        passwordInput.classList.add('input-error');
        isValid = false;
    } else {
        passwordInput.classList.remove('input-error');
        passwordInput.classList.add('input-success');
    }

    return isValid;
}

// Attach validation on blur
[emailInput, passwordInput].forEach(input => {
    if (input) {
        input.addEventListener('blur', () => validateLogin());
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
        });
    }
});

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';

        if (!validateLogin()) {
            errorDiv.innerText = "Please enter a valid email and password (min 6 chars).";
            errorDiv.style.display = 'block';
            return;
        }

        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role;

                // Store user info in sessionStorage for dashboard use
                sessionStorage.setItem('userUID', user.uid);
                sessionStorage.setItem('userName', userData.name);
                sessionStorage.setItem('userRole', role);
                sessionStorage.setItem('userEmail', userData.email);

                switch (role) {
                    case 'Admin': window.location.href = 'admin-dashboard.html'; break;
                    case 'Doctor': window.location.href = 'doctor-dashboard.html'; break;
                    case 'Receptionist': window.location.href = 'receptionist-dashboard.html'; break;
                    case 'Patient': window.location.href = 'patient-dashboard.html'; break;
                    default:
                        errorDiv.innerText = "Role not recognized. Contact your admin.";
                        errorDiv.style.display = 'block';
                }
            } else {
                errorDiv.innerText = "User profile not found in database. Please register first.";
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            console.error("Login failed:", error);

            let errorMessage = "Login failed. Please try again.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMessage = "Invalid email or password.";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many failed attempts. Please wait and try again.";
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = "Network error. Check your internet connection.";
            }

            errorDiv.innerText = errorMessage;
            errorDiv.style.display = 'block';
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
        }
    });
}