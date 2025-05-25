import { Bus, Clock, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const BusCard = ({
  number,
  name,
  type,
  route,
  nextArrival,
}: {
  number: string
  name: string
  type: string
  route?: string
  nextArrival?: string
}) => {
  const isAc = type === "AC"

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 mt-2">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Bus className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900">{number}</h3>
                <Badge
                  variant={isAc ? "default" : "secondary"}
                  className={`text-xs ${
                    isAc ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {type}
                </Badge>
              </div>
              <p className="text-gray-700 font-medium mb-1">{name}</p>
              {route && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin className="h-3 w-3" />
                  <span>{route}</span>
                </div>
              )}
              {nextArrival && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Next: {nextArrival}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const BusList = () => {
  const buses = [
    {
      number: "123",
      name: "City Express",
      type: "AC",
      route: "Downtown → Airport",
      nextArrival: "5 min",
    },
    {
      number: "456",
      name: "Local Shuttle",
      type: "Non-AC",
      route: "Mall → Station",
      nextArrival: "12 min",
    },
    {
      number: "789",
      name: "Metro Line",
      type: "AC",
      route: "North → South",
      nextArrival: "8 min",
    },
    {
      number: "101",
      name: "Night Service",
      type: "Non-AC",
      route: "Central → Suburbs",
      nextArrival: "15 min",
    },
  ]

  return (
    <div className="mt-4">
  
      <div className="h-96 overflow-y-auto pr-2">
        {buses.map((bus) => (
          <BusCard
            key={bus.number}
            number={bus.number}
            name={bus.name}
            type={bus.type}
            route={bus.route}
            nextArrival={bus.nextArrival}
          />
        ))}
      </div>
    </div>
  )
}
