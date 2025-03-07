'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type LoginResponse = {
    message: string
    token: string
}

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate inputs
    if (!email || !password) {
        return {
            error: 'Email and password are required'
        }
    }

    try {
        // When making cross-origin requests with credentials, we need to handle cookies differently
        const response = await fetch('http://localhost:8080/user/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            // This enables sending and receiving cookies across domains
            credentials: 'include',
            // Required for server actions to work with cookies
            cache: 'no-store'
        })

        if (!response.ok) {
            const errorData = await response.json()
            return {
                error: errorData.message || 'Login failed'
            }
        }

        const data = await response.json() as LoginResponse

        // Since we're in a server component, we need to manually set the cookie
        // This is necessary because the cookie from the Go backend might not be forwarded correctly
        const cookieStore = await cookies()
        cookieStore.set({
            name: 'token',
            value: data.token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600, // 1 hour
            sameSite: 'lax'
        })

        return { success: true }
    } catch (error) {
        console.error('Login error:', error)
        return {
            error: 'Something went wrong. Please try again.'
        }
    }
}