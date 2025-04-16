import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Scan, Search, Info, AlertCircle, Clock } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Discover the Truth About Your Food
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Scan any product barcode to get detailed insights about ingredients, nutritional value, and verify
                  manufacturer claims.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/scan">
                  <Button size="lg" className="gap-2">
                    <Scan className="h-4 w-4" />
                    Scan Barcode
                  </Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Search className="h-4 w-4" />
                    Search Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="text-muted-foreground">
                  Our application analyzes food products using barcode scanning technology and AI-powered insights to
                  give you the full picture.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <Scan className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Scan Product Barcode</h3>
                    <p className="text-sm text-muted-foreground">
                      Use your camera to scan any product barcode and instantly retrieve product information.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Info className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Analyze Ingredients</h3>
                    <p className="text-sm text-muted-foreground">
                      Get detailed breakdown of ingredients, nutritional information, and potential allergens.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Verify Claims</h3>
                    <p className="text-sm text-muted-foreground">
                      Compare manufacturer claims with reality using our AI-powered analysis.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Get Recommendations</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive personalized consumption recommendations and potential side effects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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
