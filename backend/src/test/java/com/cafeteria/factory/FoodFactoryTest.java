package com.cafeteria.factory;

import com.cafeteria.model.Beverage;
import com.cafeteria.model.Burger;
import com.cafeteria.model.Dessert;
import com.cafeteria.model.FoodItem;
import com.cafeteria.model.IndianMeal;
import com.cafeteria.model.Pasta;
import com.cafeteria.model.Pizza;
import com.cafeteria.model.Sandwich;
import com.cafeteria.model.Snack;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class FoodFactoryTest {

    @Test
    @DisplayName("BurgerFactory creates a Burger food item with correct properties")
    void testBurgerFactoryCreatesBurger() {
        FoodFactory factory = new BurgerFactory();
        FoodItem item = factory.createFoodItem("Veggie Burger", 5.99);

        assertNotNull(item, "Created item should not be null");
        assertInstanceOf(Burger.class, item, "Created item should be an instance of Burger");
        assertInstanceOf(FoodItem.class, item, "Created item should be an instance of FoodItem");
        assertEquals("Veggie Burger", item.getName(), "Name should match");
        assertEquals(5.99, item.getPrice(), 0.001, "Price should match");
        assertEquals("Burger", item.getCategory(), "Category should be Burger");
    }

    @Test
    @DisplayName("PizzaFactory creates a Pizza food item with correct properties")
    void testPizzaFactoryCreatesPizza() {
        FoodFactory factory = new PizzaFactory();
        FoodItem item = factory.createFoodItem("Margherita Pizza", 8.49);

        assertNotNull(item, "Created item should not be null");
        assertInstanceOf(Pizza.class, item, "Created item should be an instance of Pizza");
        assertInstanceOf(FoodItem.class, item, "Created item should be an instance of FoodItem");
        assertEquals("Margherita Pizza", item.getName(), "Name should match");
        assertEquals(8.49, item.getPrice(), 0.001, "Price should match");
        assertEquals("Pizza", item.getCategory(), "Category should be Pizza");
    }

    @Test
    @DisplayName("BeverageFactory creates a Beverage food item with correct properties")
    void testBeverageFactoryCreatesBeverage() {
        FoodFactory factory = new BeverageFactory();
        FoodItem item = factory.createFoodItem("Iced Latte", 3.25);

        assertNotNull(item, "Created item should not be null");
        assertInstanceOf(Beverage.class, item, "Created item should be an instance of Beverage");
        assertInstanceOf(FoodItem.class, item, "Created item should be an instance of FoodItem");
        assertEquals("Iced Latte", item.getName(), "Name should match");
        assertEquals(3.25, item.getPrice(), 0.001, "Price should match");
        assertEquals("Beverage", item.getCategory(), "Category should be Beverage");
    }

    @Test
    @DisplayName("DessertFactory creates a Dessert food item with correct properties")
    void testDessertFactoryCreatesDessert() {
        FoodFactory factory = new DessertFactory();
        FoodItem item = factory.createFoodItem("Chocolate Brownie", 4.50);

        assertNotNull(item, "Created item should not be null");
        assertInstanceOf(Dessert.class, item, "Created item should be an instance of Dessert");
        assertInstanceOf(FoodItem.class, item, "Created item should be an instance of FoodItem");
        assertEquals("Chocolate Brownie", item.getName(), "Name should match");
        assertEquals(4.50, item.getPrice(), 0.001, "Price should match");
        assertEquals("Dessert", item.getCategory(), "Category should be Dessert");
    }

    @Test
    @DisplayName("SandwichFactory creates a Sandwich food item with correct properties")
    void testSandwichFactoryCreatesSandwich() {
        FoodFactory factory = new SandwichFactory();
        FoodItem item = factory.createFoodItem("Veg Club Sandwich", 140.0);

        assertNotNull(item, "Created item should not be null");
        assertInstanceOf(Sandwich.class, item, "Created item should be an instance of Sandwich");
        assertInstanceOf(FoodItem.class, item, "Created item should be an instance of FoodItem");
        assertEquals("Veg Club Sandwich", item.getName(), "Name should match");
        assertEquals(140.0, item.getPrice(), 0.001, "Price should match");
        assertEquals("Sandwiches & Wraps", item.getCategory(), "Category should be Sandwiches & Wraps");
    }

    @Test
    @DisplayName("SnackFactory creates a Snack food item with correct properties")
    void testSnackFactoryCreatesSnack() {
        FoodFactory factory = new SnackFactory();
        FoodItem item = factory.createFoodItem("Peri Peri French Fries", 90.0);

        assertNotNull(item, "Created item should not be null");
        assertInstanceOf(Snack.class, item, "Created item should be an instance of Snack");
        assertInstanceOf(FoodItem.class, item, "Created item should be an instance of FoodItem");
        assertEquals("Peri Peri French Fries", item.getName(), "Name should match");
        assertEquals(90.0, item.getPrice(), 0.001, "Price should match");
        assertEquals("Snacks & Sides", item.getCategory(), "Category should be Snacks & Sides");
    }

    @Test
    @DisplayName("PastaFactory creates a Pasta food item with correct properties")
    void testPastaFactoryCreatesPasta() {
        FoodFactory factory = new PastaFactory();
        FoodItem item = factory.createFoodItem("Creamy Alfredo Pasta", 220.0);

        assertNotNull(item, "Created item should not be null");
        assertInstanceOf(Pasta.class, item, "Created item should be an instance of Pasta");
        assertInstanceOf(FoodItem.class, item, "Created item should be an instance of FoodItem");
        assertEquals("Creamy Alfredo Pasta", item.getName(), "Name should match");
        assertEquals(220.0, item.getPrice(), 0.001, "Price should match");
        assertEquals("Pasta", item.getCategory(), "Category should be Pasta");
    }

    @Test
    @DisplayName("IndianMealFactory creates an IndianMeal food item with correct properties")
    void testIndianMealFactoryCreatesIndianMeal() {
        FoodFactory factory = new IndianMealFactory();
        FoodItem item = factory.createFoodItem("Veg Dum Biryani", 190.0);

        assertNotNull(item, "Created item should not be null");
        assertInstanceOf(IndianMeal.class, item, "Created item should be an instance of IndianMeal");
        assertInstanceOf(FoodItem.class, item, "Created item should be an instance of FoodItem");
        assertEquals("Veg Dum Biryani", item.getName(), "Name should match");
        assertEquals(190.0, item.getPrice(), 0.001, "Price should match");
        assertEquals("Indian Meals", item.getCategory(), "Category should be Indian Meals");
    }
}
