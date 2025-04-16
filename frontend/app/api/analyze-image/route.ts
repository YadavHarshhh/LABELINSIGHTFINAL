import { type NextRequest, NextResponse } from "next/server"
import { analyzeProductImage } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { imageUrl, productName } = await request.json()

    // Validate the request
    if (!imageUrl || !productName) {
      return NextResponse.json({ error: "Missing image URL or product name" }, { status: 400 })
    }

    // Call the Gemini Vision API to analyze the product image
    const analysis = await analyzeProductImage(imageUrl, productName)

    // Return the analysis
    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error in product image analysis API:", error)
    return NextResponse.json({ error: "Failed to analyze product image" }, { status: 500 })
  }
}
