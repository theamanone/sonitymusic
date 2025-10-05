import nodemailer from "nodemailer";

// Interface definitions
interface SubscriptionEmailData {
  name?: string;
  plan: string;
  amount?: number;
  currency?: string;
  manageUrl?: string;
}

interface TrackNotificationData {
  name?: string;
  trackTitle: string;
  artistName: string;
  trackUrl: string;
  coverArtUrl?: string;
}

interface DownloadCompleteData {
  name?: string;
  trackTitle: string;
  artistName: string;
  downloadUrl: string;
  fileSize: string;
  quality: string;
}

interface ListenHistoryData {
  name?: string;
  songsPlayed: number;
  totalListenTime: string;
  favoriteGenre: string;
  dashboardUrl: string;
}

// Create reusable transporter
const createTransporter = (): nodemailer.Transporter => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Resolve base URL
const resolveBaseUrl = (): string => {
  if (
    process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.trim() !== ""
  ) {
    return process.env.NEXT_PUBLIC_BASE_URL.endsWith("/")
      ? process.env.NEXT_PUBLIC_BASE_URL.slice(0, -1)
      : process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_BASE_URL || "https://sonity.app";
  }
  return "http://localhost:3000";
};

export const getSubscriptionUrl = (): string => {
  return `${resolveBaseUrl()}/premium`;
};

export const getDashboardUrl = (): string => {
  return `${resolveBaseUrl()}/dashboard`;
};

// Ultra-Premium Email Base Template
const createPremiumEmailTemplate = (content: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Sonity Music</title>

      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap');

        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: #ffffff;
          line-height: 1.6;
        }

        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(145deg, #1a1a1a, #0f0f0f);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(255, 0, 100, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
        }

        .gradient-text {
          background: linear-gradient(135deg, #ff006e, #fb5607, #ffbe0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 900;
        }

        .premium-button {
          display: inline-block;
          padding: 16px 32px;
          background: linear-gradient(135deg, #ff006e, #fb5607);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(255, 0, 110, 0.4);
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .premium-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(255, 0, 110, 0.6);
        }

        .stats-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
          backdrop-filter: blur(10px);
        }

        @media only screen and (max-width: 600px) {
          .email-container { width: 95% !important; margin: 10px auto !important; }
          .mobile-padding { padding: 20px !important; }
          .mobile-text { font-size: 16px !important; }
          .premium-button { padding: 14px 24px !important; font-size: 14px !important; }
        }
      </style>
    </head>

    <body>
      <div style="padding: 40px 20px;">
        <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
          ${content}
        </table>
      </div>
    </body>
    </html>
  `;
};

// Premium Header Component
const createEmailHeader = (
  title: string,
  subtitle: string,
  accentColor: string = "#ff006e"
): string => {
  return `
    <tr>
      <td style="padding: 48px 40px; text-align: center; background: linear-gradient(135deg, ${accentColor} 0%, #fb5607 100%); position: relative; overflow: hidden;">
        <div style="position: relative; z-index: 2;">
          <div style="display: inline-block; padding: 12px 28px; background: rgba(255, 255, 255, 0.15); border-radius: 50px; backdrop-filter: blur(20px); margin-bottom: 24px; border: 1px solid rgba(255, 255, 255, 0.2);">
            <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
              🎵 Sonity Music
            </h1>
          </div>
          <h2 style="margin: 0; font-size: 36px; font-weight: 700; color: #ffffff; line-height: 1.2; letter-spacing: -1px;">
            ${title}
          </h2>
          <p style="margin: 16px 0 0 0; font-size: 18px; color: rgba(255, 255, 255, 0.9); font-weight: 400;">
            ${subtitle}
          </p>
        </div>
        <div style="position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%); z-index: 1;"></div>
      </td>
    </tr>
  `;
};

// Premium Button Component
const createPremiumButton = (
  text: string,
  url: string,
  style: "primary" | "secondary" = "primary"
): string => {
  const buttonStyles = {
    primary: {
      background: "linear-gradient(135deg, #ff006e 0%, #fb5607 100%)",
      color: "#ffffff",
      shadow: "0 8px 32px rgba(255, 0, 110, 0.4)",
    },
    secondary: {
      background: "rgba(255, 255, 255, 0.1)",
      color: "#ffffff",
      shadow: "0 8px 32px rgba(255, 255, 255, 0.1)",
    },
  };

  const currentStyle = buttonStyles[style];

  return `
    <tr>
      <td style="padding: 32px 40px; text-align: center;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: auto;">
          <tr>
            <td style="border-radius: 12px; background: ${currentStyle.background}; box-shadow: ${currentStyle.shadow};">
              <a href="${url}" target="_blank" style="display: inline-block; padding: 18px 36px; font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 700; color: ${currentStyle.color}; text-decoration: none; border-radius: 12px; transition: all 0.3s ease;">
                ${text}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};

