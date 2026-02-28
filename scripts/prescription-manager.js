import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const getPrescriptionsCollection = () => collection(db, 'prescriptions');

/**
 * Add a new prescription
 */
export async function addPrescription(data) {
    try {
        const docRef = await addDoc(getPrescriptionsCollection(), {
            patientId: data.patientId,
            doctorId: data.doctorId,
            doctorName: data.doctorName,
            medicines: data.medicines, // Array of { name, dosage }
            notes: data.notes,
            createdAt: Timestamp.now()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding prescription: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get Patient Prescriptions
 */
export async function getPatientPrescriptions(patientId) {
    try {
        const q = query(getPrescriptionsCollection(), where("patientId", "==", patientId));
        const querySnapshot = await getDocs(q);
        const prescriptions = [];
        querySnapshot.forEach((doc) => {
            prescriptions.push({ id: doc.id, ...doc.data() });
        });
        return prescriptions;
    } catch (error) {
        console.error("Error getting prescriptions: ", error);
        return [];
    }
}
