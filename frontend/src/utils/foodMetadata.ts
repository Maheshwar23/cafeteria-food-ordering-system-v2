/**
 * Metadata for cafeteria menu items:
 * - Dietary classification (Vegetarian vs Non-Vegetarian)
 * - Descriptions and illustrative ingredients
 * - Spice levels
 * - Dish-appropriate customization options
 */

export type DietaryType = 'ALL' | 'VEG' | 'NON_VEG';
export type SortOption = 'DEFAULT' | 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface FoodMetadata {
  isVegetarian: boolean;
  description: string;
  ingredients: string[];
  spiceLevel?: 'None' | 'Mild' | 'Medium' | 'Hot';
  allowedAddOns: CustomizationOption[];
}

// ── Global Standard Add-ons ──────────────────────────────────────────────────
export const ADD_ONS: Record<string, CustomizationOption> = {
  EXTRA_CHEESE: {
    id: 'EXTRA_CHEESE',
    name: 'Extra Cheese',
    price: 25.0,
    description: 'Melted cheddar & mozzarella blend',
  },
  EXTRA_PATTY: {
    id: 'EXTRA_PATTY',
    name: 'Extra Patty',
    price: 50.0,
    description: 'Fresh seasoned grilled patty',
  },
  EXTRA_SAUCE: {
    id: 'EXTRA_SAUCE',
    name: 'Special Dip & Sauce',
    price: 15.0,
    description: 'House garlic mayo and tangy sauce',
  },
  EXTRA_SPICE: {
    id: 'EXTRA_SPICE',
    name: 'Extra Spice Sprinkles',
    price: 10.0,
    description: 'Fiery peri-peri spice dust',
  },
  EXTRA_PANEER: {
    id: 'EXTRA_PANEER',
    name: 'Extra Paneer Cubes',
    price: 40.0,
    description: 'Tender spiced cottage cheese',
  },
  EXTRA_SALAN: {
    id: 'EXTRA_SALAN',
    name: 'Extra Mirchi Ka Salan',
    price: 25.0,
    description: 'Traditional slow-cooked peanut-sesame gravy',
  },
  EXTRA_ICE_CREAM_SCOOP: {
    id: 'EXTRA_ICE_CREAM_SCOOP',
    name: 'Extra Ice Cream Scoop',
    price: 30.0,
    description: 'Rich creamy vanilla scoop',
  },
};

