import nodemailer from 'nodemailer';
import { OrderData } from '@/app/api/orders/route';
import { CountryConfig } from '@/config/countries';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Get email configuration from environment variables
function getEmailConfig(): EmailConfig {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };
}

// Create email transporter
function createTransporter() {
  const config = getEmailConfig();
  
  if (!config.auth.user || !config.auth.pass) {
    console.warn('⚠️ Email configuration missing. Email notifications will be skipped.');
    return null;
  }
  
  return nodemailer.createTransport(config);
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(
  orderData: OrderData,
  countryConfig: CountryConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('📧 Email transporter not configured. Skipping email notification.');
      return { success: true }; // Don't fail the order if email is not configured
    }

    const emailFrom = process.env.EMAIL_FROM || 'noreply@dermotin.com';
    
    // Email content based on locale
    const isBosnian = orderData.locale === 'ba';
    
    const subject = isBosnian 
      ? `Potvrda narudžbe #${orderData.orderId} - DERMOTIN`
      : `Potvrda porudžbine #${orderData.orderId} - DERMOTIN`;
    
    const greeting = isBosnian ? 'Poštovani' : 'Poštovani';
    const thankYou = isBosnian 
      ? 'Hvala vam na narudžbi!' 
      : 'Hvala vam na porudžbini!';
    
    const orderDetails = isBosnian ? 'Detalji narudžbe:' : 'Detalji porudžbine:';
    const product = isBosnian ? 'Proizvod:' : 'Proizvod:';
    const quantity = isBosnian ? 'Količina:' : 'Količina:';
    const total = isBosnian ? 'Ukupno:' : 'Ukupno:';
    const delivery = isBosnian ? 'Dostava:' : 'Dostava:';
    const paymentMethod = isBosnian ? 'Način plaćanja:' : 'Način plaćanja:';
    const cod = isBosnian ? 'Plaćanje pouzećem' : 'Plaćanje pouzećem';
    
    const contactInfo = isBosnian 
      ? 'Kontaktirat ćemo vas u najkraćem roku za potvrdu narudžbe.'
      : 'Kontaktiraćemo vas u najkraćem roku za potvrdu porudžbine.';
    
    const support = isBosnian 
      ? 'Za sva pitanja možete nas kontaktirati:'
      : 'Za sva pitanja možete nas kontaktirati:';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF6B35; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { background-color: #608E7E; color: white; padding: 15px; text-align: center; }
          .highlight { color: #FF6B35; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DERMOTIN</h1>
            <h2>${thankYou}</h2>
          </div>
          
          <div class="content">
            <p>${greeting} ${orderData.customerName},</p>
            
            <p>${contactInfo}</p>
            
            <div class="order-details">
              <h3>${orderDetails}</h3>
              <p><strong>Broj narudžbe:</strong> <span class="highlight">${orderData.orderId}</span></p>
              <p><strong>${product}</strong> ${orderData.productName} (${orderData.productVariant})</p>
              <p><strong>${quantity}</strong> ${orderData.quantity}</p>
              <p><strong>${delivery}</strong> ${orderData.courierName} - ${orderData.deliveryTime}</p>
              <p><strong>${paymentMethod}</strong> ${cod}</p>
              <p><strong>${total}</strong> <span class="highlight">${orderData.totalPrice} ${orderData.currency}</span></p>
            </div>
            
            <p><strong>Adresa dostave:</strong><br>
            ${orderData.customerName}<br>
            ${orderData.customerAddress}<br>
            ${orderData.customerCity} ${orderData.customerPostalCode}</p>
            
            <p><strong>Kontakt:</strong><br>
            Telefon: ${orderData.customerPhone}<br>
            Email: ${orderData.customerEmail}</p>
          </div>
          
          <div class="footer">
            <p>${support}</p>
            <p>📞 ${countryConfig.company.phone}</p>
            <p>📧 ${countryConfig.company.email}</p>
            <p>🌐 ${countryConfig.company.website}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
${thankYou}

${greeting} ${orderData.customerName},

${contactInfo}

${orderDetails}
Broj narudžbe: ${orderData.orderId}
${product} ${orderData.productName} (${orderData.productVariant})
${quantity} ${orderData.quantity}
${delivery} ${orderData.courierName} - ${orderData.deliveryTime}
${paymentMethod} ${cod}
${total} ${orderData.totalPrice} ${orderData.currency}

Adresa dostave:
${orderData.customerName}
${orderData.customerAddress}
${orderData.customerCity} ${orderData.customerPostalCode}

Kontakt:
Telefon: ${orderData.customerPhone}
Email: ${orderData.customerEmail}

${support}
📞 ${countryConfig.company.phone}
📧 ${countryConfig.company.email}
🌐 ${countryConfig.company.website}

DERMOTIN
    `;

    // Send email to customer
    await transporter.sendMail({
      from: emailFrom,
      to: orderData.customerEmail,
      subject: subject,
      text: textContent,
      html: htmlContent,
    });

    // Send notification email to company (optional)
    const companyEmail = countryConfig.company.email;
    if (companyEmail && companyEmail !== emailFrom) {
      const notificationSubject = isBosnian 
        ? `Nova narudžba #${orderData.orderId}`
        : `Nova porudžbina #${orderData.orderId}`;
      
      await transporter.sendMail({
        from: emailFrom,
        to: companyEmail,
        subject: notificationSubject,
        text: `Nova narudžba primljena:\n\n${textContent}`,
        html: htmlContent,
      });
    }

    console.log(`✅ Order confirmation email sent to ${orderData.customerEmail}`);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    };
  }
}