// Premium Footer Component
const createEmailFooter = (): string => {
  return `
    <tr>
      <td style="padding: 40px; text-align: center; background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px);">
        <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent); margin: 0 auto 32px auto; width: 200px;"></div>

        <div style="margin-bottom: 24px;">
          <img src="${resolveBaseUrl()}/logo.png" alt="Sonity Music" style="height: 40px; width: auto;" />
        </div>

        <p style="margin: 0 0 20px 0; font-size: 16px; color: #ffffff; font-weight: 600;">
          🎵 Sonity Music - Premium Streaming Experience
        </p>

        <p style="margin: 0 0 24px 0; font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.6; max-width: 400px; margin-left: auto; margin-right: auto;">
          This email was sent because you have an active account with Sonity Music.<br>
          Experience unlimited premium content at your fingertips.
        </p>

        <div style="margin-top: 32px;">
          <a href="${resolveBaseUrl()}" style="display: inline-block; margin: 0 16px; color: #ff006e; text-decoration: none; font-size: 14px; font-weight: 600; padding: 8px 16px; border: 1px solid rgba(255, 0, 110, 0.3); border-radius: 20px; transition: all 0.3s ease;">🏠 Dashboard</a>
          <a href="${resolveBaseUrl()}/support" style="display: inline-block; margin: 0 16px; color: #ff006e; text-decoration: none; font-size: 14px; font-weight: 600; padding: 8px 16px; border: 1px solid rgba(255, 0, 110, 0.3); border-radius: 20px; transition: all 0.3s ease;">💬 Support</a>
          <a href="${resolveBaseUrl()}/privacy" style="display: inline-block; margin: 0 16px; color: #ff006e; text-decoration: none; font-size: 14px; font-weight: 600; padding: 8px 16px; border: 1px solid rgba(255, 0, 110, 0.3); border-radius: 20px; transition: all 0.3s ease;">🔒 Privacy</a>
        </div>
      </td>
    </tr>
  `;
};

// 1. SUBSCRIPTION PURCHASED EMAIL
const generateSubscriptionPurchasedEmail = (
  data: SubscriptionEmailData
): string => {
  const name = data.name || "Valued Member";
  const plan = data.plan || "Premium";
  const planDisplayName = plan.charAt(0).toUpperCase() + plan.slice(1);
  const amountText =
    typeof data.amount === "number" && data.amount > 0
      ? `${data.currency || "USD"} ${data.amount.toLocaleString()}`
      : undefined;
  const manageUrl = data.manageUrl || getSubscriptionUrl();

  const header = createEmailHeader(
    `🎉 Welcome to ${planDisplayName}!`,
    `Your premium streaming experience starts now`,
    "#059669"
  );

  const content = `
    <tr>
      <td style="padding: 48px 40px; color: #ffffff;">
        <h3 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #ffffff;">
          Hi ${name},
        </h3>

        <p style="margin: 0 0 24px 0; font-size: 18px; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
          🚀 Congratulations! Your <strong style="color: #059669;">${planDisplayName}</strong> subscription is now active. Get ready for unlimited access to our premium music library!
        </p>

        ${
          amountText
            ? `
          <div class="stats-card">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="width: 50%; padding: 12px;">
                  <p style="margin: 0; font-size: 14px; color: rgba(255, 255, 255, 0.7); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subscription Plan</p>
                  <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: 700; color: #059669;">${planDisplayName}</p>
                </td>
                <td style="width: 50%; text-align: right; padding: 12px;">
                  <p style="margin: 0; font-size: 14px; color: rgba(255, 255, 255, 0.7); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Amount Paid</p>
                  <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: 700; color: #059669;">${amountText}</p>
                </td>
              </tr>
            </table>
          </div>
        `
            : ""
        }

        <div class="stats-card">
          <h4 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #ffffff;">
            🎵 Your ${planDisplayName} Benefits:
          </h4>
          <ul style="margin: 0; padding: 0 0 0 20px; color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.8;">
            <li style="margin-bottom: 12px;">🎶 Unlimited access to 50,000+ premium songs</li>
            <li style="margin-bottom: 12px;">🎵 High quality audio (320kbps) streaming</li>
            <li style="margin-bottom: 12px;">📱 Listen on any device, anywhere</li>
            <li style="margin-bottom: 12px;">⚡ Priority customer support</li>
            <li style="margin-bottom: 12px;">🔄 Cancel anytime, hassle-free</li>
          </ul>
        </div>

        <p style="margin: 32px 0 0 0; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.7);">
          Your subscription will automatically renew. Manage your plan, payment methods, or cancel anytime from your dashboard.
        </p>
      </td>
    </tr>
  `;

  const button = createPremiumButton(
    "🎵 Start Listening Now",
    manageUrl,
    "primary"
  );
  const footer = createEmailFooter();

  return createPremiumEmailTemplate(header + content + button + footer);
};

