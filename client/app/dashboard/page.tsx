import Link from "next/link";

export default function DashboardPage(){
    
    return (
        <div>
            <div>
                <Link href={"/trip?start=kiitsquare&end=infocitysquare"}>One way ticket</Link>
            </div>
        </div>
    )
}