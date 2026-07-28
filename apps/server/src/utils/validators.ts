import { Types } from 'mongoose'

export function validatePhoneNumber(phone: string): boolean {
  const e164Regex = /^\+[1-9]\d{1,14}$/
  return e164Regex.test(phone)
}

export function validateDisplayName(name: string): boolean {
  const nameRegex = /^[a-zA-Z0-9\s]{2,30}$/
  return nameRegex.test(name)
}

export function sanitizeText(text: string): string {
  if (!text) return ''
  // Basic HTML stripping and trimming
  return text.replace(/<[^>]*>?/gm, '').trim()
}

export function validateLanguageCode(code: string): boolean {
  // Common BCP-47 language codes
  const validCodes = ['en', 'es', 'fr', 'de', 'hi', 'ja', 'zh', 'ar', 'ru', 'pt']
  return validCodes.includes(code.toLowerCase())
}

export function validateChatId(id: string): boolean {
  return Types.ObjectId.isValid(id)
}
