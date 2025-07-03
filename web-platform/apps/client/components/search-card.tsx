"use client"

import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function SearchCard() {
  const router = useRouter()

  const handleSearchClick = () => {
    router.push("/search-page")
  }

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <Button
          onClick={handleSearchClick}
          variant="outline"
          className="w-full flex items-center justify-between text-gray-500 bg-gray-100 hover:bg-gray-200"
        >
          <span>Search routes and stops...</span>
          <Search size={18} />
        </Button>
      </CardContent>
    </Card>
  )
}
