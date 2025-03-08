import axios from 'axios';
import { cookies } from 'next/headers';
import { SearchBar } from '@/components/search-bar';

export default async function Dashboard() {
    // Get the token from cookies
    const cookieStore =await cookies();
    const token = cookieStore.get('token');

    const request = await axios.get('http://localhost:8080/user/profile', {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token.value}` })
        }
    });

    return (
        <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
            <SearchBar/>
        </div>
    );
}