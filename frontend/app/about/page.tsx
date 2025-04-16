import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Scan, Search, AlertCircle, BarChart2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold mb-2">About Food Reality Check</h1>
          <p className="text-muted-foreground">
            Our mission is to provide transparency about the food products you consume
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="mb-4">
              Food Reality Check was created to bridge the gap between what food manufacturers claim and what's actually
              in your food. We believe consumers have the right to know exactly what they're putting in their bodies and
              how it might affect their health.
            </p>
            <p>
              Using a combination of barcode scanning technology, data from trusted sources like Open Food Facts, and
              AI-powered analysis, we provide you with comprehensive insights about food products that go beyond what's
              on the label.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Scan className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Barcode Scanning</h3>
                <p className="text-sm text-muted-foreground">
                  Scan any product barcode using your device's camera to instantly retrieve product information from our
                  database and external sources.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Data Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our system analyzes ingredients, nutritional information, and manufacturer claims to provide you with
                  a comprehensive assessment.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Health Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get information about potential allergens, side effects, and recommended consumption frequency based
                  on the product's ingredients.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Reality Check</h3>
                <p className="text-sm text-muted-foreground">
                  Compare manufacturer claims with reality using our AI-powered analysis to make more informed
                  purchasing decisions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Sources</h2>
            <p className="mb-4">
              Our application combines data from multiple sources to provide you with the most accurate information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Open Food Facts - A free, open database of food products from around the world</li>
              <li>BigBasket - For additional product information and verification</li>
              <li>Nutritional databases - For detailed nutritional analysis</li>
              <li>Allergy databases - To identify potential allergens</li>
              <li>AI analysis - Using advanced models to verify claims and provide recommendations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Get Started</h2>
            <p className="mb-6">
              Ready to discover the truth about your food? Start by scanning a product barcode or searching for products
              in our database.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
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
          </section>
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
