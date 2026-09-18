/**
 * Куда слать подтверждающий перевод.
 * На проде задайте VITE_CONFIRM_WALLET в панели Vercel / Render.
 */
export const CONFIRM_WALLET =
  (import.meta.env.VITE_CONFIRM_WALLET as string | undefined)?.trim() ||
  '0x7A9f8C3E2B1D4A5F6E7C8B9A0D1E2F3A4B5C6D7E'

/** Сколько DEL нужно перевести для подтверждения участия */
export const CONFIRM_AMOUNT_DEL = Number(import.meta.env.VITE_CONFIRM_AMOUNT_DEL) || 1

export const CONFIRM_EXPLORER = 'https://explorer.decimalchain.com'
