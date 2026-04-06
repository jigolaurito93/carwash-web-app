'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function Debug() {
  const [results, setResults] = useState({})

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Test 1: Raw query + error
    supabase.from('tiered_services').select('*').then(({data, error}) => {
      setResults(prev => ({...prev, tiered: {data: data?.length, error: error?.message}}))
    })
    
    // Test 2: Check policies exist
    supabase.rpc('check_policies').then(({data}) => {
      setResults(prev => ({...prev, policies: data}))
    })
  }, [])

  return (
    <pre>{JSON.stringify(results, null, 2)}</pre>
  )
}