// 2. TRACK NOTIFICATION EMAIL
const generateTrackNotificationEmail = (
  data: TrackNotificationData
): string => {
  const name = data.name || "Fellow Listener";
  const trackTitle = data.trackTitle;
  const artistName = data.artistName;
  const trackUrl = data.trackUrl;
  const coverArtUrl = data.coverArtUrl;

  const header = createEmailHeader(
    "🎵 New Track Alert!",
    "Fresh music just dropped",
    "#8b5cf6"
  );

  const content = `
    <tr>
      <td style="padding: 48px 40px; color: #ffffff;">
        <h3 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #ffffff;">
          Hi ${name},
        </h3>

        <p style="margin: 0 0 32px 0; font-size: 18px; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
          🎉 <strong>${artistName}</strong> just released a new track you might love!
        </p>

        <div class="stats-card">
          ${
            coverArtUrl
              ? `
            <img src="${coverArtUrl}" alt="${trackTitle}" style="width: 100%; max-width: 480px; height: auto; border-radius: 12px; margin-bottom: 20px;" />
          `
              : ""
          }
          <h4 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.3;">
            ${trackTitle}
          </h4>
          <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.8);">
            by <strong style="color: #8b5cf6;">${artistName}</strong>
          </p>
        </div>

        <p style="margin: 32px 0 0 0; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.7);">
          Listen now and be among the first to experience this amazing new music!
        </p>
      </td>
    </tr>
  `;

  const button = createPremiumButton("▶️ Listen Now", trackUrl, "primary");
  const footer = createEmailFooter();

  return createPremiumEmailTemplate(header + content + button + footer);
};

// 3. DOWNLOAD COMPLETE EMAIL
const generateDownloadCompleteEmail = (data: DownloadCompleteData): string => {
  const name = data.name || "Valued User";
  const trackTitle = data.trackTitle;
  const artistName = data.artistName;
  const downloadUrl = data.downloadUrl;
  const fileSize = data.fileSize;
  const quality = data.quality;

  const header = createEmailHeader(
    "⬇️ Download Complete!",
    "Your track is ready for offline listening",
    "#10b981"
  );

  const content = `
    <tr>
      <td style="padding: 48px 40px; color: #ffffff;">
        <h3 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #ffffff;">
          Hi ${name},
        </h3>

        <p style="margin: 0 0 32px 0; font-size: 18px; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
          🎉 Great news! Your download is complete and ready for offline listening.
        </p>

        <div class="stats-card" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);">
          <h4 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #10b981;">
            📱 Download Details
          </h4>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="padding: 8px 0;">
                <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.8);"><strong>Track:</strong> ${trackTitle}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.8);"><strong>Artist:</strong> ${artistName}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.8);"><strong>Quality:</strong> ${quality}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.8);"><strong>File Size:</strong> ${fileSize}</p>
              </td>
            </tr>
          </table>
        </div>

        <p style="margin: 32px 0 0 0; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.7);">
          Your download will be available for 48 hours. Make sure to save it to your device!
        </p>
      </td>
    </tr>
  `;

  const button = createPremiumButton("📥 Download Now", downloadUrl, "primary");
  const footer = createEmailFooter();

  return createPremiumEmailTemplate(header + content + button + footer);
};

