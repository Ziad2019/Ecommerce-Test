// src/lib/email.ts
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(
  email: string,
  orderNumber: string,
  total: number,
  items: { name: string; quantity: number; price: number }[]
) {
  await resend.emails.send({
    from: "ShopNext <noreply@shopnext.com>",
    to: email,
    subject: `تأكيد الطلب #${orderNumber}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 16px; overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; font-size: 28px; margin: 0;">🎉 تم تأكيد طلبك!</h1>
          <p style="color: rgba(255,255,255,0.8); margin-top: 8px;">طلب رقم #${orderNumber}</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px;">
          <h2 style="color: #1f2937; font-size: 18px;">تفاصيل الطلب</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <thead>
              <tr style="border-bottom: 2px solid #e5e7eb;">
                <th style="text-align: right; padding: 12px 0; color: #6b7280; font-size: 14px;">المنتج</th>
                <th style="text-align: center; padding: 12px 0; color: #6b7280; font-size: 14px;">الكمية</th>
                <th style="text-align: left; padding: 12px 0; color: #6b7280; font-size: 14px;">السعر</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 12px 0; color: #374151; font-size: 14px;">${item.name}</td>
                  <td style="padding: 12px 0; text-align: center; color: #6b7280; font-size: 14px;">${item.quantity}</td>
                  <td style="padding: 12px 0; text-align: left; color: #374151; font-weight: 600; font-size: 14px;">
$$
{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <!-- Total -->
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: left;">
            <span style="font-size: 20px; font-weight: bold; color: #6366f1;">
              الإجمالي:
$$
{total.toFixed(2)}
            </span>
          </div>
          
          <!-- CTA -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" 
               style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-weight: 600;">
              تتبع طلبك
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 20px 30px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} ShopNext. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    `,
  })
}

// src/lib/email.ts (تكملة)

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: "ShopNext <noreply@shopnext.com>",
    to: email,
    subject: `مرحباً بك في ShopNext يا ${name}! 🎉`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; font-size: 28px; margin: 0;">مرحباً بك ${name}! 🎉</h1>
        </div>
        <div style="padding: 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.8;">
            نحن سعداء بانضمامك إلى عائلة ShopNext! ابدأ تجربة تسوق فريدة مع أفضل المنتجات وأقوى العروض.
          </p>
          <div style="background: #eef2ff; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="color: #6366f1; font-size: 14px; margin: 0 0 8px;">كود خصم ترحيبي</p>
            <p style="color: #4f46e5; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: 4px;">WELCOME20</p>
            <p style="color: #6b7280; font-size: 13px; margin-top: 8px;">خصم 20% على أول طلب</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" 
               style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-weight: 600;">
              ابدأ التسوق الآن
            </a>
          </div>
        </div>
        <div style="background: #f3f4f6; padding: 20px 30px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} ShopNext. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendShippingNotification(
  email: string,
  orderNumber: string,
  trackingNumber?: string
) {
  await resend.emails.send({
    from: "ShopNext <noreply@shopnext.com>",
    to: email,
    subject: `تم شحن طلبك #${orderNumber} 🚚`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; font-size: 28px; margin: 0;">🚚 طلبك في الطريق!</h1>
          <p style="color: rgba(255,255,255,0.8); margin-top: 8px;">طلب رقم #${orderNumber}</p>
        </div>
        <div style="padding: 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.8;">
            يسعدنا إخبارك بأن طلبك قد تم شحنه بنجاح وسيصلك خلال 3-5 أيام عمل.
          </p>
          ${trackingNumber ? `
            <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="color: #059669; font-size: 14px; margin: 0 0 8px;">رقم تتبع الشحنة</p>
              <p style="color: #047857; font-size: 22px; font-weight: 700; margin: 0; font-family: monospace;">${trackingNumber}</p>
            </div>
          ` : ""}
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" 
               style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-weight: 600;">
              تتبع طلبك
            </a>
          </div>
        </div>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

  await resend.emails.send({
    from: "ShopNext <noreply@shopnext.com>",
    to: email,
    subject: "إعادة تعيين كلمة المرور 🔐",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; font-size: 28px; margin: 0;">🔐 إعادة تعيين كلمة المرور</h1>
        </div>
        <div style="padding: 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.8;">
            تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك. اضغط على الزر أدناه لإنشاء كلمة مرور جديدة.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-weight: 600;">
              إعادة تعيين كلمة المرور
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px; text-align: center;">
            هذا الرابط صالح لمدة ساعة واحدة فقط. إذا لم تطلب إعادة التعيين، تجاهل هذا البريد.
          </p>
        </div>
      </div>
    `,
  })
}