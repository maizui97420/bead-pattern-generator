export async function removeBackground(imageUrl: string, threshold: number = 30): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      canvas.width = img.width
      canvas.height = img.height
      
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data
      
      const cornerColors = [
        { r: pixels[0], g: pixels[1], b: pixels[2] },
        { r: pixels[(canvas.width - 1) * 4], g: pixels[(canvas.width - 1) * 4 + 1], b: pixels[(canvas.width - 1) * 4 + 2] },
        { r: pixels[(canvas.height - 1) * canvas.width * 4], g: pixels[(canvas.height - 1) * canvas.width * 4 + 1], b: pixels[(canvas.height - 1) * canvas.width * 4 + 2] },
        { r: pixels[(canvas.height - 1) * canvas.width * 4 + (canvas.width - 1) * 4], g: pixels[(canvas.height - 1) * canvas.width * 4 + (canvas.width - 1) * 4 + 1], b: pixels[(canvas.height - 1) * canvas.width * 4 + (canvas.width - 1) * 4 + 2] },
      ]
      
      const avgCornerColor = {
        r: cornerColors.reduce((sum, c) => sum + c.r, 0) / cornerColors.length,
        g: cornerColors.reduce((sum, c) => sum + c.g, 0) / cornerColors.length,
        b: cornerColors.reduce((sum, c) => sum + c.b, 0) / cornerColors.length,
      }
      
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        
        const distance = Math.sqrt(
          Math.pow(r - avgCornerColor.r, 2) +
          Math.pow(g - avgCornerColor.g, 2) +
          Math.pow(b - avgCornerColor.b, 2)
        )
        
        if (distance < threshold) {
          pixels[i + 3] = 0
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      const resultUrl = canvas.toDataURL('image/png')
      resolve(resultUrl)
    }
    
    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }
    
    img.src = imageUrl
  })
}

export async function removeBackgroundSmart(imageUrl: string, threshold: number = 40): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      canvas.width = img.width
      canvas.height = img.height
      
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data
      
      const backgroundColors: { r: number; g: number; b: number }[] = []
      const sampleStep = Math.max(1, Math.floor(Math.min(img.width, img.height) / 20))
      
      for (let y = 0; y < img.height; y += sampleStep) {
        for (let x = 0; x < img.width; x += sampleStep) {
          if (x < 5 || x > img.width - 6 || y < 5 || y > img.height - 6) {
            const i = (y * img.width + x) * 4
            backgroundColors.push({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] })
          }
        }
      }
      
      const avgBgColor = {
        r: backgroundColors.reduce((sum, c) => sum + c.r, 0) / backgroundColors.length,
        g: backgroundColors.reduce((sum, c) => sum + c.g, 0) / backgroundColors.length,
        b: backgroundColors.reduce((sum, c) => sum + c.b, 0) / backgroundColors.length,
      }
      
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        
        const rDiff = Math.abs(r - avgBgColor.r)
        const gDiff = Math.abs(g - avgBgColor.g)
        const bDiff = Math.abs(b - avgBgColor.b)
        
        const gray = (r + g + b) / 3
        const bgGray = (avgBgColor.r + avgBgColor.g + avgBgColor.b) / 3
        
        if (
          rDiff < threshold &&
          gDiff < threshold &&
          bDiff < threshold &&
          Math.abs(gray - bgGray) < threshold * 0.8
        ) {
          pixels[i + 3] = 0
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      const resultUrl = canvas.toDataURL('image/png')
      resolve(resultUrl)
    }
    
    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }
    
    img.src = imageUrl
  })
}
