import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { imageUrl, productName } = await request.json()

    // Validate the request
    if (!imageUrl || !productName) {
      return NextResponse.json({ error: "Missing image URL or product name" }, { status: 400 })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock analysis results
    return NextResponse.json({
      claims: [
        {
          claim: "100% Whole Wheat",
          reality: "Contains 100% whole wheat flour",
          match: 100,
        },
        {
          claim: "High fiber",
          reality: "Contains 3g of fiber per serving",
          match: 80,
        },
      ],
      healthInsights: [
        "Whole wheat bread is a good source of fiber and nutrients",
        "May help with digestion and heart health",
      ],
      consumptionRecommendations: [
        "Suitable for daily consumption",
        "Best consumed with protein-rich foods",
      ],
      potentialSideEffects: [
        "May cause bloating in some individuals",
        "Not suitable for those with gluten intolerance",
      ],
    })
  } catch (error) {
    console.error("Error in mock product image analysis API:", error)
    return NextResponse.json({ error: "Failed to analyze product image" }, { status: 500 })
  }
} 