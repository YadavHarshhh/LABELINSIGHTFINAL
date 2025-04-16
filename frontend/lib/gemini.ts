import { GoogleGenerativeAI } from "@google/generative-ai"

export interface ProductAnalysisRequest {
  productName: string
  brand: string
  ingredients: string
  nutritionalInfo: Record<string, number>
  claims?: string[]
  imageUrl?: string
}

export interface ClaimAnalysis {
  claim: string
  reality: string
  match: number // percentage match between claim and reality
}

export interface ProductAnalysisResponse {
  claimsAnalysis: ClaimAnalysis[]
  healthInsights: string[]
  consumptionRecommendation: string
  sideEffects: string[]
}

/**
 * Analyzes product information using Gemini
 */
export async function analyzeProduct(
  productData: ProductAnalysisRequest,
  apiKey: string,
): Promise<ProductAnalysisResponse> {
  try {
    console.log("Starting product analysis with Gemini")

    // Initialize the Gemini API with the provided API key
    const genAI = new GoogleGenerativeAI(apiKey)
    console.log("Initialized GoogleGenerativeAI")

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    console.log("Got generative model: gemini-1.5-flash")

    // Create a prompt for Gemini based on the product data
    const prompt = `
      Analyze this food product and provide insights:
      
      Product: ${productData.productName}
      Brand: ${productData.brand}
      Ingredients: ${productData.ingredients}
      Nutritional Information: ${JSON.stringify(productData.nutritionalInfo)}
      ${productData.claims ? `Claims: ${productData.claims.join(", ")}` : ""}
      
      Please provide the following in JSON format:
      1. Analysis of each claim (if any) with a reality check and percentage match
      2. Health insights based on ingredients and nutritional values
      3. Recommended consumption frequency
      4. Potential side effects or concerns
      
      Format your response as valid JSON with the following structure:
      {
        "claimsAnalysis": [
          {
            "claim": "claim text",
            "reality": "reality assessment",
            "match": percentage number
          }
        ],
        "healthInsights": ["insight 1", "insight 2"],
        "consumptionRecommendation": "recommendation text",
        "sideEffects": ["side effect 1", "side effect 2"]
      }
    `

    console.log("Sending request to Gemini API")
    // Generate content with Gemini
    const result = await model.generateContent(prompt)
    console.log("Received response from Gemini API")

    const response = await result.response
    const text = response.text()
    console.log("Extracted text from response")

    // Parse the JSON response
    try {
      // Extract the JSON part from the response
      const jsonMatch =
        text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/)

      const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, "") : text
      console.log("Extracted JSON string:", jsonStr.substring(0, 100) + "...")

      const analysisData = JSON.parse(jsonStr)
      console.log("Successfully parsed JSON response")

      return {
        claimsAnalysis: analysisData.claimsAnalysis || [],
        healthInsights: analysisData.healthInsights || [],
        consumptionRecommendation: analysisData.consumptionRecommendation || "No specific recommendation",
        sideEffects: analysisData.sideEffects || [],
      }
    } catch (error) {
      console.error("Failed to parse Gemini response:", error)
      console.log("Raw response text:", text.substring(0, 200) + "...")

      // Fallback to a default response
      return {
        claimsAnalysis: [],
        healthInsights: ["Could not analyze product with AI"],
        consumptionRecommendation: "Please consult nutritional guidelines",
        sideEffects: [],
      }
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    throw new Error(`Failed to analyze product with Gemini: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function analyzeProductImage(imageUrl: string, productName: string) {
  // Mock implementation for analyzing product image
  // In a real application, this function would use the Gemini API to analyze the image
  return {
    claimsAnalysis: [
      {
        claim: "Healthy",
        reality: "May not be as healthy as it seems",
        match: 60,
      },
    ],
    healthInsights: ["Contains some vitamins", "High in sugar"],
    consumptionRecommendation: "Consume in moderation",
    sideEffects: ["May cause sugar rush"],
  }
}
