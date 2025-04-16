"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

// Mock favorite products - in a real app, this would come from your API
const mockFavorites = [
  {
    ean: "5000112637922",
    name: "Coca-Cola Original",
    brand: "Coca-Cola",
    image: "/placeholder.svg?height=100&width=100",
    dateAdded: "2023-05-15",
  },
  {
    ean: "8906002025375",
    name: "Organic Honey",
    brand: "Nature's Nectar",
    image: "/placeholder.svg?height=100&width=100",
    dateAdded: "2023-05-10",
  },
]

export default function FavoritesPage() {
  const { user, loading } = useUser()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  // Show nothing while checking authentication
  if (loading || !user) {
    return null
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
          <h1 className="text-3xl font-bold mb-2">Saved Products</h1>
          <p className="text-muted-foreground">Products you've saved for later reference</p>
        </div>

        {mockFavorites.length > 0 ? (
          <div className="grid gap-4">
            {mockFavorites.map((product) => (
              <Card key={product.ean} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="mr-4">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="rounded-md object-contain bg-white"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <p className="text-xs text-muted-foreground">Saved on {product.dateAdded}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/product/${product.ean}`}>View</Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Heart className="h-4 w-4 fill-current text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven't saved any products yet.</p>
            <Button asChild>
              <Link href="/scan">Scan Products</Link>
            </Button>
          </div>
        )}
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
