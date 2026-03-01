const TOKEN_KEY = 'tumavu_token'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 jours

export function setTokenCookie(token: string): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Strict${secure}`
}

export function getTokenCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function deleteTokenCookie(): void {
  document.cookie = `${TOKEN_KEY}=; Max-Age=0; Path=/; SameSite=Strict`
}
