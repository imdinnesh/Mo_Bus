import { ActiveTickets } from "@/components/active-tickets";
import { SearchForm } from "@/components/search-form";

export default function DashboardPage(){
    
    return (
        <div>
            <SearchForm/>
            <ActiveTickets/>
        </div>
    )
}