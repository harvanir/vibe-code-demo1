'use client'

import { useEffect, useRef, useState } from 'react'
import type { ProductFilter } from '@/types/product'

interface FilterBarProps {
  filter: ProductFilter
  categories: string[]
  onApply: (filter: ProductFilter) => void
}

interface FilterFormState {
  category: string
  minPrice: string
  maxPrice: string
  keyword: string
}

function buildFormState(filter: ProductFilter): FilterFormState {
  return {
    category: filter.category ?? '',
    minPrice: filter.minPrice ?? '',
    maxPrice: filter.maxPrice ?? '',
    keyword: filter.keyword ?? '',
  }
}

export default function FilterBar({ filter, categories, onApply }: FilterBarProps) {
  const [form, setForm] = useState<FilterFormState>(() => buildFormState(filter))
  const skipNextKeywordAutoApply = useRef(true)

  useEffect(() => {
    skipNextKeywordAutoApply.current = true
    setForm(buildFormState(filter))
  }, [filter.category, filter.minPrice, filter.maxPrice, filter.keyword])

  useEffect(() => {
    if (skipNextKeywordAutoApply.current) {
      skipNextKeywordAutoApply.current = false
      return
    }

    const timeoutId = window.setTimeout(() => {
      const normalizedKeyword = form.keyword.trim()
      const currentKeyword = (filter.keyword ?? '').trim()

      if (normalizedKeyword === currentKeyword) {
        return
      }

      onApply({
        category: form.category,
        minPrice: form.minPrice,
        maxPrice: form.maxPrice,
        keyword: normalizedKeyword,
        size: filter.size ?? '10',
      })
    }, 500)

    return () => window.clearTimeout(timeoutId)
  }, [form, filter.keyword, filter.size, onApply])

  function updateField(field: keyof FilterFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleApply() {
    onApply({
      category: form.category,
      minPrice: form.minPrice,
      maxPrice: form.maxPrice,
      keyword: form.keyword.trim(),
      size: filter.size ?? '10',
    })
  }

  function handleClear() {
    const clearedForm = buildFormState({})
    skipNextKeywordAutoApply.current = true
    setForm(clearedForm)
    onApply({
      category: '',
      minPrice: '',
      maxPrice: '',
      keyword: '',
      size: filter.size ?? '10',
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-1 flex-1" style={{ minWidth: '180px' }}>
        <label className="text-xs font-semibold text-gray-600">Search</label>
        <input
          type="text"
          placeholder="Search by name..."
          value={form.keyword}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => updateField('keyword', e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApply()
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600">Category</label>
        <select
          value={form.category}
          onChange={(e) => updateField('category', e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 w-28">
        <label className="text-xs font-semibold text-gray-600">Min price ($)</label>
        <input
          type="number"
          min={0}
          placeholder="0"
          value={form.minPrice}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => updateField('minPrice', e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApply()
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-1 w-28">
        <label className="text-xs font-semibold text-gray-600">Max price ($)</label>
        <input
          type="number"
          min={0}
          placeholder="999"
          value={form.maxPrice}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => updateField('maxPrice', e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApply()
            }
          }}
        />
      </div>

      <button
        onClick={handleApply}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Apply filters
      </button>

      <button
        onClick={handleClear}
        className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Clear filters
      </button>
    </div>
  )
}