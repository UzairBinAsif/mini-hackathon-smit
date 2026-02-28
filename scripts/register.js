import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const registerForm = document.getElementById('register-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const roleInput = document.getElementById('role');
const errorDiv = document.getElementById('auth-error');
const registerBtn = document.getElementById('register-btn');

// Real-time form validation
function validateForm() {
    let isValid = true;

    // Name validation
    if (nameInput.value.trim().length < 2) {
        nameInput.classList.add('input-error');
        isValid = false;
    } else {
        nameInput.classList.remove('input-error');
        nameInput.classList.add('input-success');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add('input-error');
        isValid = false;
    } else {
        emailInput.classList.remove('input-error');
        emailInput.classList.add('input-success');
    }

    // Password validation
    if (passwordInput.value.length < 6) {
        passwordInput.classList.add('input-error');
        isValid = false;
    } else {
        passwordInput.classList.remove('input-error');
        passwordInput.classList.add('input-success');
    }

    // Role validation
    if (!roleInput.value) {
        roleInput.classList.add('input-error');
        isValid = false;
    } else {
        roleInput.classList.remove('input-error');
        roleInput.classList.add('input-success');
    }

    return isValid;
}

// Attach blur validation
[nameInput, emailInput, passwordInput, roleInput].forEach(input => {
    if (input) {
        input.addEventListener('blur', () => validateForm());
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
        });
    }
});

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';

        // Validate before submitting
        if (!validateForm()) {
            errorDiv.innerText = "Please fill in all fields correctly.";
            errorDiv.style.display = 'block';
            return;
        }

        registerBtn.disabled = true;
        registerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const role = roleInput.value;

        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create user document in Firestore following the suggested DB structure
            await setDoc(doc(db, 'users', user.uid), {
                id: user.uid,
                name: name,
                email: email,
                password: '***secured***', // Never store plaintext; Firebase Auth handles this
                role: role,
                subscriptionPlan: 'Free',
                createdAt: new Date().toISOString()
            });

            // 3. Redirect based on role
            switch (role) {
                case 'Admin': window.location.href = 'admin-dashboard.html'; break;
                case 'Doctor': window.location.href = 'doctor-dashboard.html'; break;
                case 'Receptionist': window.location.href = 'receptionist-dashboard.html'; break;
                case 'Patient': window.location.href = 'patient-dashboard.html'; break;
                default: window.location.href = 'login.html';
            }

        } catch (error) {
            console.error("Registration failed:", error);

            let errorMessage = error.message;
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered. Please log in instead.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password should be at least 6 characters.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Please enter a valid email address.";
            }

            errorDiv.innerText = errorMessage;
            errorDiv.style.display = 'block';
            registerBtn.disabled = false;
            registerBtn.innerHTML = '<i class="fa-solid fa-user-check"></i> Register';
        }
    });
}
