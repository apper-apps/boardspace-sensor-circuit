export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength
}

export const validateMaxLength = (value, maxLength) => {
  return !value || value.toString().length <= maxLength
}

export const validateImageUrl = (url) => {
  if (!validateUrl(url)) return false
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i
  return imageExtensions.test(url) || url.includes('data:image/')
}

export const validateFileUrl = (url) => {
  if (!validateUrl(url)) return false
  // Allow common file hosting services and direct file URLs
  const filePatterns = [
    /drive\.google\.com/,
    /dropbox\.com/,
    /onedrive\.live\.com/,
    /sharepoint\.com/,
    /amazonaws\.com/,
    /cloudfront\.net/,
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar)$/i
  ]
  return filePatterns.some(pattern => pattern.test(url))
}