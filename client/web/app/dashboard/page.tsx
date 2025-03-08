import axios from 'axios';

export default async function Dashboard(){

    const request = await axios.get('http://localhost:8080/user/profile',{
        withCredentials:true
    },
    )

    console.log(request.data)

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )

}