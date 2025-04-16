"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, XCircle, Info, Clock, Brain } from "lucide-react"
import type { ProductAnalysisResponse } from "@/lib/gemini"

interface AIAnalysisProps {
  product: any
  ean: string
}

export function AIAnalysis({ product, ean }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<ProductAnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("claims")

  const runAnalysis = async () => {
    setLoading(true)
    setError(null)

    try {
      // Prepare the request payload
      const payload = {
        productName: product.name,
        brand: product.brand,
        ingredients: product.ingredients,
        nutritionalInfo: product.nutritionalInfo,
        claims: product.claims?.map((c: any) => c.claim) || [],
        imageUrl: product.image,
      }

      // Call our API endpoint that uses Gemini
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze product")
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!analysis && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-primary" />
              AI Analysis
            </CardTitle>
            <CardDescription>Use Gemini to analyze this product and get AI-powered insights</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our AI can analyze the ingredients, nutritional information, and claims to provide you with:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-6">
              <li>Verification of manufacturer claims</li>
              <li>Health insights based on ingredients</li>
              <li>Consumption recommendations</li>
              <li>Potential side effects</li>
            </ul>
            <Button onClick={runAnalysis} className="w-full">
              <Brain className="mr-2 h-4 w-4" />
              Analyze with Gemini
            </Button>
            {error && (
              <div className="text-sm text-destructive mt-2 p-2 bg-destructive/10 rounded-md">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardHeader>
            <CardTitle>Running AI Analysis</CardTitle>
            <CardDescription>Gemini is analyzing the product data...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={45} className="w-full" />
              <p className="text-sm text-muted-foreground">
                This may take a few moments. We're analyzing ingredients, nutritional information, and verifying claims.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="claims">Claims Analysis</TabsTrigger>
              <TabsTrigger value="consumption">Consumption</TabsTrigger>
              <TabsTrigger value="effects">Health Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="claims">
              <Card>
                <CardHeader>
                  <CardTitle>Claims vs Reality</CardTitle>
                  <CardDescription>AI-powered analysis of manufacturer claims</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analysis.claimsAnalysis.length > 0 ? (
                      analysis.claimsAnalysis.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Claim: {item.claim}</p>
                              <p className="text-sm text-muted-foreground">Reality: {item.reality}</p>
                            </div>
                            <div className="flex items-center">
                              {item.match >= 80 ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              ) : item.match >= 50 ? (
                                <Info className="h-5 w-5 text-amber-500 mr-2" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive mr-2" />
                              )}
                              <span className="font-medium">{item.match}%</span>
                            </div>
                          </div>
                          <Progress value={item.match} />
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No claims were analyzed for this product.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="consumption">
              <Card>
                <CardHeader>
                  <CardTitle>Consumption Recommendations</CardTitle>
                  <CardDescription>Based on AI analysis of ingredients and nutritional values</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4 mb-6">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <p className="font-medium mb-2">Recommended Consumption</p>
                      <p>{analysis.consumptionRecommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="effects">
              <Card>
                <CardHeader>
                  <CardTitle>Health Insights & Side Effects</CardTitle>
                  <CardDescription>Based on AI analysis of ingredients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Health Insights</h3>
                      <ul className="space-y-2">
                        {analysis.healthInsights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Info className="h-5 w-5 text-primary mt-0.5" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Potential Side Effects</h3>
                      <ul className="space-y-2">
                        {analysis.sideEffects.map((effect, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => setAnalysis(null)}>
              Run New Analysis
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
