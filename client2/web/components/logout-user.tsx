"use client"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export const LogoutUser = () => {
    const handleLogout= async () => {
        try{
            const reposne=await axios.post('http://localhost:8080/user/signout')

            if(reposne.statusText==='OK'){
                sessionStorage.removeItem('token') 
                toast.success(reposne.data.message || "User logged out successfully")
                window.location.href="/"

            }   
        }catch(err){
            if(axios.isAxiosError(err) && err.response){
                const errorMessage=err.response.data.error
                toast.error(errorMessage)
            }else{
                toast.error("An error occurred while logging out")
            }

        }

    }

    return(
        <div>
            <Button variant={"outline"} onClick={handleLogout}>Logout</Button>
        </div>
    )
}