/**
 * Utilities để xử lý LONGBLOB data từ database
 */

/**
 * Convert ArrayBuffer to base64 string
 */
export const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Convert base64 string to ArrayBuffer
 */
export const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * Convert LONGBLOB data to SVG string
 */
export const blobToSvgString = (blobData) => {
  try {
    // Nếu đã là string, return luôn
    if (typeof blobData === 'string') {
      // Nếu là base64, decode
      if (blobData.includes('base64,')) {
        return atob(blobData.split('base64,')[1])
      }
      // Nếu là base64 thuần, decode
      try {
        return atob(blobData)
      } catch {
        // Nếu không phải base64, return as is
        return blobData
      }
    }
    
    // Nếu là ArrayBuffer
    if (blobData instanceof ArrayBuffer) {
      const base64 = arrayBufferToBase64(blobData)
      return atob(base64)
    }
    
    // Nếu là Uint8Array
    if (blobData instanceof Uint8Array) {
      const base64 = btoa(String.fromCharCode.apply(null, blobData))
      return atob(base64)
    }
    
    return null
  } catch (error) {
    console.warn('Failed to convert blob to SVG string:', error)
    return null
  }
}

/**
 * Validate SVG string
 */
export const isValidSvg = (svgString) => {
  if (!svgString || typeof svgString !== 'string') return false
  return svgString.trim().startsWith('<svg') && svgString.includes('</svg>')
}

/**
 * Sanitize SVG string để đảm bảo an toàn
 */
export const sanitizeSvg = (svgString) => {
  if (!isValidSvg(svgString)) return null
  
  // Remove script tags và event handlers
  let sanitized = svgString
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
  
  return sanitized
}

/**
 * Create SVG data URL from string
 */
export const svgToDataUrl = (svgString) => {
  if (!isValidSvg(svgString)) return null
  
  const sanitized = sanitizeSvg(svgString)
  if (!sanitized) return null
  
  const encoded = encodeURIComponent(sanitized)
  return `data:image/svg+xml,${encoded}`
}

/**
 * Convert LONGBLOB to usable SVG data URL
 */
export const blobToSvgDataUrl = (blobData) => {
  const svgString = blobToSvgString(blobData)
  if (!svgString) return null
  
  return svgToDataUrl(svgString)
}

/**
 * Create React component from LONGBLOB SVG data
 */
export const createSvgComponent = (blobData, className = '', style = {}) => {
  const svgString = blobToSvgString(blobData)
  if (!svgString || !isValidSvg(svgString)) return null
  
  const sanitized = sanitizeSvg(svgString)
  if (!sanitized) return null
  
  // Add className to SVG if provided
  let finalSvg = sanitized
  if (className) {
    if (finalSvg.includes('class="')) {
      finalSvg = finalSvg.replace(/class="([^"]*)"/, `class="$1 ${className}"`)
    } else {
      finalSvg = finalSvg.replace('<svg', `<svg class="${className}"`)
    }
  }
  
  // Add style if provided
  if (Object.keys(style).length > 0) {
    const styleString = Object.entries(style)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`)
      .join(';')
    
    if (finalSvg.includes('style="')) {
      finalSvg = finalSvg.replace(/style="([^"]*)"/, `style="$1;${styleString}"`)
    } else {
      finalSvg = finalSvg.replace('<svg', `<svg style="${styleString}"`)
    }
  }
  
  return finalSvg
}

export default {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  blobToSvgString,
  isValidSvg,
  sanitizeSvg,
  svgToDataUrl,
  blobToSvgDataUrl,
  createSvgComponent
}
