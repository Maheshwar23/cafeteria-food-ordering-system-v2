/**
 * Explicit static mapping between food item names and local image filenames.
 * Stored in frontend/public/images/food/ and served statically by Vite.
 */
export const FOOD_IMAGE_MAP: Record<string, string> = {
  // Existing baseline items (8)
  'Classic Burger': 'classic-burger.jpg',
  'Cheese Burger': 'cheese-burger.jpg',
  'Margherita Pizza': 'margherita-pizza.jpg',
  'Veggie Pizza': 'veggie-pizza.jpg',
  'Cold Drink': 'cold-drink.jpg',
  'Mango Lassi': 'mango-lassi.jpg',
  'Chocolate Brownie': 'chocolate-brownie.jpg',
  'Ice Cream': 'ice-cream.jpg',

  // Burger (2 new)
  'Spicy Paneer Burger': 'spicy-paneer-burger.jpg',
  'Crispy Chicken Burger': 'crispy-chicken-burger.jpg',

  // Pizza (2 new)
  'Paneer Tikka Pizza': 'paneer-tikka-pizza.jpg',
  'Chicken Feast Pizza': 'chicken-feast-pizza.jpg',

  // Sandwiches & Wraps (4 new)
  'Grilled Cheese Sandwich': 'grilled-cheese-sandwich.jpg',
  'Veg Club Sandwich': 'veg-club-sandwich.jpg',
  'Paneer Kathi Roll': 'paneer-kathi-roll.jpg',
  'Chicken Tikka Wrap': 'chicken-tikka-wrap.jpg',

  // Snacks & Sides (4 new)
  'Peri Peri French Fries': 'peri-peri-fries.jpg',
  'Cheesy Loaded Nachos': 'cheesy-loaded-nachos.jpg',
  'Crispy Onion Rings': 'crispy-onion-rings.jpg',
  'Vegetable Spring Rolls': 'vegetable-spring-rolls.jpg',

  // Pasta (3 new)
  'Creamy Alfredo Pasta': 'creamy-alfredo-pasta.jpg',
  'Spicy Arrabbiata Pasta': 'spicy-arrabbiata-pasta.jpg',
  'Cheesy Mac & Cheese': 'cheesy-mac-and-cheese.jpg',

  // Indian Meals (4 new)
  'Paneer Butter Masala Combo': 'paneer-butter-masala-combo.jpg',
  'Veg Dum Biryani': 'veg-dum-biryani.jpg',
  'Chicken Biryani with Salan': 'chicken-biryani-salan.jpg',
  'Dal Makhani with Jeera Rice': 'dal-makhani-jeera-rice.jpg',

  // Beverage (2 new)
  'Masala Chai': 'masala-chai.jpg',
  'Iced Cold Coffee': 'iced-cold-coffee.jpg',

  // Dessert (1 new)
  'Gulab Jamun (2 pcs)': 'gulab-jamun.jpg',
};

export const DEFAULT_FOOD_IMAGE = '/images/food/placeholder-food.jpg';

/**
 * Returns the local image path for a given food item name.
 * If not found in the explicit map, gracefully falls back to DEFAULT_FOOD_IMAGE.
 */
export function getFoodImageUrl(itemName: string): string {
  if (!itemName) return DEFAULT_FOOD_IMAGE;
  const filename = FOOD_IMAGE_MAP[itemName.trim()];
  return filename ? `/images/food/${filename}` : DEFAULT_FOOD_IMAGE;
}
