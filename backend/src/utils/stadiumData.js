/**
 * StadiumIQ — Stadium Reference Data
 * Static reference data for stadium layout, sections, gates, and services.
 */

const stadiumData = {
  name: "Lusail Iconic Stadium",
  city: "Lusail",
  country: "Qatar",
  capacity: 92000,

  gates: [
    { id: "G1", name: "Gate 1 — North Entrance", zone: "North Stand", accessibleRoute: true },
    { id: "G2", name: "Gate 2 — South Entrance", zone: "South Stand", accessibleRoute: true },
    { id: "G3", name: "Gate 3 — East Entrance", zone: "East Stand", accessibleRoute: false },
    { id: "G4", name: "Gate 4 — West Entrance", zone: "West Stand", accessibleRoute: true },
    { id: "G5", name: "Gate 5 — VIP Entrance", zone: "VIP Box", accessibleRoute: true },
    { id: "G6", name: "Gate 6 — Media Entrance", zone: "Media Center", accessibleRoute: false },
  ],

  sections: [
    { id: "NS", name: "North Stand", capacity: 20000, level: "General" },
    { id: "SS", name: "South Stand", capacity: 20000, level: "General" },
    { id: "ES", name: "East Stand", capacity: 18000, level: "General" },
    { id: "WS", name: "West Stand", capacity: 18000, level: "General" },
    { id: "VIP", name: "VIP Box", capacity: 5000, level: "VIP" },
    { id: "MC", name: "Media Center", capacity: 2000, level: "Media" },
    { id: "ACC", name: "Accessibility Section", capacity: 1000, level: "Accessibility" },
  ],

  services: {
    medical: [
      { id: "M1", location: "North Stand — Level 1", phone: "+974-111-0001" },
      { id: "M2", location: "South Stand — Level 1", phone: "+974-111-0002" },
      { id: "M3", location: "Central Hub", phone: "+974-111-0003" },
    ],
    foodCourts: [
      { id: "FC1", location: "North Concourse", zones: ["NS"] },
      { id: "FC2", location: "South Concourse", zones: ["SS"] },
      { id: "FC3", location: "East Concourse", zones: ["ES", "WS"] },
    ],
    restrooms: [
      { id: "R1", location: "North Stand — Level 1", accessible: true },
      { id: "R2", location: "South Stand — Level 1", accessible: true },
      { id: "R3", location: "East Stand — Level 2", accessible: false },
      { id: "R4", location: "VIP Level", accessible: true },
    ],
    atms: [
      { id: "ATM1", location: "Main Concourse — Gate 1 Area" },
      { id: "ATM2", location: "South Entrance Lobby" },
    ],
  },

  parking: {
    zones: [
      { id: "PA", name: "Parking Zone A", totalSpots: 2000, disabledSpots: 100, eVSpots: 50 },
      { id: "PB", name: "Parking Zone B", totalSpots: 1500, disabledSpots: 80, eVSpots: 30 },
      { id: "PC", name: "Parking Zone C", totalSpots: 1000, disabledSpots: 60, eVSpots: 20 },
    ],
  },

  transport: {
    metro: [
      { line: "Gold Line", station: "Lusail QNB Station", walkTime: "5 minutes", frequency: "Every 4 minutes" },
    ],
    bus: [
      { route: "BRT-1", name: "FIFA Fan Bus — Zone A", frequency: "Every 10 minutes" },
      { route: "BRT-2", name: "FIFA Fan Bus — Zone B", frequency: "Every 15 minutes" },
    ],
    taxi: {
      zones: ["Drop-off Zone A — Gate 1", "Drop-off Zone B — Gate 2"],
      appName: "Karwa Taxi",
    },
  },

  accessibilityFeatures: [
    "Wheelchair ramps at all accessible gates",
    "Dedicated accessible seating in all sections",
    "Audio description headsets available at Information Desk",
    "Sign language interpretation on request",
    "Accessible restrooms on every level",
    "Priority queue at Gates 1, 2, and 5",
    "Electric mobility scooters available for rent",
  ],
};

module.exports = stadiumData;
