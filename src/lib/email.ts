/**
 * Email Service
 * 
 * Handles sending emails for booking confirmations and cancellations.
 * Uses Nodemailer with SMTP configuration.
 * 
 * @module lib/email
 */

import nodemailer from 'nodemailer'
import { format } from 'date-fns'

/**
 * Email configuration from environment variables
 * 
 * Required env vars:
 * - SMTP_HOST: SMTP server host (e.g., smtp.gmail.com)
 * - SMTP_PORT: SMTP server port (e.g., 587)
 * - SMTP_USER: Email username
 * - SMTP_PASS: Email password or app password
 * - EMAIL_FROM: Sender email address
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@hairadresser.dk'

/**
 * Booking details interface
 */
interface BookingDetails {
    customerName: string
    customerEmail: string
    serviceName: string
    servicePrice: string | number
    date: Date
    startTime: string
    endTime: string
    salonName: string
    salonAddress?: string | null
    salonPhone?: string | null
    bookingId: string
    cancelToken?: string | null
}

/**
 * Sends a booking confirmation email to the customer
 * 
 * @param {BookingDetails} booking - The booking details
 * @returns {Promise<boolean>} True if email sent successfully
 */
export async function sendBookingConfirmation(booking: BookingDetails): Promise<boolean> {
    const formattedDate = format(new Date(booking.date), 'EEEE, MMMM d, yyyy')

    // Generate cancel URL if token exists
    const cancelUrl = booking.cancelToken
        ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/cancel?token=${booking.cancelToken}`
        : null

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <tr>
          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✂️ ${booking.salonName}</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0;">Booking Confirmation</p>
          </td>
        </tr>
        
        <tr>
          <td style="background-color: #16213e; padding: 30px; color: #e4e4e4;">
            <p style="font-size: 18px; margin: 0 0 20px 0;">
              Hi <strong style="color: white;">${booking.customerName}</strong>,
            </p>
            
            <p style="margin: 0 0 25px 0; color: #b4b4b4;">
              Your appointment has been confirmed! Here are the details:
            </p>
            
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.1);">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                  <span style="color: #888;">Service</span><br>
                  <strong style="color: white; font-size: 16px;">${booking.serviceName}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                  <span style="color: #888;">Date</span><br>
                  <strong style="color: white; font-size: 16px;">${formattedDate}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                  <span style="color: #888;">Time</span><br>
                  <strong style="color: white; font-size: 16px;">${booking.startTime} - ${booking.endTime}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0;">
                  <span style="color: #888;">Price</span><br>
                  <strong style="color: #ec4899; font-size: 20px;">${booking.servicePrice} kr</strong>
                </td>
              </tr>
            </table>
            
            ${booking.salonAddress ? `
            <div style="margin-top: 25px; padding: 15px; background-color: rgba(255,255,255,0.03); border-radius: 8px;">
              <p style="margin: 0; color: #888;">📍 Location</p>
              <p style="margin: 5px 0 0 0; color: white;">${booking.salonAddress}</p>
              ${booking.salonPhone ? `<p style="margin: 5px 0 0 0; color: #b4b4b4;">📞 ${booking.salonPhone}</p>` : ''}
            </div>
            ` : ''}
            
            ${cancelUrl ? `
            <div style="margin-top: 25px; padding: 15px; background-color: rgba(236, 72, 153, 0.1); border-radius: 8px; border: 1px solid rgba(236, 72, 153, 0.2);">
              <p style="margin: 0; color: #ec4899; font-size: 14px;">
                ⚠️ Need to cancel? You can cancel up to 24 hours before your appointment.
              </p>
              <a href="${cancelUrl}" style="display: inline-block; margin-top: 10px; color: #ec4899; font-size: 14px;">
                Cancel Appointment →
              </a>
            </div>
            ` : ''}
          </td>
        </tr>
        
        <tr>
          <td style="background-color: #0f0f23; padding: 20px; border-radius: 0 0 16px 16px; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              © ${new Date().getFullYear()} ${booking.salonName}. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

    const textContent = `
    Booking Confirmation - ${booking.salonName}
    
    Hi ${booking.customerName},
    
    Your appointment has been confirmed!
    
    Service: ${booking.serviceName}
    Date: ${formattedDate}
    Time: ${booking.startTime} - ${booking.endTime}
    Price: ${booking.servicePrice} kr
    
    ${booking.salonAddress ? `Location: ${booking.salonAddress}` : ''}
    ${booking.salonPhone ? `Phone: ${booking.salonPhone}` : ''}
    
    ${cancelUrl ? `To cancel your appointment (up to 24 hours before): ${cancelUrl}` : ''}
    
    See you soon!
    ${booking.salonName}
  `

    try {
        // Check if email is configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('📧 Email not configured. Would send to:', booking.customerEmail)
            console.log('Subject: Booking Confirmed -', booking.serviceName, 'on', formattedDate)
            return true // Pretend it worked for development
        }

        await transporter.sendMail({
            from: `"${booking.salonName}" <${FROM_EMAIL}>`,
            to: booking.customerEmail,
            subject: `✅ Booking Confirmed - ${booking.serviceName} on ${format(new Date(booking.date), 'MMM d')}`,
            text: textContent,
            html: htmlContent,
        })

        console.log('📧 Email sent to:', booking.customerEmail)
        return true
    } catch (error) {
        console.error('Failed to send email:', error)
        return false
    }
}

/**
 * Sends a cancellation confirmation email
 */
export async function sendCancellationEmail(booking: BookingDetails): Promise<boolean> {
    const formattedDate = format(new Date(booking.date), 'EEEE, MMMM d, yyyy')

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Cancelled</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <tr>
          <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✂️ ${booking.salonName}</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0;">Booking Cancelled</p>
          </td>
        </tr>
        
        <tr>
          <td style="background-color: #16213e; padding: 30px; color: #e4e4e4;">
            <p style="font-size: 18px; margin: 0 0 20px 0;">
              Hi <strong style="color: white;">${booking.customerName}</strong>,
            </p>
            
            <p style="margin: 0 0 25px 0; color: #b4b4b4;">
              Your appointment has been cancelled:
            </p>
            
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.1);">
              <tr>
                <td style="padding: 8px 0;">
                  <span style="color: #888;">Service:</span>
                  <span style="color: white; margin-left: 10px;">${booking.serviceName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <span style="color: #888;">Date:</span>
                  <span style="color: white; margin-left: 10px;">${formattedDate} at ${booking.startTime}</span>
                </td>
              </tr>
            </table>
            
            <p style="margin: 25px 0 0 0; color: #b4b4b4;">
              We hope to see you again soon! 
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking" style="color: #ec4899;">Book a new appointment →</a>
            </p>
          </td>
        </tr>
        
        <tr>
          <td style="background-color: #0f0f23; padding: 20px; border-radius: 0 0 16px 16px; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              © ${new Date().getFullYear()} ${booking.salonName}
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('📧 Would send cancellation email to:', booking.customerEmail)
            return true
        }

        await transporter.sendMail({
            from: `"${booking.salonName}" <${FROM_EMAIL}>`,
            to: booking.customerEmail,
            subject: `❌ Booking Cancelled - ${booking.serviceName}`,
            html: htmlContent,
        })

        return true
    } catch (error) {
        console.error('Failed to send cancellation email:', error)
        return false
    }
}
