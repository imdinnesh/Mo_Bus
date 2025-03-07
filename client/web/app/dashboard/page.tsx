"use client"
import { useState, useEffect } from 'react'
import { userroute } from '@/configs/url'

export default function TestAuth() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('http://localhost:8080/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
      } catch (err:any) {
        setError(err.message)
      }
    }
    
    fetchProfile()
  }, [])

  return (
    <div>
      <h1>Auth Test</h1>
      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}