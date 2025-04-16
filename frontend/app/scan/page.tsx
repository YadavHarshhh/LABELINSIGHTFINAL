"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Camera, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { SiteHeader } from "@/components/site-header"

export default function ScanPage() {
  const [scanning, setScanning] = useState(false)
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const router = useRouter()

  const handleScanResult = (result: string) => {
    setScannedCode(result)
    setScanning(false)
    // In a real app, you would validate the barcode format
    // For now, we'll just redirect to a product page with the code
    router.push(`/product/${result}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-sm font-medium hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Scan Product Barcode</h1>
          <p className="text-muted-foreground">Position the barcode within the scanner frame to analyze the product</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            {scanning ? (
              <div className="aspect-video relative overflow-hidden rounded-lg border bg-muted">
                <BarcodeScanner onScan={handleScanResult} onError={(error) => console.error(error)} />
                <Button variant="secondary" className="absolute bottom-4 right-4" onClick={() => setScanning(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                <div className="aspect-video flex items-center justify-center rounded-lg border border-dashed bg-muted">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Camera className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Camera access required for barcode scanning</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => setScanning(true)} className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    Start Scanning
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Don't have a product to scan? Try one of these example barcodes:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/product/5000112637922">
              <Button variant="outline" size="sm">
                5000112637922
              </Button>
            </Link>
            <Link href="/product/8901058851429">
              <Button variant="outline" size="sm">
                8901058851429
              </Button>
            </Link>
            <Link href="/product/8906002025375">
              <Button variant="outline" size="sm">
                8906002025375
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">© 2025 Food Reality Check. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6 justify-center sm:justify-end">
            <Link href="/terms" className="text-sm hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm hover:underline">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
