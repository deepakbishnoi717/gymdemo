import { Product, CarouselItem } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "prod-whey",
    name: "HYDROLYZED WHEY ISOLATE",
    category: "SUPPLEMENTS",
    price: 74.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=600",
    description: "Premium grass-fed protein with 27g isolate, cold-processed microfiltration, zero bloat, and ultra-high biological value.",
    specs: ["27g Isolate Protein", "Cold-Filtered", "5.8g BCAAs", "Zero Lactose"]
  },
  {
    id: "prod-dumbbells",
    name: "TITANIUM HEX DUMBBELLS",
    category: "STRENGTH EQUIPMENT",
    price: 149.99,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=600",
    description: "Laser-balanced polyurethane-coated high-carbon hex dumbbells with textured tactile grip shafts.",
    specs: ["Matched Pair", "Polyurethane Coating", "Ergonomic Chrome Grip", "Lifetime Warranty"]
  },
  {
    id: "prod-straps",
    name: "CARBON PRO LIFTING STRAPS",
    category: "LIFTING ACCESSORIES",
    price: 29.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600",
    description: "High-density carbon thread weaving with 5mm shock-absorbing neoprene wrist protection arrays for absolute grip.",
    specs: ["Carbon Fiber Fiber Threading", "Stitched Reinforced Seams", "5mm Neoprene Shielding", "Talon Friction Gel"]
  }
];

export const CAROUSEL_EQ: CarouselItem[] = [
  {
    id: "eq-rack",
    name: "X9 APEX HYBRID CAGE",
    category: "STRENGTH HUBS",
    description: "The crown jewel of heavy power. Designed with high-tensile modular carbon steel, customizable safety catches, and built-in heavy-duty cable pulleys.",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3029161e?auto=format&fit=crop&q=80&w=600",
    specs: [
      { label: "Material", value: "3mm Structural Steel" },
      { label: "Pulleys", value: "Aviation Cables" },
      { label: "Capacity", value: "500kg Heavy Load" }
    ]
  },
  {
    id: "eq-cable",
    name: "TITANIC SMART DUAL-PULLEY",
    category: "CABLE SYSTEM",
    description: "Ultra-smooth professional grade dual cable crossover. Laser-engraved position guides with 360-degree swiveling high-performance aluminum pulley wheels.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600",
    specs: [
      { label: "Pulleys", value: "CNC Grade Aluminum" },
      { label: "Weight Stack", value: "120kg dual-stack" },
      { label: "Adjustments", value: "32 Height Settings" }
    ]
  },
  {
    id: "eq-rower",
    name: "APOLLO TITAN ROWING MACHINE",
    category: "METABOLIC ENGINE",
    description: "Aerodynamic resistance carbon-shroud rowing machine giving water-smooth feel with real-time digital wattage and cadence metrics.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    specs: [
      { label: "Resistance", value: "Fluid & Magnetic Aura" },
      { label: "Console", value: "HUD Neon Display" },
      { label: "Footrests", value: "Macro Adjust Straps" }
    ]
  },
  {
    id: "eq-bench",
    name: "V-GRIP OLYMPIC BENCH",
    category: "POWER TRANSFER",
    description: "Heavy-duty three-position flat/incline power press station featuring laser-cut spotting bars and active density vinyl cushioning.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600",
    specs: [
      { label: "Cushioning", value: "High-Density Foam Wrap" },
      { label: "Spotting", value: "Instant Barcatches" },
      { label: "Frame", value: "Gloss-Midnight Powder" }
    ]
  }
];

export const MOCK_TRAINER_SUGGESTIONS = [
  "Formulate a hypertrophy cycle.",
  "Give me a high-protein diet outline.",
  "What's special about Elite Iron?",
  "How can I book a tour of the gym?"
];