// Send order status update email
export async function sendOrderStatusEmail(
  orderId: string,
  customerEmail: string,
  customerName: string,
  status: string,
  trackingNumber?: string,
  locale: string = 'rs'
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('📧 Email transporter not configured. Skipping status email.');
      return { success: true };
    }

    const emailFrom = process.env.EMAIL_FROM || 'noreply@dermotin.com';
    const isBosnian = locale === 'ba';
    
    let statusText = '';
    let subject = '';
    
    switch (status) {
      case 'confirmed':
        statusText = isBosnian ? 'potvrđena' : 'potvrđena';
        subject = isBosnian 
          ? `Narudžba #${orderId} je potvrđena - DERMOTIN`
          : `Porudžbina #${orderId} je potvrđena - DERMOTIN`;
        break;
      case 'shipped':
        statusText = isBosnian ? 'poslana' : 'poslata';
        subject = isBosnian 
          ? `Narudžba #${orderId} je poslana - DERMOTIN`
          : `Porudžbina #${orderId} je poslata - DERMOTIN`;
        break;
      case 'delivered':
        statusText = isBosnian ? 'dostavljena' : 'dostavljena';
        subject = isBosnian 
          ? `Narudžba #${orderId} je dostavljena - DERMOTIN`
          : `Porudžbina #${orderId} je dostavljena - DERMOTIN`;
        break;
      default:
        statusText = status;
        subject = isBosnian 
          ? `Ažuriranje narudžbe #${orderId} - DERMOTIN`
          : `Ažuriranje porudžbine #${orderId} - DERMOTIN`;
    }

    const greeting = isBosnian ? 'Poštovani' : 'Poštovani';
    const orderText = isBosnian ? 'Vaša narudžba' : 'Vaša porudžbina';
    const trackingText = isBosnian ? 'Broj za praćenje:' : 'Broj za praćenje:';
    
    let content = `${greeting} ${customerName},\n\n${orderText} #${orderId} je ${statusText}.`;
    
    if (trackingNumber) {
      content += `\n\n${trackingText} ${trackingNumber}`;
    }
    
    content += '\n\nHvala vam što ste izabrali DERMOTIN!\n\nDERMOTIN tim';

    await transporter.sendMail({
      from: emailFrom,
      to: customerEmail,
      subject: subject,
      text: content,
    });

    console.log(`✅ Order status email sent to ${customerEmail} for order ${orderId}`);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Failed to send order status email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    };
  }
}
