/**
 * StadiumIQ — Fake Data Generator
 * Generates realistic simulated live stadium metrics for Socket.io broadcasts
 * and the /api/live/status endpoint.
 */

const { RISK_LEVELS, STADIUM_ZONES } = require("../constants");

/**
 * Returns a random integer between min and max (inclusive).
 */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Returns a random float rounded to 1 decimal place.
 */
const randFloat = (min, max) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(1));

/**
 * Returns a random element from an array.
 */
const randFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Derive risk level from occupancy percentage.
 */
const getRiskFromOccupancy = (pct) => {
  if (pct >= 95) return RISK_LEVELS.CRITICAL;
  if (pct >= 80) return RISK_LEVELS.HIGH;
  if (pct >= 60) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
};

/**
 * Generate simulated gate occupancy data.
 */
const generateGateOccupancy = () => {
  const gates = ["Gate 1", "Gate 2", "Gate 3", "Gate 4", "Gate 5", "Gate 6"];
  return gates.map((gate) => {
    const current = randInt(200, 3000);
    const capacity = 3500;
    const pct = Math.round((current / capacity) * 100);
    return {
      gate,
      current,
      capacity,
      occupancyPercent: pct,
      riskLevel: getRiskFromOccupancy(pct),
      waitTimeMinutes: randInt(0, 25),
    };
  });
};

/**
 * Generate simulated parking occupancy data.
 */
const generateParkingData = () => {
  const zones = ["Zone A", "Zone B", "Zone C"];
  return zones.map((zone) => {
    const total = zone === "Zone A" ? 2000 : zone === "Zone B" ? 1500 : 1000;
    const occupied = randInt(Math.floor(total * 0.4), total);
    const available = total - occupied;
    return {
      zone,
      total,
      occupied,
      available,
      occupancyPercent: Math.round((occupied / total) * 100),
      evAvailable: randInt(0, 20),
    };
  });
};

/**
 * Generate simulated weather data.
 */
const generateWeatherData = () => ({
  temperatureCelsius: randFloat(22, 42),
  humidity: randInt(30, 80),
  windSpeedKmh: randFloat(5, 35),
  condition: randFrom(["Clear", "Partly Cloudy", "Cloudy", "Hot", "Breezy"]),
  heatIndexCelsius: randFloat(25, 48),
  uvIndex: randInt(1, 11),
  alerts: randFloat(0, 1) > 0.85 ? ["Extreme Heat Advisory"] : [],
});

/**
 * Generate simulated medical incidents.
 */
const generateMedicalIncidents = () => {
  const count = randInt(0, 5);
  const types = ["Heat Exhaustion", "Minor Injury", "Fainting", "Allergic Reaction", "Chest Pain"];
  const zones = Object.values(STADIUM_ZONES);
  return Array.from({ length: count }, (_, i) => ({
    id: `MED-${Date.now()}-${i}`,
    type: randFrom(types),
    zone: randFrom(zones),
    severity: randFrom(["Minor", "Moderate", "Serious"]),
    resolved: randFloat(0, 1) > 0.4,
    timestamp: new Date().toISOString(),
  }));
};

/**
 * Generate simulated security alerts.
 */
const generateSecurityAlerts = () => {
  const hasAlert = randFloat(0, 1) > 0.75;
  if (!hasAlert) return { level: "GREEN", alerts: [] };

  const alerts = ["Unattended bag reported", "Crowd surge at Gate 3", "Perimeter breach attempt"];
  return {
    level: randFrom(["YELLOW", "ORANGE"]),
    alerts: [randFrom(alerts)],
    zone: randFrom(Object.values(STADIUM_ZONES)),
  };
};

/**
 * Generate simulated transport status.
 */
const generateTransportStatus = () => ({
  metro: {
    line: "Gold Line",
    station: "Lusail QNB Station",
    status: randFrom(["On Time", "Minor Delay", "Running"]),
    delayMinutes: randInt(0, 10),
    nextDepartureMinutes: randInt(1, 8),
    crowdLevel: randFrom(["Low", "Moderate", "High"]),
  },
  buses: [
    {
      route: "BRT-1",
      status: randFrom(["Available", "Full", "Departing Soon"]),
      seatsAvailable: randInt(0, 50),
      nextArrivalMinutes: randInt(2, 15),
    },
    {
      route: "BRT-2",
      status: randFrom(["Available", "Full", "Departing Soon"]),
      seatsAvailable: randInt(0, 40),
      nextArrivalMinutes: randInt(5, 20),
    },
  ],
  taxiWaitMinutes: randInt(3, 20),
});

/**
 * Generate a complete stadium live status snapshot.
 * This is the main function called by the Socket.io broadcaster and live endpoint.
 */
const generateLiveStatus = () => {
  const gateData = generateGateOccupancy();
  const totalCurrent = gateData.reduce((sum, g) => sum + g.current, 0);
  const totalCapacity = gateData.reduce((sum, g) => sum + g.capacity, 0);
  const overallOccupancyPct = Math.round((totalCurrent / totalCapacity) * 100);

  return {
    timestamp: new Date().toISOString(),
    stadiumName: "Lusail Iconic Stadium",
    overallOccupancy: {
      current: totalCurrent,
      capacity: 92000,
      percent: overallOccupancyPct,
      riskLevel: getRiskFromOccupancy(overallOccupancyPct),
    },
    gates: gateData,
    parking: generateParkingData(),
    weather: generateWeatherData(),
    medicalIncidents: generateMedicalIncidents(),
    security: generateSecurityAlerts(),
    transport: generateTransportStatus(),
    activeVolunteers: randInt(80, 200),
    activeSecurity: randInt(50, 150),
    activeMedical: randInt(20, 60),
  };
};

module.exports = { generateLiveStatus, generateGateOccupancy, generateWeatherData };
