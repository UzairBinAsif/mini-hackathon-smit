// Wait for jsPDF to load via CDN
export async function loadJsPDF() {
    if (window.jspdf) return window.jspdf.jsPDF;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.onload = () => resolve(window.jspdf.jsPDF);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Generate and download a prescription PDF
 */
export async function downloadPrescriptionPDF(prescriptionData, patientInfo) {
    try {
        const jsPDF = await loadJsPDF();
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(11, 92, 255); // Primary color
        doc.text("AI Clinic Management", 105, 20, null, null, "center");

        doc.setFontSize(16);
        doc.setTextColor(30, 41, 59);
        doc.text("Medical Prescription", 105, 30, null, null, "center");

        doc.line(20, 35, 190, 35);

        // Doctor & Patient Info
        doc.setFontSize(12);
        doc.text(`Doctor: ${prescriptionData.doctorName}`, 20, 50);
        doc.text(`Patient: ${patientInfo.name}`, 20, 60);
        doc.text(`Age/Gender: ${patientInfo.age} / ${patientInfo.gender}`, 20, 70);

        // Date
        const date = prescriptionData.createdAt?.toDate ? prescriptionData.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString();
        doc.text(`Date: ${date}`, 150, 50);

        doc.line(20, 80, 190, 80);

        // Medicines
        doc.setFontSize(14);
        doc.setTextColor(11, 92, 255);
        doc.text("Rx", 20, 95);

        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        let yPos = 110;

        if (prescriptionData.medicines && prescriptionData.medicines.length > 0) {
            prescriptionData.medicines.forEach((med, index) => {
                doc.text(`${index + 1}. ${med.name} - ${med.dosage}`, 25, yPos);
                yPos += 10;
            });
        } else {
            doc.text("No medicines prescribed.", 25, yPos);
            yPos += 10;
        }

        // Notes
        if (prescriptionData.notes) {
            yPos += 10;
            doc.setFontSize(12);
            doc.setTextColor(100, 116, 139); // Muted
            doc.text("Notes/Instructions:", 20, yPos);
            yPos += 8;
            doc.setFontSize(11);

            // Handle text wrapping
            const lines = doc.splitTextToSize(prescriptionData.notes, 170);
            doc.text(lines, 20, yPos);
        }

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("This is an electronically generated document.", 105, 280, null, null, "center");

        // Trigger Download
        doc.save(`Prescription_${patientInfo.name.replace(/\s+/g, '_')}_${date}.pdf`);
        return true;
    } catch (error) {
        console.error("Error generating PDF", error);
        return false;
    }
}
