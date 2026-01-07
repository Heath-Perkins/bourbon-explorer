export interface TastingNote {
  id: string;
  visibleColor: string;
  bouquet: string;
  taste: string;
  finish: string;
  overallThoughts: string;
  discernibleFlavors: string[];
  rating: number;
  dateTime: string;
  bourbonId: string;
  bourbonName: string;
  location?: string;
  glassware?: string;
  waterAdded?: boolean;
  iceAdded?: boolean;
}

export const sampleReviews: TastingNote[] = [
  {
    id: "1",
    visibleColor: "#C68E17",
    bouquet: "Rich caramel and vanilla with hints of fresh oak and subtle citrus notes",
    taste: "Smooth entry with immediate vanilla sweetness followed by caramel and a touch of honey",
    finish: "Medium-long finish with warming spice and lingering oak",
    overallThoughts: "An exceptional daily sipper. Complex enough to contemplate, approachable enough for any occasion.",
    discernibleFlavors: ["Vanilla", "Caramel", "Oak", "Citrus", "Honey"],
    rating: 4.5,
    dateTime: "2024-01-15T19:30:00",
    bourbonId: "buffalo-trace",
    bourbonName: "Buffalo Trace",
    location: "Home Bar",
    glassware: "Glencairn",
    waterAdded: true,
    iceAdded: false
  },
  {
    id: "2",
    visibleColor: "#D4A24A",
    bouquet: "Soft wheat sweetness with butterscotch and fresh baked bread",
    taste: "Silky smooth with prominent caramel, honey, and subtle fruit notes",
    finish: "Gentle, lingering warmth with a hint of vanilla",
    overallThoughts: "The quintessential wheated bourbon. Perfect for those who prefer a softer, sweeter profile.",
    discernibleFlavors: ["Wheat", "Butterscotch", "Honey", "Fruit", "Vanilla"],
    rating: 4,
    dateTime: "2024-01-20T20:00:00",
    bourbonId: "makers-mark",
    bourbonName: "Maker's Mark",
    location: "Whiskey Lounge",
    glassware: "Tumbler",
    waterAdded: false,
    iceAdded: true
  }
];

export const colorPresets = [
  { name: "Pale Gold", hex: "#F5DEB3" },
  { name: "Light Amber", hex: "#DAA520" },
  { name: "Amber", hex: "#CD853F" },
  { name: "Deep Amber", hex: "#B8860B" },
  { name: "Copper", hex: "#A0522D" },
  { name: "Mahogany", hex: "#8B4513" },
  { name: "Deep Mahogany", hex: "#6B3A0A" },
];

export const commonFlavors = [
  "Vanilla", "Caramel", "Oak", "Honey", "Spice", "Cherry", "Apple",
  "Cinnamon", "Nutmeg", "Chocolate", "Coffee", "Tobacco", "Leather",
  "Maple", "Brown Sugar", "Toffee", "Nuts", "Citrus", "Mint", "Pepper"
];

export const glasswareOptions = [
  "Glencairn", "Tumbler", "Rocks Glass", "Snifter", "Neat Glass", "Copita"
];
