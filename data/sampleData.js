// Sample data for seeding the database
export const sampleBrands = [
  {
    brandName: "Chanel",
    description: "French luxury fashion house founded by Gabrielle Chanel",
    country: "France"
  },
  {
    brandName: "Dior",
    description: "French luxury goods company founded by Christian Dior",
    country: "France"
  },
  {
    brandName: "Tom Ford",
    description: "American luxury fashion house founded by Tom Ford",
    country: "United States"
  },
  {
    brandName: "Creed",
    description: "French luxury perfume house founded in 1760",
    country: "France"
  },
  {
    brandName: "Maison Margiela",
    description: "Belgian luxury fashion house founded by Martin Margiela",
    country: "Belgium"
  },
  {
    brandName: "Le Labo",
    description: "New York-based luxury fragrance house",
    country: "United States"
  }
];

export const samplePerfumes = [
  {
    perfumeName: "Chanel No. 5",
    uri: "chanel-no-5",
    price: 120,
    concentration: "EDP",
    description: "The world's most iconic fragrance, a timeless floral bouquet",
    ingredients: "Rose, Jasmine, Ylang-Ylang, Aldehydes, Sandalwood, Vanilla",
    volume: 100,
    stock: 50,
    targetAudience: "female"
  },
  {
    perfumeName: "Sauvage",
    uri: "dior-sauvage",
    price: 95,
    concentration: "EDT",
    description: "A fresh and woody fragrance with a modern edge",
    ingredients: "Bergamot, Pepper, Ambergris, Cedar, Labdanum",
    volume: 100,
    stock: 75,
    targetAudience: "male"
  },
  {
    perfumeName: "Black Orchid",
    uri: "tom-ford-black-orchid",
    price: 180,
    concentration: "EDP",
    description: "A luxurious and mysterious oriental fragrance",
    ingredients: "Black Orchid, Dark Chocolate, Patchouli, Incense, Sandalwood",
    volume: 50,
    stock: 30,
    targetAudience: "unisex"
  },
  {
    perfumeName: "Aventus",
    uri: "creed-aventus",
    price: 250,
    concentration: "EDP",
    description: "A fruity and woody fragrance inspired by the dramatic life of a historic emperor",
    ingredients: "Pineapple, Black Currant, Apple, Rose, Birch, Patchouli",
    volume: 75,
    stock: 25,
    targetAudience: "male"
  },
  {
    perfumeName: "Replica Jazz Club",
    uri: "maison-margiela-jazz-club",
    price: 140,
    concentration: "EDT",
    description: "A warm and smoky fragrance that captures the atmosphere of a jazz club",
    ingredients: "Pink Pepper, Lemon, Neroli, Rum, Vanilla, Tobacco",
    volume: 100,
    stock: 40,
    targetAudience: "unisex"
  },
  {
    perfumeName: "Santal 33",
    uri: "le-labo-santal-33",
    price: 220,
    concentration: "EDP",
    description: "A unisex fragrance with a distinctive sandalwood note",
    ingredients: "Sandalwood, Violet, Papyrus, Cardamom, Iris, Ambrette",
    volume: 50,
    stock: 35,
    targetAudience: "unisex"
  },
  {
    perfumeName: "Coco Mademoiselle",
    uri: "chanel-coco-mademoiselle",
    price: 110,
    concentration: "EDP",
    description: "A modern and sophisticated oriental fragrance",
    ingredients: "Orange, Rose, Jasmine, Patchouli, White Musk, Vanilla",
    volume: 100,
    stock: 60,
    targetAudience: "female"
  },
  {
    perfumeName: "Bleu de Chanel",
    uri: "chanel-bleu-de-chanel",
    price: 105,
    concentration: "EDT",
    description: "A fresh and woody fragrance for the modern man",
    ingredients: "Grapefruit, Mint, Pink Pepper, Ginger, Cedar, Sandalwood",
    volume: 100,
    stock: 45,
    targetAudience: "male"
  }
];

export const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@perfumestore.com",
    password: "admin123",
    yob: 1990,
    gender: true,
    isAdmin: true
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    yob: 1985,
    gender: true,
    isAdmin: false
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    yob: 1992,
    gender: false,
    isAdmin: false
  },
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123",
    yob: 1988,
    gender: true,
    isAdmin: false
  }
];

export const sampleComments = [
  {
    rating: 5,
    content: "Absolutely love this fragrance! It's elegant and long-lasting.",
    author: null, // Will be set to user ID during seeding
    perfume: null // Will be set to perfume ID during seeding
  },
  {
    rating: 4,
    content: "Great scent, perfect for special occasions.",
    author: null,
    perfume: null
  },
  {
    rating: 5,
    content: "My signature fragrance. Highly recommended!",
    author: null,
    perfume: null
  },
  {
    rating: 3,
    content: "Nice but a bit too strong for my taste.",
    author: null,
    perfume: null
  },
  {
    rating: 4,
    content: "Good quality and reasonable price.",
    author: null,
    perfume: null
  }
];