// ── Item Metadata Catalog ────────────────────────────────────────────────────
const ITEM_METADATA_MAP: Record<string, FoodMetadata> = {
  // ── Burgers ──
  'Classic Burger': {
    isVegetarian: true,
    description: 'Crisp vegetable patty with garden lettuce, fresh tomatoes, and house herb dressing in a toasted brioche bun.',
    ingredients: ['Sesame Brioche Bun', 'Potato & Pea Patty', 'Crisp Lettuce', 'Sliced Tomato', 'Herbed Mayo Sauce'],
    spiceLevel: 'Mild',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_PATTY, ADD_ONS.EXTRA_SAUCE],
  },
  'Cheese Burger': {
    isVegetarian: true,
    description: 'Toasted bun loaded with a spiced veg patty, melted cheddar cheese slice, caramelized onions, and relish.',
    ingredients: ['Toasted Bun', 'Veg Patty', 'Cheddar Cheese Slice', 'Caramelized Onions', 'Tangy Relish'],
    spiceLevel: 'Mild',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_PATTY, ADD_ONS.EXTRA_SAUCE],
  },
  'Spicy Paneer Burger': {
    isVegetarian: true,
    description: 'Crispy fried tandoori spiced cottage cheese patty topped with pickled jalapeños and spicy chipotle sauce.',
    ingredients: ['Brioche Bun', 'Crispy Paneer Patty', 'Pickled Jalapeños', 'Chipotle Sauce', 'Crunchy Cabbage Slaw'],
    spiceLevel: 'Hot',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SAUCE, ADD_ONS.EXTRA_SPICE],
  },
  'Crispy Chicken Burger': {
    isVegetarian: false,
    description: 'Golden fried chicken breast fillet seasoned with secret spices, served with tangy slaw and creamy garlic spread.',
    ingredients: ['Brioche Bun', 'Crispy Chicken Fillet', 'Creamy Slaw', 'Garlic Mayo', 'Pickles'],
    spiceLevel: 'Medium',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_PATTY, ADD_ONS.EXTRA_SAUCE, ADD_ONS.EXTRA_SPICE],
  },

  // ── Pizza ──
  'Margherita Pizza': {
    isVegetarian: true,
    description: 'Classic Italian stone-baked crust topped with San Marzano style tomato puree, fresh mozzarella, and sweet basil leaves.',
    ingredients: ['Hand-stretched Dough', 'Tomato Pomodoro Sauce', 'Mozzarella Cheese', 'Sweet Basil', 'Extra Virgin Olive Oil'],
    spiceLevel: 'Mild',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SAUCE, ADD_ONS.EXTRA_SPICE],
  },
  'Veggie Pizza': {
    isVegetarian: true,
    description: 'Crisp hand-tossed base layered with crunchy bell peppers, sweet corn kernels, red onions, mushrooms, and mozzarella.',
    ingredients: ['Pizza Dough', 'Herb Tomato Base', 'Mozzarella', 'Bell Peppers', 'Sweet Corn', 'Red Onions', 'Mushrooms'],
    spiceLevel: 'Mild',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SAUCE, ADD_ONS.EXTRA_SPICE],
  },
  'Paneer Tikka Pizza': {
    isVegetarian: true,
    description: 'Fusion delight featuring smoky clay-oven paneer cubes, capsicum strips, and fragrant tandoori herbs on melted cheese.',
    ingredients: ['Pizza Base', 'Makhani Sauce', 'Marinated Paneer', 'Crisp Capsicum', 'Red Onions', 'Mozzarella'],
    spiceLevel: 'Medium',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_PANEER, ADD_ONS.EXTRA_SPICE],
  },
  'Chicken Feast Pizza': {
    isVegetarian: false,
    description: 'Loaded with seasoned roast chicken slices, chicken tikka bits, smoky barbecue drizzle, and double mozzarella.',
    ingredients: ['Pizza Crust', 'Zesty Tomato Sauce', 'Roast Chicken Chunks', 'Chicken Tikka', 'Mozzarella', 'BBQ Swirl'],
    spiceLevel: 'Medium',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SAUCE, ADD_ONS.EXTRA_SPICE],
  },

  // ── Sandwiches & Wraps ──
  'Grilled Cheese Sandwich': {
    isVegetarian: true,
    description: 'Golden buttery toasted sourdough stuffed with triple gooey cheese blend and a hint of cracked pepper.',
    ingredients: ['Artisan Sourdough', 'Cheddar & Mozzarella', 'Cream Cheese', 'Herb Butter', 'Cracked Black Pepper'],
    spiceLevel: 'None',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SAUCE],
  },
  'Veg Club Sandwich': {
    isVegetarian: true,
    description: 'Double-decker toasted whole wheat sandwich layered with cucumber slices, tomatoes, seasoned potato, and mint chutney.',
    ingredients: ['Toasted Whole Wheat Bread', 'Cucumber', 'Tomato', 'Spiced Potato Mash', 'Mint Coriander Chutney', 'Cheese'],
    spiceLevel: 'Mild',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SAUCE],
  },
  'Paneer Kathi Roll': {
    isVegetarian: true,
    description: 'Warm flaky paratha wrapped around succulent charred paneer pieces tossed with sliced bell peppers and mint dip.',
    ingredients: ['Flaky Layered Paratha', 'Marinated Paneer Tikka', 'Sliced Bell Peppers', 'Onion Rings', 'Spicy Mint Chutney'],
    spiceLevel: 'Medium',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_PANEER, ADD_ONS.EXTRA_SPICE],
  },
  'Chicken Tikka Wrap': {
    isVegetarian: false,
    description: 'Grilled tandoori chicken strips wrapped in a soft roti with crunchy red onions, fresh coriander, and mint yogurt spread.',
    ingredients: ['Soft Tortilla Wrap', 'Tandoori Chicken Tikka', 'Pickled Red Onions', 'Fresh Coriander', 'Mint Yogurt Sauce'],
    spiceLevel: 'Medium',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SAUCE, ADD_ONS.EXTRA_SPICE],
  },

  // ── Snacks & Sides ──
  'Peri Peri French Fries': {
    isVegetarian: true,
    description: 'Golden crunchy potato fries generously dusted with spicy African bird-eye chili seasoning and served hot.',
    ingredients: ['Russet Potatoes', 'Peri Peri Seasoning', 'Sea Salt', 'Vegetable Oil'],
    spiceLevel: 'Hot',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SAUCE, ADD_ONS.EXTRA_SPICE],
  },
  'Cheesy Loaded Nachos': {
    isVegetarian: true,
    description: 'Crispy corn tortilla chips blanketed in warm queso cheese sauce, fresh jalapeño rings, and tangy tomato salsa.',
    ingredients: ['Crisp Corn Tortilla Chips', 'Warm Cheese Sauce', 'Jalapeño Slices', 'Fresh Pico de Gallo Salsa', 'Sour Cream'],
    spiceLevel: 'Mild',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SAUCE],
  },
  'Crispy Onion Rings': {
    isVegetarian: true,
    description: 'Thick cut sweet Spanish onion slices dipped in seasoned batter, panko crusted, and fried till golden brown.',
    ingredients: ['Sweet Yellow Onions', 'Seasoned Batter', 'Panko Breadcrumbs', 'Smoky Dipping Sauce'],
    spiceLevel: 'None',
    allowedAddOns: [ADD_ONS.EXTRA_SAUCE, ADD_ONS.EXTRA_SPICE],
  },
  'Vegetable Spring Rolls': {
    isVegetarian: true,
    description: 'Crispy delicate pastry rolls packed with finely shredded cabbage, carrots, bell peppers, and scallions with sweet chili dip.',
    ingredients: ['Crisp Spring Roll Sheets', 'Shredded Cabbage', 'Carrots', 'Green Peppers', 'Ginger Garlic', 'Sweet Chili Sauce'],
    spiceLevel: 'Mild',
    allowedAddOns: [ADD_ONS.EXTRA_SAUCE],
  },

  // ── Pasta ──
  'Creamy Alfredo Pasta': {
    isVegetarian: true,
    description: 'Al dente penne pasta tossed in a luxurious butter, heavy cream, garlic, and freshly grated parmesan sauce.',
    ingredients: ['Durum Wheat Penne', 'Rich Cream Sauce', 'Garlic & Herbs', 'Parmesan Cheese', 'Sauteed Mushrooms'],
    spiceLevel: 'None',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SPICE],
  },
  'Spicy Arrabbiata Pasta': {
    isVegetarian: true,
    description: 'Classic penne coated in robust fiery tomato sauce simmered with garlic, crushed red chilies, and oregano.',
    ingredients: ['Penne Pasta', 'Crushed San Marzano Tomatoes', 'Garlic', 'Chili Flakes', 'Fresh Basil', 'Olive Oil'],
    spiceLevel: 'Hot',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SPICE],
  },
  'Cheesy Mac & Cheese': {
    isVegetarian: true,
    description: 'Comforting elbow macaroni baked in rich velvety three-cheese sauce, topped with toasted buttered breadcrumbs.',
    ingredients: ['Elbow Macaroni', 'Sharp Cheddar', 'Gruyere & Mozzarella', 'Whole Milk Roux', 'Crispy Breadcrumbs'],
    spiceLevel: 'None',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SAUCE],
  },

  // ── Indian Meals ──
  'Paneer Butter Masala Combo': {
    isVegetarian: true,
    description: 'Soft cottage cheese cubes simmered in a rich tomato, butter, and cashew gravy. Served with 2 soft butter naans.',
    ingredients: ['Fresh Paneer', 'Tomato Cashew Gravy', 'Fresh Butter & Cream', 'Kasuri Methi', '2 Butter Naans'],
    spiceLevel: 'Medium',
    allowedAddOns: [ADD_ONS.EXTRA_PANEER, ADD_ONS.EXTRA_SPICE],
  },
  'Veg Dum Biryani': {
    isVegetarian: true,
    description: 'Aromatic long-grain basmati rice slow-cooked on dum with seasonal garden vegetables, saffron milk, and fried onions.',
    ingredients: ['Aged Basmati Rice', 'Seasonal Vegetables', 'Whole Biryani Spices', 'Saffron Milk', 'Mint & Fried Onions', 'Raita'],
    spiceLevel: 'Medium',
    allowedAddOns: [ADD_ONS.EXTRA_PANEER, ADD_ONS.EXTRA_SALAN, ADD_ONS.EXTRA_SPICE],
  },
  'Chicken Biryani with Salan': {
    isVegetarian: false,
    description: 'Hyderabadi style royal basmati rice dum cooked with marinated chicken pieces and rich spices, served with tangy mirchi salan.',
    ingredients: ['Basmati Rice', 'Marinated Chicken', 'Yogurt & Biryani Spices', 'Saffron', 'Fried Onions', 'Mirchi Ka Salan Gravy'],
    spiceLevel: 'Hot',
    allowedAddOns: [ADD_ONS.EXTRA_SALAN, ADD_ONS.EXTRA_SPICE],
  },
  'Dal Makhani with Jeera Rice': {
    isVegetarian: true,
    description: 'Slow-simmered whole black lentils and kidney beans enriched with butter and cream, served alongside cumin-infused basmati rice.',
    ingredients: ['Whole Black Urad Dal', 'Rajma Beans', 'Slow Cooked Butter & Cream', 'Fragrant Jeera Basmati Rice'],
    spiceLevel: 'Mild',
    allowedAddOns: [ADD_ONS.EXTRA_SPICE],
  },

  // ── Beverage ──
  'Cold Drink': {
    isVegetarian: true,
    description: 'Chilled sparkling carbonated beverage served with ice cubes.',
    ingredients: ['Carbonated Water', 'Cane Sugar', 'Natural Flavors'],
    spiceLevel: 'None',
    allowedAddOns: [],
  },
  'Mango Lassi': {
    isVegetarian: true,
    description: 'Thick, creamy chilled yogurt smoothie blended with ripe Alphonso mango pulp and a touch of cardamom.',
    ingredients: ['Cultured Yogurt', 'Alphonso Mango Pulp', 'Milk', 'Cardamom Powder', 'Pistachio Flakes'],
    spiceLevel: 'None',
    allowedAddOns: [],
  },
  'Masala Chai': {
    isVegetarian: true,
    description: 'Steaming campus favorite brewed with Assam tea leaves, fresh ginger, crushed cardamom, cloves, and whole milk.',
    ingredients: ['Assam Black Tea', 'Fresh Ginger', 'Cardamom & Cloves', 'Whole Milk', 'Cane Sugar'],
    spiceLevel: 'Mild',
    allowedAddOns: [],
  },
  'Iced Cold Coffee': {
    isVegetarian: true,
    description: 'Rich freshly brewed dark roast espresso whipped with chilled creamy milk, chocolate drizzle, and crushed ice.',
    ingredients: ['Espresso Coffee', 'Chilled Milk', 'Cocoa Drizzle', 'Sugar', 'Crushed Ice'],
    spiceLevel: 'None',
    allowedAddOns: [ADD_ONS.EXTRA_ICE_CREAM_SCOOP],
  },

  // ── Dessert ──
  'Chocolate Brownie': {
    isVegetarian: true,
    description: 'Warm fudge chocolate brownie with melted dark chocolate chunks and a chewy, velvety center.',
    ingredients: ['Dark Cocoa', 'Belgian Chocolate Chunks', 'Flour', 'Butter', 'Brown Sugar'],
    spiceLevel: 'None',
    allowedAddOns: [ADD_ONS.EXTRA_ICE_CREAM_SCOOP],
  },
  'Ice Cream': {
    isVegetarian: true,
    description: 'Creamy double-churned classic vanilla ice cream topped with roasted nut slivers.',
    ingredients: ['Heavy Cream', 'Pure Vanilla Bean', 'Milk', 'Toasted Almond Slivers'],
    spiceLevel: 'None',
    allowedAddOns: [ADD_ONS.EXTRA_ICE_CREAM_SCOOP],
  },
  'Gulab Jamun (2 pcs)': {
    isVegetarian: true,
    description: 'Two traditional soft fried milk dough balls steeped in warm saffron and rose water fragrant syrup.',
    ingredients: ['Mawa Khoya', 'Cottage Cheese', 'Saffron Infused Sugar Syrup', 'Rose Water', 'Cardamom'],
    spiceLevel: 'None',
    allowedAddOns: [ADD_ONS.EXTRA_ICE_CREAM_SCOOP],
  },
};

