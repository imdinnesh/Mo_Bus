import { cookies } from "next/headers"

export default async function ServerAuthTest() {
    let data: any = null
    let error: string | null = null

    try {
        // Get the token from cookies
        const cookieStore = await cookies()
        const token = cookieStore.get('token')

        // Make the request to the protected endpoint
        const response = await fetch('http://localhost:8080/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Forward the token as both cookie and Authorization header for maximum compatibility
                ...(token && { 'Cookie': `token=${token.value}` }),
                ...(token && { 'Authorization': `Bearer ${token.value}` })
            },
            // This is important for sending cookies from server components
            credentials: 'include',
            // Prevent caching for authenticated requests
            cache: 'no-store',
            // Required for proper Next.js server component fetch handling
            next: { revalidate: 0 }
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        data = await response.json()
    } catch (err: any) {
        error = err.message
        console.error('Authentication error:', err)
    }

    return (
        <div>
            <pre>
                <code>
                    {JSON.stringify({ data, error }, null, 2)}
                </code>
            </pre>
        </div>
    )
}