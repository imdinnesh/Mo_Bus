"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios";
import { SeachProps } from "@/models/searchprops";

type SearchResults={
    stop_id:number,
    stop_name:string,
}

export function SearchBar(){

    const [search, setSearch] = useState<string>("");
    const [result, setResult] = useState<SearchResults[]>([]);


    const seachroute=async()=>{

        const token=sessionStorage.getItem('token')

        const requestBody=SeachProps.safeParse({
            'route_number':search

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
                const response= await axios.post('http://localhost:8080/search/',requestBody.data,{
                    withCredentials:true,
                    headers:{
                        'Content-Type':'application/json',
                        ...(token && {'Authorization':`Bearer ${token}`})
                    }
                })
                if(response.status===200){
                    setResult(response.data.route_stops)
                }
            }
            catch(e){
                console.log(e)
            }
            
        }
        else{

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
            {
                result && result.map((item)=>(
                    <div key={item.stop_id}>{item.stop_name}</div>
                ))
            }
        </div>
    )
}

