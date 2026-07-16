/**
 * StadiumIQ — Seat Data
 * Static seat map reference data for section and row lookups.
 */

const seatData = {
  sections: {
    NS: {
      name: "North Stand",
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"],
      seatsPerRow: 80,
      level: "Ground & Upper",
      view: "Behind North Goal",
      nearestGate: "G1",
      nearestFood: "FC1",
      nearestRestroom: "R1",
    },
    SS: {
      name: "South Stand",
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"],
      seatsPerRow: 80,
      level: "Ground & Upper",
      view: "Behind South Goal",
      nearestGate: "G2",
      nearestFood: "FC2",
      nearestRestroom: "R2",
    },
    ES: {
      name: "East Stand",
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      seatsPerRow: 100,
      level: "Multi-level",
      view: "Side View — Halfway Line",
      nearestGate: "G3",
      nearestFood: "FC3",
      nearestRestroom: "R3",
    },
    WS: {
      name: "West Stand",
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      seatsPerRow: 100,
      level: "Multi-level",
      view: "Side View — Halfway Line (Main Cameras)",
      nearestGate: "G4",
      nearestFood: "FC3",
      nearestRestroom: "R3",
    },
    VIP: {
      name: "VIP Box",
      rows: ["P1", "P2", "P3", "P4", "P5"],
      seatsPerRow: 20,
      level: "Premium — Level 3",
      view: "Centre Court Premium",
      nearestGate: "G5",
      nearestFood: "VIP Lounge",
      nearestRestroom: "R4",
    },
    ACC: {
      name: "Accessibility Section",
      rows: ["WC1", "WC2", "WC3"],
      seatsPerRow: 20,
      level: "Ground Level",
      view: "Accessible Viewing Platform — South End",
      nearestGate: "G2",
      nearestFood: "FC2",
      nearestRestroom: "R2",
    },
  },

  /**
   * Look up section data by seat string (e.g., "NS-C-14").
   * @param {string} seatCode - Format: "SECTION-ROW-NUMBER"
   * @returns {object|null}
   */
  lookup(seatCode) {
    if (!seatCode) return null;
    const parts = seatCode.split("-");
    const sectionId = parts[0];
    return this.sections[sectionId] || null;
  },
};

module.exports = seatData;
