import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, doc, updateDoc, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const getAppointmentsCollection = () => collection(db, 'appointments');

/**
 * Book an appointment
 */
export async function bookAppointment(data) {
    try {
        const docRef = await addDoc(getAppointmentsCollection(), {
            patientId: data.patientId,
            patientName: data.patientName,
            doctorId: data.doctorId,
            doctorName: data.doctorName,
            date: data.date, // ISO string
            status: 'pending', // pending, confirmed, completed, cancelled
            createdAt: Timestamp.now()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error booking appointment: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update Appointment Status
 */
export async function updateAppointmentStatus(appointmentId, status) {
    try {
        const docRef = doc(db, 'appointments', appointmentId);
        await updateDoc(docRef, { status });
        return { success: true };
    } catch (error) {
        console.error("Error updating appointment status: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get Doctor's Appointments
 */
export async function getDoctorAppointments(doctorId) {
    try {
        const q = query(getAppointmentsCollection(), where("doctorId", "==", doctorId));
        const querySnapshot = await getDocs(q);
        const appointments = [];
        querySnapshot.forEach((doc) => {
            appointments.push({ id: doc.id, ...doc.data() });
        });
        return appointments;
    } catch (error) {
        console.error("Error getting appointments: ", error);
        return [];
    }
}

/**
 * Get Patient's Appointments
 */
export async function getPatientAppointments(patientId) {
    try {
        const q = query(getAppointmentsCollection(), where("patientId", "==", patientId));
        const querySnapshot = await getDocs(q);
        const appointments = [];
        querySnapshot.forEach((doc) => {
            appointments.push({ id: doc.id, ...doc.data() });
        });
        return appointments;
    } catch (error) {
        console.error("Error getting patient appointments: ", error);
        return [];
    }
}
