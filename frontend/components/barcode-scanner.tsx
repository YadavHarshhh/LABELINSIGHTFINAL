"use client"

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { products } from '@/lib/api'
import { Button } from './ui/button'
import { useRouter } from 'next/router'

export function BarcodeScanner() {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (scanning && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: 250,
        },
        false
      )

      scannerRef.current.render(
        async (decodedText: string) => {
          // Stop scanning after successful scan
          if (scannerRef.current) {
            scannerRef.current.clear()
          }
          setScanning(false)

          try {
            // Get product details from API
            const product = await products.getByEan(decodedText)
            // Navigate to product page
            router.push(`/product/${product.ean}`)
          } catch (err) {
            setError('Product not found. Please try again.')
          }
        },
        (error: any) => {
          console.warn(`Code scan error = ${error}`)
        }
      )
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [scanning, router])

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="space-y-4">
        {!scanning ? (
          <Button
            onClick={() => setScanning(true)}
            className="w-full"
          >
            Start Scanning
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (scannerRef.current) {
                scannerRef.current.clear()
              }
              setScanning(false)
            }}
            variant="outline"
            className="w-full"
          >
            Stop Scanning
          </Button>
        )}

        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        {scanning && (
          <div id="reader" className="w-full"></div>
        )}
      </div>
    </div>
  )
}
