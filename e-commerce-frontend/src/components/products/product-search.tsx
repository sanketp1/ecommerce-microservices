'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { debounce } from '@/lib/utils'

interface ProductSearchProps {
  value: string
  onSearch: (search: string) => void
  placeholder?: string
}

export function ProductSearch({ value, onSearch, placeholder = "Search products..." }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState(value)

  // Debounced search
  const debouncedSearch = debounce((term: string) => {
    onSearch(term)
  }, 300)

  useEffect(() => {
    setSearchTerm(value)
  }, [value])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    debouncedSearch(term)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 