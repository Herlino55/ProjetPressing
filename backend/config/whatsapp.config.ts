export const WHATSAPP_PROVIDER = process.env.WHATSAPP_PROVIDER || "meta";
export const WHATSAPP_CONFIG = {
  meta: {
    token: process.env.META_WHATSAPP_TOKEN,
    phoneId: process.env.META_PHONE_NUMBER_ID,
    apiUrl: process.env.META_WHATSAPP_URL
  },
  twilio: {
    sid: process.env.TWILIO_ACCOUNT_SID,
    token: process.env.TWILIO_AUTH_TOKEN,
    number: process.env.TWILIO_WHATSAPP_NUMBER
  }
};
