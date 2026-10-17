const nodemailer = require('nodemailer');

require('dotenv').config();

let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'YOUR_16_DIGIT_APP_PASSWORD') {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

/**
 * Send Appointment Confirmation Email
 */
async function sendBookingConfirmation({ patientName, patientEmail, doctorName, doctorDept, date, time }) {
    if (!transporter) {
        console.log(`[Email Service] Mock Email to ${patientEmail}: Appointment booked with ${doctorName} on ${date} at ${time}`);
        return { success: true, simulated: true };
    }

    const mailOptions = {
        from: `"Clinic Care Medical" <${process.env.EMAIL_USER}>`,
        to: patientEmail,
        subject: `Appointment Confirmed with ${doctorName} - Clinic Care`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); padding: 30px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700;">🏥 Clinic Care Center</h1>
                    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Appointment Confirmation Notification</p>
                </div>
                
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #1e293b; margin-top: 0;">Dear <strong>${patientName}</strong>,</p>
                    <p style="color: #475569; line-height: 1.6;">Your appointment has been successfully scheduled. Below are your booking details:</p>
                    
                    <div style="background: #f8fafc; border-left: 4px solid #0d9488; padding: 18px 20px; border-radius: 6px; margin: 24px 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #64748b; font-size: 14px; width: 35%;">Doctor:</td>
                                <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 15px;">${doctorName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Specialty / Dept:</td>
                                <td style="padding: 6px 0; color: #0f172a; font-weight: 500; font-size: 14px;">${doctorDept}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Date:</td>
                                <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px;">📅 ${date}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Time:</td>
                                <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px;">⏰ ${time}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Status:</td>
                                <td style="padding: 6px 0;"><span style="background: #fef3c7; color: #92400e; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600;">Pending Confirmation</span></td>
                            </tr>
                        </table>
                    </div>

                    <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
                        Please arrive 15 minutes before your scheduled appointment time. If you need to reschedule or cancel, you can manage it from your patient dashboard.
                    </p>
                </div>

                <div style="background: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
                    Clinic Care Medical Center • Committed to Excellence in Healthcare<br/>
                    Support: support@cliniccare.com | Hotline: +880 1700-000000
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Service] Email sent successfully to ${patientEmail}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error('[Email Service] Failed to send email:', err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Send Status Update Notification Email
 */
async function sendStatusUpdateEmail({ patientName, patientEmail, doctorName, date, time, newStatus }) {
    if (!transporter) {
        console.log(`[Email Service] Status update (${newStatus}) simulated for ${patientEmail}`);
        return { success: true, simulated: true };
    }

    const isConfirmed = newStatus === 'Confirmed';
    const statusColor = isConfirmed ? '#16a34a' : '#dc2626';

    const mailOptions = {
        from: `"Clinic Care Medical" <${process.env.EMAIL_USER}>`,
        to: patientEmail,
        subject: `Appointment ${newStatus} - Clinic Care`,
        html: `
            <div style="font-family: sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 10px;">
                <h2 style="color: ${statusColor}; margin-top: 0;">Appointment ${newStatus}</h2>
                <p>Hello <strong>${patientName}</strong>,</p>
                <p>Your appointment with <strong>${doctorName}</strong> on <strong>${date} at ${time}</strong> has been marked as <strong style="color: ${statusColor};">${newStatus}</strong>.</p>
                <p style="color: #64748b; font-size: 13px;">Thank you for choosing Clinic Care Medical Center.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (e) {
        console.error('[Email Service] Failed status update email:', e.message);
    }
}

module.exports = {
    sendBookingConfirmation,
    sendStatusUpdateEmail
};
