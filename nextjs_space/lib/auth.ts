const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'eletromaniadistribuidora@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Eletro@2025'

export function checkAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

export function setAdminSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('admin_logged_in', 'true')
    sessionStorage.setItem('admin_login_time', Date.now().toString())
  }
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('admin_logged_in')
    sessionStorage.removeItem('admin_login_time')
  }
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  const loggedIn = sessionStorage.getItem('admin_logged_in')
  const loginTime = sessionStorage.getItem('admin_login_time')
  if (!loggedIn || !loginTime) return false
  // Session expires after 8 hours
  const eightHours = 8 * 60 * 60 * 1000
  if (Date.now() - parseInt(loginTime) > eightHours) {
    clearAdminSession()
    return false
  }
  return loggedIn === 'true'
}
