import { FaBusAlt } from "react-icons/fa";
const BusCard = ({ number, name, type }: {
    number: string;
    name: string;
    type: string;
}) => {

    const isAc = type === "AC";

    return (
        <div>
            <FaBusAlt className="text-2xl" />
            <h2>
                {number}
            </h2>
            <p>
                {name}
            </p>
            <p className={`w-20 text-md p-1 mt-2 text-white rounded-sm ${isAc ? "bg-blue-600" : "bg-green-600"}`}>
                {type}
            </p>
        </div>
    )

}


export const BusList = () => {
    return (
            <div className="mt-2">
                <BusCard number="123" name="City Express" type="AC" />
                <BusCard number="456" name="Local Shuttle" type="Non-AC" />
                <BusCard number="789" name="Metro Line" type="AC" />
                <BusCard number="101" name="Night Service" type="Non-AC" />
            </div>
    )
}