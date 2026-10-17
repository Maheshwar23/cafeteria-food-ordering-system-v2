package com.cafeteria.config;

import com.cafeteria.entity.FoodItemEntity;
import com.cafeteria.repository.FoodItemRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class DataSeederTest {

    @Autowired
    private DataSeeder dataSeeder;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Test
    @DisplayName("DataSeeder seeds exactly 30 unique items and repeated runs produce zero duplicates")
    void testDataSeederIdempotency() {
        // App startup already ran dataSeeder.run(null) once.
        long initialCount = foodItemRepository.count();
        assertEquals(30, initialCount, "Database should contain exactly 30 items after initial seed");

        // Execute seeder a second time to test idempotency
        dataSeeder.run(null);
        long secondCount = foodItemRepository.count();
        assertEquals(30, secondCount, "Repeated execution of DataSeeder must not create duplicate items");

        // Verify existing items were preserved with exact prices
        Optional<FoodItemEntity> classicBurger = foodItemRepository.findByNameIgnoreCaseAndCategoryIgnoreCase("Classic Burger", "Burger");
        assertTrue(classicBurger.isPresent(), "Classic Burger must exist");
        assertEquals(120.0, classicBurger.get().getPrice(), 0.001, "Classic Burger price must remain 120.0");

        Optional<FoodItemEntity> margheritaPizza = foodItemRepository.findByNameIgnoreCaseAndCategoryIgnoreCase("Margherita Pizza", "Pizza");
        assertTrue(margheritaPizza.isPresent(), "Margherita Pizza must exist");
        assertEquals(280.0, margheritaPizza.get().getPrice(), 0.001, "Margherita Pizza price must remain 280.0");

        // Verify new categories are present
        Optional<FoodItemEntity> clubSandwich = foodItemRepository.findByNameIgnoreCaseAndCategoryIgnoreCase("Veg Club Sandwich", "Sandwiches & Wraps");
        assertTrue(clubSandwich.isPresent(), "Veg Club Sandwich must be present");
        assertEquals(140.0, clubSandwich.get().getPrice(), 0.001);

        Optional<FoodItemEntity> biryani = foodItemRepository.findByNameIgnoreCaseAndCategoryIgnoreCase("Veg Dum Biryani", "Indian Meals");
        assertTrue(biryani.isPresent(), "Veg Dum Biryani must be present");
        assertEquals(190.0, biryani.get().getPrice(), 0.001);
    }
}
