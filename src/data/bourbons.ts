export interface Bourbon {
  id: string;
  name: string;
  distillery: string;
  proof: number;
  abv: number;
  age?: string;
  mashBill?: string;
  origin: string;
  description: string;
  price?: string;
  image?: string;
  flavorProfile: string[];
  color: string;
  category: 'straight' | 'small-batch' | 'single-barrel' | 'bottled-in-bond' | 'cask-strength' | 'wheated' | 'high-rye';
}

export const bourbons: Bourbon[] = [
  {
    id: "buffalo-trace",
    name: "Buffalo Trace",
    distillery: "Buffalo Trace Distillery",
    proof: 90,
    abv: 45,
    age: "8-10 years (estimated)",
    mashBill: "Low rye (<10%)",
    origin: "Frankfort, Kentucky",
    description: "A flagship bourbon with rich, complex aromas of vanilla, mint, and molasses. Buffalo Trace has earned the distinction of being named the world's best bourbon.",
    price: "$25-35",
    flavorProfile: ["Vanilla", "Caramel", "Mint", "Brown Sugar", "Oak"],
    color: "#C68E17",
    category: "straight"
  },
  {
    id: "makers-mark",
    name: "Maker's Mark",
    distillery: "Maker's Mark Distillery",
    proof: 90,
    abv: 45,
    age: "6-7 years",
    mashBill: "70% corn, 16% red winter wheat, 14% malted barley",
    origin: "Loretto, Kentucky",
    description: "A soft, approachable wheated bourbon known for its hand-dipped red wax seal. Features flavors of caramel, vanilla, and subtle fruitiness.",
    price: "$25-35",
    flavorProfile: ["Caramel", "Vanilla", "Fruit", "Wheat", "Honey"],
    color: "#D4A24A",
    category: "wheated"
  },
  {
    id: "woodford-reserve",
    name: "Woodford Reserve",
    distillery: "Woodford Reserve Distillery",
    proof: 90.4,
    abv: 45.2,
    age: "6-7 years",
    mashBill: "72% corn, 18% rye, 10% malted barley",
    origin: "Versailles, Kentucky",
    description: "A premium small batch bourbon with over 200 detectable flavor notes including bold grain character, dried fruit, and hints of mint and vanilla.",
    price: "$35-45",
    flavorProfile: ["Dark Chocolate", "Dried Fruit", "Vanilla", "Tobacco", "Leather"],
    color: "#B8860B",
    category: "small-batch"
  },
  {
    id: "four-roses-single-barrel",
    name: "Four Roses Single Barrel",
    distillery: "Four Roses Distillery",
    proof: 100,
    abv: 50,
    age: "7-9 years",
    mashBill: "60% corn, 35% rye, 5% malted barley",
    origin: "Lawrenceburg, Kentucky",
    description: "A rich, spicy single barrel bourbon with prominent notes of ripe plum, cherry, and well-integrated oak spice.",
    price: "$40-50",
    flavorProfile: ["Plum", "Cherry", "Spice", "Oak", "Honey"],
    color: "#CD853F",
    category: "single-barrel"
  },
  {
    id: "wild-turkey-101",
    name: "Wild Turkey 101",
    distillery: "Wild Turkey Distillery",
    proof: 101,
    abv: 50.5,
    age: "6-8 years",
    mashBill: "75% corn, 13% rye, 12% malted barley",
    origin: "Lawrenceburg, Kentucky",
    description: "A bold, spicy bourbon with deep amber color and notes of vanilla, caramel, and toasted oak. A bartender's favorite.",
    price: "$22-30",
    flavorProfile: ["Vanilla", "Caramel", "Spice", "Oak", "Honey"],
    color: "#8B4513",
    category: "straight"
  },
  {
    id: "knob-creek",
    name: "Knob Creek 9 Year",
    distillery: "Jim Beam",
    proof: 100,
    abv: 50,
    age: "9 years",
    mashBill: "77% corn, 13% rye, 10% malted barley",
    origin: "Clermont, Kentucky",
    description: "A full-bodied bourbon aged in deeply charred barrels, delivering rich maple sugar, vanilla, and toasted nut flavors.",
    price: "$30-40",
    flavorProfile: ["Maple", "Vanilla", "Oak", "Nuts", "Caramel"],
    color: "#A0522D",
    category: "small-batch"
  },
  {
    id: "elijah-craig-small-batch",
    name: "Elijah Craig Small Batch",
    distillery: "Heaven Hill Distillery",
    proof: 94,
    abv: 47,
    age: "8-12 years",
    mashBill: "78% corn, 10% rye, 12% malted barley",
    origin: "Bardstown, Kentucky",
    description: "Named after the Baptist minister credited with charring bourbon barrels. Rich with notes of vanilla, toffee, and a warm oak finish.",
    price: "$28-35",
    flavorProfile: ["Vanilla", "Toffee", "Oak", "Caramel", "Smoke"],
    color: "#B5651D",
    category: "small-batch"
  },
  {
    id: "blantons-original",
    name: "Blanton's Original Single Barrel",
    distillery: "Buffalo Trace Distillery",
    proof: 93,
    abv: 46.5,
    age: "6-8 years",
    mashBill: "High corn with moderate rye",
    origin: "Frankfort, Kentucky",
    description: "The world's first commercially sold single barrel bourbon. Known for its collectible horse stopper tops and complex honey-citrus profile.",
    price: "$65-150",
    flavorProfile: ["Honey", "Citrus", "Vanilla", "Nutmeg", "Caramel"],
    color: "#DAA520",
    category: "single-barrel"
  },
  {
    id: "evan-williams-bib",
    name: "Evan Williams Bottled-in-Bond",
    distillery: "Heaven Hill Distillery",
    proof: 100,
    abv: 50,
    age: "At least 4 years",
    mashBill: "78% corn, 10% rye, 12% malted barley",
    origin: "Bardstown, Kentucky",
    description: "An excellent value bourbon meeting strict bottled-in-bond requirements. Clean, smooth with notes of caramel, vanilla, and gentle spice.",
    price: "$16-22",
    flavorProfile: ["Caramel", "Vanilla", "Spice", "Oak", "Corn"],
    color: "#CC7722",
    category: "bottled-in-bond"
  },
  {
    id: "bookers",
    name: "Booker's Bourbon",
    distillery: "Jim Beam",
    proof: 125,
    abv: 62.5,
    age: "6-8 years",
    mashBill: "77% corn, 13% rye, 10% malted barley",
    origin: "Clermont, Kentucky",
    description: "An uncut, unfiltered cask-strength bourbon named after Booker Noe. Intense flavors of vanilla, nuts, caramel, and a big oaky finish.",
    price: "$90-120",
    flavorProfile: ["Vanilla", "Nuts", "Caramel", "Oak", "Tobacco"],
    color: "#8B4513",
    category: "cask-strength"
  },
  {
    id: "weller-special-reserve",
    name: "W.L. Weller Special Reserve",
    distillery: "Buffalo Trace Distillery",
    proof: 90,
    abv: 45,
    age: "NAS",
    mashBill: "Wheated (similar to Pappy Van Winkle)",
    origin: "Frankfort, Kentucky",
    description: "An affordable wheated bourbon sharing the same mashbill as the legendary Pappy Van Winkle. Soft, sweet, and incredibly smooth.",
    price: "$25-50",
    flavorProfile: ["Wheat", "Vanilla", "Caramel", "Honey", "Cherry"],
    color: "#D2691E",
    category: "wheated"
  },
  {
    id: "old-forester-1920",
    name: "Old Forester 1920 Prohibition Style",
    distillery: "Brown-Forman",
    proof: 115,
    abv: 57.5,
    age: "NAS",
    mashBill: "72% corn, 18% rye, 10% malted barley",
    origin: "Louisville, Kentucky",
    description: "A bold, high-proof bourbon inspired by the Prohibition era when Old Forester was one of only six distilleries permitted to sell medicinal whiskey.",
    price: "$55-70",
    flavorProfile: ["Dark Chocolate", "Cherry", "Malt", "Orange Peel", "Spice"],
    color: "#A0522D",
    category: "cask-strength"
  }
];

export const categories = [
  { id: 'all', label: 'All Bourbons' },
  { id: 'straight', label: 'Straight' },
  { id: 'small-batch', label: 'Small Batch' },
  { id: 'single-barrel', label: 'Single Barrel' },
  { id: 'bottled-in-bond', label: 'Bottled-in-Bond' },
  { id: 'cask-strength', label: 'Cask Strength' },
  { id: 'wheated', label: 'Wheated' },
  { id: 'high-rye', label: 'High Rye' },
];

export const flavorCategories = [
  "Vanilla", "Caramel", "Oak", "Spice", "Honey", "Cherry", 
  "Chocolate", "Tobacco", "Leather", "Fruit", "Nuts", "Maple"
];
