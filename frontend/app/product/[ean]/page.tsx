"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Info, Clock, Loader2, Heart } from "lucide-react"
import { AIAnalysis } from "@/components/ai-analysis"
import { MockAIAnalysis } from "@/components/mock-ai-analysis"
import { SiteHeader } from "@/components/site-header"
import { products } from '@/lib/api'
import type { Product } from '@/lib/api'
import { ProductAnalysis } from '@/components/product-analysis'

export default function ProductPage() {
  const params = useParams()
  const ean = params.ean as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useRealAI, setUseRealAI] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await products.getByEan(ean)
        setProduct(data)
      } catch (err) {
        setError('Failed to load product details')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [ean])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertTriangle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-lg text-gray-600">{error || 'Product not found'}</p>
        <Link href="/" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/search" className="flex items-center text-sm font-medium hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{product.name}</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {product.image_url && (
                  <div className="relative w-full h-64 mb-4">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <dl className="space-y-4">
                  <div>
                    <dt className="font-medium">Brand</dt>
                    <dd className="text-muted-foreground">{product.brand}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Category</dt>
                    <dd className="text-muted-foreground">{product.category}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Ingredients</dt>
                    <dd className="text-muted-foreground whitespace-pre-line">
                      {product.ingredients}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Nutritional Information</dt>
                    <dd className="text-muted-foreground whitespace-pre-line">
                      {product.nutritional_info}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* Analysis */}
          <div>
            <ProductAnalysis ean={ean} name={product.name} />
          </div>
        </div>

        <Tabs defaultValue="nutrition">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          </TabsList>

          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle>Nutritional Information</CardTitle>
                <CardDescription>Per serving</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Calories</h3>
                    <p className="text-2xl font-bold">{product.nutritional_info?.calories || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Sugar</h3>
                    <p className="text-2xl font-bold">{product.nutritional_info?.sugar || 'N/A'}g</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Sodium</h3>
                    <p className="text-2xl font-bold">{product.nutritional_info?.sodium || 'N/A'}mg</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Protein</h3>
                    <p className="text-2xl font-bold">{product.nutritional_info?.protein || 'N/A'}g</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Fat</h3>
                    <p className="text-2xl font-bold">{product.nutritional_info?.fat || 'N/A'}g</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Carbs</h3>
                    <p className="text-2xl font-bold">{product.nutritional_info?.carbs || 'N/A'}g</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-analysis">
            {useRealAI ? (
              <AIAnalysis product={product} ean={ean as string} />
            ) : (
              <MockAIAnalysis product={product} ean={ean as string} />
            )}
          </TabsContent>

          <TabsContent value="basic-info">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Claims vs Reality</CardTitle>
                  <CardDescription>Based on database information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {product.claims?.map((claim, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{claim.claim}</span>
                          <Badge variant={claim.match >= 70 ? "default" : claim.match >= 40 ? "secondary" : "destructive"}>
                            {claim.match}% Match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{claim.reality}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Consumption & Side Effects</CardTitle>
                  <CardDescription>Based on database information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium mb-2">Consumption Recommendation</h3>
                        <p className="text-muted-foreground">{product.consumption_recommendation || 'No specific recommendations available.'}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Potential Side Effects</h3>
                      <ul className="space-y-1">
                        {product.side_effects?.map((effect, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
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
