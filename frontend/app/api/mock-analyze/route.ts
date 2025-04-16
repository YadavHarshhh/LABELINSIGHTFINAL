import { type NextRequest, NextResponse } from "next/server"

// This is a mock API endpoint that returns pre-defined analysis results
// Use this if you're having issues with the Gemini API
export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get product information
    const productData = await request.json()

    // Create a mock response based on the product name
    const mockResponse = {
      claimsAnalysis: [
        {
          claim: "100% Whole Wheat",
          reality:
            "The product contains whole wheat flour as the primary ingredient, but also includes additives and preservatives.",
          match: 85,
        },
        {
          claim: "High fiber",
          reality:
            "The product contains moderate fiber content typical for whole wheat bread, but not exceptionally high.",
          match: 70,
        },
      ],
      healthInsights: [
        "Whole wheat bread provides complex carbohydrates and dietary fiber.",
        "Contains moderate amounts of protein which supports muscle maintenance.",
        "The sodium content is relatively high at 160mg per serving.",
        "Contains added sugar which contributes to the overall carbohydrate content.",
      ],
      consumptionRecommendation:
        "Can be consumed daily as part of a balanced diet. Limit to 2-3 slices per day due to sodium content.",
      sideEffects: [
        "May cause digestive discomfort in individuals with gluten sensitivity.",
        "The added sugar may contribute to blood sugar fluctuations in sensitive individuals.",
        "The sodium content may be a concern for those monitoring salt intake.",
      ],
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Return the mock analysis
    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error in mock product analysis API:", error)
    return NextResponse.json({ error: "Failed to analyze product" }, { status: 500 })
  }
}