// 4. LISTEN HISTORY SUMMARY EMAIL
const generateListenHistoryEmail = (data: ListenHistoryData): string => {
  const name = data.name || "Music Lover";
  const songsPlayed = data.songsPlayed;
  const totalListenTime = data.totalListenTime;
  const favoriteGenre = data.favoriteGenre;
  const dashboardUrl = data.dashboardUrl;

  const header = createEmailHeader(
    "📊 Your Listening Stats",
    "See how much music you've enjoyed this month",
    "#3b82f6"
  );

  const content = `
    <tr>
      <td style="padding: 48px 40px; color: #ffffff;">
        <h3 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #ffffff;">
          Hi ${name},
        </h3>

        <p style="margin: 0 0 32px 0; font-size: 18px; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
          🎵 Here's a look at your amazing listening journey this month!
        </p>

        <div class="stats-card" style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3);">
          <h4 style="margin: 0 0 24px 0; font-size: 18px; font-weight: 700; color: #3b82f6; text-align: center;">
            📈 Your Monthly Stats
          </h4>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="width: 33.33%; text-align: center; padding: 16px;">
                <div style="font-size: 32px; font-weight: 900; color: #3b82f6; margin-bottom: 8px;">${songsPlayed}</div>
                <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); text-transform: uppercase; letter-spacing: 0.5px;">Songs Played</div>
              </td>
              <td style="width: 33.33%; text-align: center; padding: 16px; border-left: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="font-size: 32px; font-weight: 900; color: #3b82f6; margin-bottom: 8px;">${totalListenTime}</div>
                <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); text-transform: uppercase; letter-spacing: 0.5px;">Total Listen Time</div>
              </td>
              <td style="width: 33.33%; text-align: center; padding: 16px;">
                <div style="font-size: 18px; font-weight: 700; color: #3b82f6; margin-bottom: 8px;">${favoriteGenre}</div>
                <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); text-transform: uppercase; letter-spacing: 0.5px;">Favorite Genre</div>
              </td>
            </tr>
          </table>
        </div>

        <p style="margin: 32px 0 0 0; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.7); text-align: center;">
          Keep discovering! There's always something new to discover. 🚀
        </p>
      </td>
    </tr>
  `;

  const button = createPremiumButton(
    "📊 View Full Dashboard",
    dashboardUrl,
    "primary"
  );
  const footer = createEmailFooter();

  return createPremiumEmailTemplate(header + content + button + footer);
};

// Send Functions
const sendSubscriptionPurchasedEmail = async (
  to: string,
  data: SubscriptionEmailData
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const html = generateSubscriptionPurchasedEmail(data);
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_FROM || "Sonity Music <noreply@sonity.com>",
      to,
      subject: `🎉 Welcome to ${data.plan} - Your premium streaming starts now!`,
      html,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Error sending subscription email:", err);
    return false;
  }
};

const sendTrackNotificationEmail = async (
  to: string,
  data: TrackNotificationData
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const html = generateTrackNotificationEmail(data);

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_FROM || "Sonity Music <noreply@sonity.com>",
      to,
      subject: `🎵 New Track: ${data.trackTitle} by ${data.artistName}`,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Error sending track notification email:", err);
    return false;
  }
};

const sendDownloadCompleteEmail = async (
  to: string,
  data: DownloadCompleteData
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const html = generateDownloadCompleteEmail(data);

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_FROM || "Sonity Music <noreply@sonity.com>",
      to,
      subject: `⬇️ Download Ready: ${data.trackTitle}`,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Error sending download complete email:", err);
    return false;
  }
};

const sendListenHistoryEmail = async (
  to: string,
  data: ListenHistoryData
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const html = generateListenHistoryEmail(data);

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_FROM || "Sonity Music <noreply@sonity.com>",
      to,
      subject: `📊 Your Monthly Listening Stats - ${data.songsPlayed} songs played!`,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Error sending listen history email:", err);
    return false;
  }
};

// Export all functions
export {
  sendSubscriptionPurchasedEmail,
  sendTrackNotificationEmail,
  sendDownloadCompleteEmail,
  sendListenHistoryEmail,
  generateSubscriptionPurchasedEmail,
  generateTrackNotificationEmail,
  generateDownloadCompleteEmail,
  generateListenHistoryEmail,
};
