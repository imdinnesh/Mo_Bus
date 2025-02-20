package database

import (
	"log"

	"gorm.io/gorm"
)

func SeedDatabase(db *gorm.DB) {
	// Seed Stops
	stops := []Stop{
		{StopName: "Stop A"},
		{StopName: "Stop B"},
		{StopName: "Stop C"},
		{StopName: "Stop D"},
	}

	for i := range stops {
		if err := db.Create(&stops[i]).Error; err != nil {
			log.Fatalf("Failed to seed stops: %v", err)
		}
	}

	// Seed Routes
	routes := []Route{
		{RouteNumber: "R1", RouteName: "Route 1", SourceStopID: stops[0].ID, DestinationStopID: stops[3].ID},
		{RouteNumber: "R2", RouteName: "Route 2", SourceStopID: stops[1].ID, DestinationStopID: stops[2].ID},
	}

	for i := range routes {
		if err := db.Create(&routes[i]).Error; err != nil {
			log.Fatalf("Failed to seed routes: %v", err)
		}
	}

	// Seed RouteStops
	routeStops := []RouteStop{
		{RouteID: routes[0].ID, StopID: stops[0].ID},
		{RouteID: routes[0].ID, StopID: stops[1].ID},
		{RouteID: routes[0].ID, StopID: stops[2].ID},
		{RouteID: routes[0].ID, StopID: stops[3].ID},
		{RouteID: routes[1].ID, StopID: stops[1].ID},
		{RouteID: routes[1].ID, StopID: stops[2].ID},
	}

	for i := range routeStops {
		if err := db.Create(&routeStops[i]).Error; err != nil {
			log.Fatalf("Failed to seed route stops: %v", err)
		}
	}

	log.Println("Database seeded successfully")
}
