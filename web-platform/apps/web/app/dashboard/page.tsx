"use client"
import { useAuthStore } from "@/store/auth-store"

export default function DashboardPage() {

    const accessToken=useAuthStore(state=>state.accessToken)

    return(
        <div>
            Token is {accessToken}

        </div>
    )
}