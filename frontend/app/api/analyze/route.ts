import { type NextRequest, NextResponse } from "next/server"
import { analyzeProduct, type ProductAnalysisRequest } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

    // Check if the API key is available
    if (!apiKey) {
      console.error("Gemini API key is not configured")
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 })
    }

    console.log("API key is available")

    // Parse the request body
    const productData: ProductAnalysisRequest = await request.json()

    // Validate the request
    if (!productData.productName || !productData.ingredients) {
      return NextResponse.json({ error: "Missing required product information" }, { status: 400 })
    }

    console.log("Calling analyzeProduct with valid product data")
    // Call the Gemini API to analyze the product, explicitly passing the API key
    const analysis = await analyzeProduct(productData, apiKey)
    console.log("Analysis completed successfully")

    // Return the analysis
    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error in product analysis API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze product" },
      { status: 500 },
    )
  }
}
