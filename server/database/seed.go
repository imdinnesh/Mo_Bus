package database

import (
	"log"

	"gorm.io/gorm"
)

func SeedDatabase(db *gorm.DB) {
	// Seed Stops
	// stops := []Stop{
	// 	{StopName: "Stop A"},
	// 	{StopName: "Stop B"},
	// 	{StopName: "Stop C"},
	// 	{StopName: "Stop D"},
	// }

	// for i := range stops {
	// 	if err := db.Create(&stops[i]).Error; err != nil {
	// 		log.Fatalf("Failed to seed stops: %v", err)
	// 	}
	// }

	// // Seed Routes
	// routes := []Route{
	// 	{RouteNumber: "R1", RouteName: "Route 1", SourceStopID: stops[0].ID, DestinationStopID: stops[3].ID},
	// 	{RouteNumber: "R2", RouteName: "Route 2", SourceStopID: stops[1].ID, DestinationStopID: stops[2].ID},
	// }

	// for i := range routes {
	// 	if err := db.Create(&routes[i]).Error; err != nil {
	// 		log.Fatalf("Failed to seed routes: %v", err)
	// 	}
	// }

	// // Seed RouteStops
	// routeStops := []RouteStop{
	// 	{RouteID: routes[0].ID, StopID: stops[0].ID},
	// 	{RouteID: routes[0].ID, StopID: stops[1].ID},
	// 	{RouteID: routes[0].ID, StopID: stops[2].ID},
	// 	{RouteID: routes[0].ID, StopID: stops[3].ID},
	// 	{RouteID: routes[1].ID, StopID: stops[1].ID},
	// 	{RouteID: routes[1].ID, StopID: stops[2].ID},
	// }

	// for i := range routeStops {
	// 	if err := db.Create(&routeStops[i]).Error; err != nil {
	// 		log.Fatalf("Failed to seed route stops: %v", err)
	// 	}
	// }

	// log.Println("Database seeded successfully")

	stops:=[]Stop{
		{StopName: "Nandankanaa"},
		{StopName: "Nandan Kanan Hign School"},
		{StopName: "Dauladei Temple"},
		{StopName: "Raghunathpur Village"},
		{StopName: "Raghunathpur"},
		{StopName: "Royal Lagoon"},
		{StopName: "Mani Tribhuvan"},
		{StopName: "Nandan Vihar"},
		{StopName: "Sikharchandi Vihar"},
		{StopName: "KIIT Square"},
		{StopName: "KIIT Campus"},
		{StopName: "KIMS Hospital"},
		{StopName: "Shikharchandi"},
		{StopName: "Silicon Collage"},
		{StopName: "DLF Cyber City"},
		{StopName: "Infocity Square"},
		{StopName: "Trident College"},
		{StopName: "Sai Enclave"},
		{StopName: "S Vihar Jagannath Temple"},
		{StopName: "Sailashree Vihar Square"},
		{StopName: "Sailashree Vihar Phase 2"},
		{StopName: "Damana Square"},
		{StopName: "Niladri Vihar Square"},
		{StopName: "OMFED Square"},
		{StopName: "Rail Sadan"},
		{StopName: "Kalinga Hospital Sqaure"},
		{StopName: "OSAP 7th Battalion"},
		{StopName: "Press Sqaure"},
		{StopName: "Apollo Hospital"},
		{StopName: "Utkal University Gate 4"},
		{StopName: "Acharya Vihar Square"},
		{StopName: "Vani Vihar Square"},
		{StopName: "RD Women's College"},
		{StopName: "Rupali Square"},
		{StopName: "Maharshi College Square"},
		{StopName: "Satya Nagar Square"},
		{StopName: "Ram Mandir"},
		{StopName: "Shriya Square"},
		{StopName: "Master Canteen Janpath"},
		{StopName: "Bhubaneswar Railway Station"},
	}

	for i := range stops {
		if err := db.Create(&stops[i]).Error; err != nil {
			log.Fatalf("Failed to seed stops: %v", err)
		}
	}

	// all the above are for route 11

	routes := []Route{
		{RouteNumber: "11", RouteName: "Nandankanan-Bhubaneshwar Railway Station", SourceStopID: stops[0].ID, DestinationStopID: stops[39].ID},
		{RouteNumber: "11", RouteName: "Bhubaneshwar Railway Station-Nandankanan", SourceStopID: stops[39].ID, DestinationStopID: stops[0].ID},
	}

	for i := range routes {
		if err := db.Create(&routes[i]).Error; err != nil {
			log.Fatalf("Failed to seed routes: %v", err)
		}
	}


	for j:=0;j<2;j++{
		routeStops:=[]RouteStop{}
		for i:=0;i<40;i++{
			routeStops=append(routeStops,RouteStop{RouteID: routes[j].ID, StopID: stops[i].ID})
		}
		for i := range routeStops {
			if err := db.Create(&routeStops[i]).Error; err != nil {
				log.Fatalf("Failed to seed route stops: %v", err)
			}
		}
	}

	log.Println("Database seeded successfully")






}
