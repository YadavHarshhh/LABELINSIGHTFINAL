"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { products } from '@/lib/api'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAll, setShowAll] = useState(false)

  const fetchProducts = async (pageNum = 1, query = "") => {
    setSearching(true)
    try {
      const data = await products.search(query, pageNum)
      if (query) {
        setResults(data)
      } else {
        setResults(prev => [...prev, ...data])
      }
      setTotalPages(Math.ceil(17820 / 10)) // Total products / items per page
    } catch (error) {
      console.error('Error fetching products:', error)
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    fetchProducts(1, searchQuery)
  }, [searchQuery])

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(nextPage, searchQuery)
    }
  }

  const handleShowAll = () => {
    setShowAll(true)
    setPage(1)
    setResults([])
    fetchProducts(1)
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
          <h1 className="text-3xl font-bold mb-2">Search Products</h1>
          <p className="text-muted-foreground">Search for products by name or brand</p>
        </div>

        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            onClick={handleShowAll}
            disabled={showAll}
          >
            Show All Products
          </Button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setShowAll(false); setResults([]); fetchProducts(1, searchQuery) }} className="mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter product name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        {results.length > 0 ? (
          <>
            <div className="grid gap-4">
              {results.map((product) => (
                <Link href={`/product/${product.ean}`} key={product.ean}>
                  <Card className="overflow-hidden transition-colors hover:bg-muted/50">
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
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {!searchQuery && page < totalPages && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={handleLoadMore}
                  disabled={searching}
                >
                  {searching ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        ) : searchQuery && !searching ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No products found matching "{searchQuery}"</p>
          </div>
        ) : null}
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
