import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, doc, updateDoc, getDoc, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Collection Reference
const getPatientsCollection = () => collection(db, 'patients');

/**
 * Add a new patient to Firestore
 */
export async function addPatient(patientData, createdByUid) {
    try {
        const docRef = await addDoc(getPatientsCollection(), {
            ...patientData,
            createdBy: createdByUid,
            createdAt: Timestamp.now()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding patient: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all patients
 */
export async function getAllPatients() {
    try {
        const querySnapshot = await getDocs(getPatientsCollection());
        const patients = [];
        querySnapshot.forEach((doc) => {
            patients.push({ id: doc.id, ...doc.data() });
        });
        return patients;
    } catch (error) {
        console.error("Error matching patients: ", error);
        return [];
    }
}

/**
 * Get patient by ID
 */
export async function getPatientById(patientId) {
    try {
        const docRef = doc(db, 'patients', patientId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting patient: ", error);
        return null;
    }
}

/**
 * Update Patient Profile
 */
export async function updatePatient(patientId, updatedData) {
    try {
        const docRef = doc(db, 'patients', patientId);
        await updateDoc(docRef, updatedData);
        return { success: true };
    } catch (error) {
        console.error("Error updating patient: ", error);
        return { success: false, error: error.message };
    }
}
