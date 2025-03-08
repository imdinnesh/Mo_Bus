import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";




export default function middleware(req: NextRequest) {
    const token= req.cookies.get('token')
    if(!token){
        return NextResponse.redirect('http://localhost:3000/signin')
    }


}

export const config = {
    matcher: '/dashboard',
  }



