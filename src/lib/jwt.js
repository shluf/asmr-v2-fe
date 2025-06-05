export function useAuthTokenClient() {
  const getCookie = (name) => {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
  }

  const authToken = getCookie('auth_token')
 
  try {
    if (authToken) {
      const payload = extractJwtPayload(authToken)
      return {
        payload,
        authToken,
      }
    }
    return null
  } catch (error) {
    return null
  }
}

export function extractJwtPayload(token) {
  try {
    const tokenParts = token.split('.')
    if (tokenParts.length > 1) {
      return JSON.parse(atob(tokenParts[1]))
    }
    return null
  } catch (error) {
    return null
  }
} 