/**
 * Known non-vegetarian food names in the cafeteria menu.
 */
const NON_VEG_ITEM_NAMES = new Set([
  'crispy chicken burger',
  'chicken feast pizza',
  'chicken tikka wrap',
  'chicken biryani with salan',
]);

/**
 * Returns true if the food item is vegetarian, false if non-vegetarian.
 */
export function isItemVegetarian(itemName: string): boolean {
  if (!itemName) return true;
  const normalized = itemName.trim().toLowerCase();
  if (NON_VEG_ITEM_NAMES.has(normalized)) {
    return false;
  }
  const meta = ITEM_METADATA_MAP[itemName];
  if (meta) {
    return meta.isVegetarian;
  }
  return true;
}

/**
 * Returns detailed metadata for a given food item name.
 */
export function getFoodMetadata(itemName: string, category?: string): FoodMetadata {
  const existing = ITEM_METADATA_MAP[itemName];
  if (existing) {
    return existing;
  }

  // Graceful fallback for dynamic or unlisted items
  const isVeg = isItemVegetarian(itemName);
  return {
    isVegetarian: isVeg,
    description: `Delicious chef-prepared ${itemName} from our ${category || 'fresh'} menu.`,
    ingredients: ['Fresh seasonal campus ingredients', 'House cafeteria spices'],
    spiceLevel: isVeg ? 'Mild' : 'Medium',
    allowedAddOns: [ADD_ONS.EXTRA_CHEESE, ADD_ONS.EXTRA_SAUCE],
  };
}
