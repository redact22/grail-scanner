import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onError?: (error: string) => void
  scanning?: boolean
}

type CameraState = 'idle' | 'requesting' | 'active' | 'captured' | 'error'

export function CameraCapture({ onCapture, onError, scanning = false }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraState, setCameraState] = useState<CameraState>('idle')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Start camera stream
  const startCamera = useCallback(async () => {
    setCameraState('requesting')
    setErrorMessage('')

    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraState('active')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Camera access denied'
      setErrorMessage(getCameraErrorMessage(message))
      setCameraState('error')
      onError?.(message)
    }
  }, [facingMode, onError])

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraState('idle')
  }, [])

  // Capture frame from video
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)

    // Convert to base64 at high quality for Gemini analysis
    const imageData = canvas.toDataURL('image/jpeg', 0.92)
    setCapturedImage(imageData)
    setCameraState('captured')

    // Forward to parent
    onCapture(imageData)
  }, [onCapture])

  // Retake photo
  const retake = useCallback(() => {
    setCapturedImage(null)
    setCameraState('active')
  }, [])

  // Switch camera (front/back)
  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }, [])

  // Restart camera when facing mode changes
  useEffect(() => {
    if (cameraState === 'active') {
      startCamera()
    }
  }, [facingMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Handle file upload as fallback
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('Image must be under 20MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const imageData = reader.result as string
      setCapturedImage(imageData)
      setCameraState('captured')
      onCapture(imageData)
    }
    reader.onerror = () => {
      setErrorMessage('Failed to read file')
    }
    reader.readAsDataURL(file)
  }, [onCapture])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Camera Viewfinder */}
      <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden">
        {/* Video Feed */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${cameraState !== 'active' ? 'hidden' : ''}`}
          autoPlay
          playsInline
          muted
        />

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Captured Image Preview */}
        <AnimatePresence>
          {capturedImage && cameraState === 'captured' && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={capturedImage}
              alt="Captured vintage item"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </AnimatePresence>

        {/* Scan Overlay */}
        <AnimatePresence>
          {scanning && cameraState === 'captured' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Scan line animation */}
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

              {/* Scanning text */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-cyan-400 text-sm font-mono bg-black/50 px-3 py-1 rounded"
                >
                  FORENSIC SCAN IN PROGRESS...
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Idle / Error State */}
        {(cameraState === 'idle' || cameraState === 'error') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 p-8">
            {cameraState === 'error' ? (
              <>
                <div className="text-red-400 text-5xl mb-4">!</div>
                <p className="text-red-300 text-center mb-4">{errorMessage}</p>
              </>
            ) : (
              <>
                <div className="text-gray-400 text-5xl mb-4">📷</div>
                <p className="text-gray-300 text-center mb-4">
                  Point your camera at a vintage item to begin forensic authentication
                </p>
              </>
            )}

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startCamera}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {cameraState === 'error' ? 'Retry Camera' : 'Open Camera'}
              </motion.button>

              <label className="w-full cursor-pointer">
                <div className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors">
                  Upload Image
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Requesting Permission State */}
        {cameraState === 'requesting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex justify-center gap-3">
        {cameraState === 'active' && (
          <>
            {/* Capture Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={captureFrame}
              className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 shadow-lg hover:border-cyan-400 transition-colors flex items-center justify-center"
            >
              <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-200" />
            </motion.button>

            {/* Switch Camera */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={switchCamera}
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              title="Switch camera"
            >
              ↻
            </motion.button>

            {/* Stop Camera */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={stopCamera}
              className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
              title="Close camera"
            >
              ✕
            </motion.button>
          </>
        )}

        {cameraState === 'captured' && !scanning && (
          <>
            {/* Retake */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={retake}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Retake
            </motion.button>
          </>
        )}
      </div>
    </div>
  )
}

// Map browser error messages to user-friendly text
function getCameraErrorMessage(error: string): string {
  if (error.includes('NotAllowedError') || error.includes('denied')) {
    return 'Camera access was denied. Please allow camera permissions in your browser settings.'
  }
  if (error.includes('NotFoundError') || error.includes('not found')) {
    return 'No camera found on this device. Try uploading an image instead.'
  }
  if (error.includes('NotReadableError') || error.includes('in use')) {
    return 'Camera is being used by another application. Close other apps and try again.'
  }
  if (error.includes('OverconstrainedError')) {
    return 'Camera does not support the requested settings. Try a different camera.'
  }
  return `Camera error: ${error}. Try uploading an image instead.`
}
