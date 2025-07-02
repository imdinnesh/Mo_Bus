import { axiosInstance } from "@/lib/axios";

export const getBalance=async()=>{
    const token = localStorage.getItem('accessToken') || '';
    const reponse=await axiosInstance.get("/transactions/get-balance",{
        headers:{
            Authorization:token
        }
    });
    return reponse.data.balance;
}

export const getTransactions=async()=>{
    const token = localStorage.getItem('accessToken') || '';
    const response=await axiosInstance.get("/transactions/get-transactions",{
        headers:{
            Authorization:token
        }
    });
    return response.data.transactions;
}