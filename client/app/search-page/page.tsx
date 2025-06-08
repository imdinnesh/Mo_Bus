import { SearchForm } from "@/components/search-form"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Search Routes & Stops</h1>
        <SearchForm />
      </div>
    </div>
  )
}
