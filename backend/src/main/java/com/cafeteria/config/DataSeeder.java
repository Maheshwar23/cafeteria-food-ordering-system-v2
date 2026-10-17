package com.cafeteria.config;

import com.cafeteria.entity.FoodItemEntity;
import com.cafeteria.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the food_items table idempotently on startup.
 * Inserts only missing items without overwriting existing records or creating duplicates.
 */
@Component
public class DataSeeder implements ApplicationRunner {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Override
    public void run(ApplicationArguments args) {
        List<FoodItemEntity> targetCatalog = List.of(
                // 1-4. Burger (2 existing + 2 new)
                new FoodItemEntity("Classic Burger",              120.0, "Burger"),
                new FoodItemEntity("Cheese Burger",               150.0, "Burger"),
                new FoodItemEntity("Spicy Paneer Burger",         170.0, "Burger"),
                new FoodItemEntity("Crispy Chicken Burger",       190.0, "Burger"),

                // 5-8. Pizza (2 existing + 2 new)
                new FoodItemEntity("Margherita Pizza",            280.0, "Pizza"),
                new FoodItemEntity("Veggie Pizza",                260.0, "Pizza"),
                new FoodItemEntity("Paneer Tikka Pizza",          310.0, "Pizza"),
                new FoodItemEntity("Chicken Feast Pizza",         340.0, "Pizza"),

                // 9-12. Sandwiches & Wraps (4 new)
                new FoodItemEntity("Grilled Cheese Sandwich",     110.0, "Sandwiches & Wraps"),
                new FoodItemEntity("Veg Club Sandwich",           140.0, "Sandwiches & Wraps"),
                new FoodItemEntity("Paneer Kathi Roll",           160.0, "Sandwiches & Wraps"),
                new FoodItemEntity("Chicken Tikka Wrap",          180.0, "Sandwiches & Wraps"),

                // 13-16. Snacks & Sides (4 new)
                new FoodItemEntity("Peri Peri French Fries",       90.0, "Snacks & Sides"),
                new FoodItemEntity("Cheesy Loaded Nachos",        130.0, "Snacks & Sides"),
                new FoodItemEntity("Crispy Onion Rings",          100.0, "Snacks & Sides"),
                new FoodItemEntity("Vegetable Spring Rolls",      120.0, "Snacks & Sides"),

                // 17-19. Pasta (3 new)
                new FoodItemEntity("Creamy Alfredo Pasta",        220.0, "Pasta"),
                new FoodItemEntity("Spicy Arrabbiata Pasta",      210.0, "Pasta"),
                new FoodItemEntity("Cheesy Mac & Cheese",         240.0, "Pasta"),

                // 20-23. Indian Meals (4 new)
                new FoodItemEntity("Paneer Butter Masala Combo",  210.0, "Indian Meals"),
                new FoodItemEntity("Veg Dum Biryani",             190.0, "Indian Meals"),
                new FoodItemEntity("Chicken Biryani with Salan",  250.0, "Indian Meals"),
                new FoodItemEntity("Dal Makhani with Jeera Rice", 180.0, "Indian Meals"),

                // 24-27. Beverage (2 existing + 2 new)
                new FoodItemEntity("Cold Drink",                   40.0, "Beverage"),
                new FoodItemEntity("Mango Lassi",                  60.0, "Beverage"),
                new FoodItemEntity("Masala Chai",                  35.0, "Beverage"),
                new FoodItemEntity("Iced Cold Coffee",             80.0, "Beverage"),

                // 28-30. Dessert (2 existing + 1 new)
                new FoodItemEntity("Chocolate Brownie",            90.0, "Dessert"),
                new FoodItemEntity("Ice Cream",                    70.0, "Dessert"),
                new FoodItemEntity("Gulab Jamun (2 pcs)",          60.0, "Dessert")
        );

        int newlySeededCount = 0;
        for (FoodItemEntity item : targetCatalog) {
            boolean exists = foodItemRepository
                    .findByNameIgnoreCaseAndCategoryIgnoreCase(item.getName(), item.getCategory())
                    .isPresent();
            if (!exists) {
                foodItemRepository.save(item);
                newlySeededCount++;
            }
        }

        System.out.println("[DataSeeder] Seed check complete. Newly seeded: " + newlySeededCount + " items.");
    }
}
