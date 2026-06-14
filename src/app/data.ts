export const images = {
  alps: "https://images.unsplash.com/photo-1734378016894-98c048b7f7a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  tokyo: "https://images.unsplash.com/photo-1685058170107-a67113eb909a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  patagonia: "https://images.unsplash.com/photo-1633528061636-4db485717316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  bali: "https://images.unsplash.com/photo-1589990409137-4e41abbcff31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  profile: "https://images.unsplash.com/photo-1608991502446-f3a0b167cb1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  natureDark: "https://images.unsplash.com/photo-1766491765372-4628093d3e58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  streetDark: "https://images.unsplash.com/photo-1641215262382-795ff3048671?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
};

export const destinations = [
  { id: '1', name: "Swiss Alps", location: "Switzerland", image: images.alps },
  { id: '2', name: "Neon Nights", location: "Tokyo, Japan", image: images.tokyo },
  { id: '3', name: "Moody Peaks", location: "Patagonia", image: images.patagonia },
  { id: '4', name: "Jungle Falls", location: "Bali, Indonesia", image: images.bali },
  { id: '5', name: "Dark Woods", location: "Black Forest", image: images.natureDark },
];

export const featuredStories = [
  { id: '1', title: "Silence of the Snow", excerpt: "Finding peace in the highest peaks of Europe.", location: "Switzerland", image: images.alps },
  { id: '2', title: "Lost in the Neon", excerpt: "A cinematic night walk through the bustling streets.", location: "Japan", image: images.tokyo },
  { id: '3', title: "The Edge of the World", excerpt: "Windswept mountains and endless lakes.", location: "Patagonia", image: images.patagonia },
  { id: '4', title: "Rainforest Echoes", excerpt: "Chasing waterfalls in dense tropical jungles.", location: "Bali", image: images.bali },
];

export const galleryImages = [
  images.alps, images.tokyo, images.patagonia, images.bali, images.natureDark, images.streetDark, images.alps, images.bali
];

export const mapLocations = [
  { id: '1', name: "Zermatt", region: "Switzerland", coords: { x: 45, y: 30 }, image: images.alps },
  { id: '2', name: "Shibuya", region: "Japan", coords: { x: 80, y: 40 }, image: images.tokyo },
  { id: '3', name: "Torres del Paine", region: "Chile", coords: { x: 25, y: 80 }, image: images.patagonia },
  { id: '4', name: "Ubud", region: "Indonesia", coords: { x: 75, y: 65 }, image: images.bali },
];

export const storyDetail = {
  title: "Lost in the Neon: Tokyo at Midnight",
  location: "Tokyo, Japan",
  date: "October 14, 2025",
  heroVideo: images.tokyo, // Reusing image as a proxy for hero visual
  content: [
    { type: 'paragraph', text: "The rain had just stopped, leaving the asphalt slick and reflective. Every puddle became a mirror to the chaotic beauty above. Tokyo doesn't sleep; it just changes its rhythm. I found myself wandering through narrow alleyways, the scent of yakitori mixing with the damp city air." },
    { type: 'day', title: "Day 1: Arrival in Shinjuku", text: "Navigating the labyrinth of Shinjuku station was an adventure in itself. Emerging into the blinding glow of Kabukicho felt like stepping into a cyberpunk novel. The sheer density of life here is overwhelming, yet incredibly organized." },
    { type: 'image', url: images.streetDark },
    { type: 'day', title: "Day 2: The Quiet Shrines", text: "Contrast is what makes this city beautiful. Just blocks away from the sensory overload, you can find shrines shrouded in ancient trees, where the only sound is the rustle of leaves and the occasional coin dropped into an offering box." },
  ],
  budget: [
    { item: "Flights", cost: "$1,200" },
    { item: "Accommodation (7 Nights)", cost: "$850" },
    { item: "Food & Drinks", cost: "$400" },
    { item: "Transport (JR Pass)", cost: "$300" }
  ],
  prosCons: {
    pros: ["Incredible food at every corner", "Flawless public transit", "Safe to walk at any hour"],
    cons: ["Can be expensive", "Language barrier in smaller spots", "Crowded during rush hour"]
  },
  faq: [
    { q: "Is it safe for solo travelers?", a: "Absolutely. Tokyo is frequently ranked as one of the safest cities in the world for solo travelers." },
    { q: "Do I need to speak Japanese?", a: "While helpful, you can get by with English, especially in major tourist areas and by using translation apps." }
  ]
};
