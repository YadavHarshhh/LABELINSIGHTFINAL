import { useState, useEffect } from 'react'
import { products } from '@/lib/api'
import type { Analysis } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

interface ProductAnalysisProps {
  ean: string;
  name: string;
}

export function ProductAnalysis({ ean, name }: ProductAnalysisProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalysis = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await products.analyze(ean, name)
      setAnalysis(result)
    } catch (err) {
      setError('Failed to analyze product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [ean, name])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchAnalysis}>Retry Analysis</Button>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reality Check</CardTitle>
          <CardDescription>
            Analysis of product claims vs reality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {analysis.reality_check}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consumption Advice</CardTitle>
          <CardDescription>
            Recommended consumption frequency and patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {analysis.consumption_advice}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Implications</CardTitle>
          <CardDescription>
            Potential effects on health and well-being
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {analysis.health_implications}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 