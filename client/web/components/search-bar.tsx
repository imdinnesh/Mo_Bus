"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios";
import { SeachProps } from "@/models/searchprops";


type Stops = {
    stop_id: number;
    stop_name: string;
};

type RouteStops = {
    route_number: number;
    route_name: string;
};

type Result = {
    message: string;
    stops: Stops[] | null;
    route_stops: RouteStops[] | null;
};



export function SearchBar(){

    const [search, setSearch] = useState<string>("");
    const [result, setResult] = useState<Result | null>(null);
    

    const seachroute=async()=>{

        const token=sessionStorage.getItem('token')

        const requestBody=SeachProps.safeParse({
            'query':search

        })

        // if(requestBody.success){
        //     const response= await axios.post('http://localhost:8080/search/',requestBody.data,{
        //         withCredentials:true,
        //         headers:{
        //             'Content-Type':'application/json',
        //             ...(token && {'Authorization':`Bearer ${token}`})
        //         }
    
        //     })
        //     if(response.status===200){
        //         setResult(response.data.route_stops)
        //     }
        //     else{
        //         console.log('error')
        //     }

        // 
        
        if(requestBody.success){
            try{
                const response= await axios.post('http://localhost:8080/search/stops',requestBody.data,{
                    withCredentials:true,
                    headers:{
                        'Content-Type':'application/json',
                        ...(token && {'Authorization':`Bearer ${token}`})
                    }
                })
                if(response.status===200){
                    setResult(response.data)
                }
            }
            catch(e){
                console.log("Error");
            }
            
        }
        
    }


    return (
        <div>
            <Input
                type="text"
                placeholder="Search for route or destination"
                className="w-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}

            />
            <Button onClick={seachroute}>Search</Button>
        </div>
    )
}

