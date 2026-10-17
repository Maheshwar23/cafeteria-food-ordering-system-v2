package com.cafeteria.model;

import java.util.Collections;
import java.util.Map;
import java.util.Set;

/**
 * Authoritative server-side registry of valid food customizations,
 * their permitted food categories, and their fixed prices.
 *
 * The frontend NEVER dictates add-on pricing. The backend is the sole
 * authority for validating add-ons and computing price additions.
 */
public class CustomizationRegistry {

    public record AddOn(String id, String name, double price, Set<String> allowedCategories) {}

    private static final Map<String, AddOn> ADD_ONS = Map.of(
            "EXTRA_CHEESE", new AddOn(
                    "EXTRA_CHEESE",
                    "Extra Cheese",
                    25.0,
                    Set.of("burger", "pizza", "sandwiches & wraps", "pasta", "snacks & sides")
            ),
            "EXTRA_PATTY", new AddOn(
                    "EXTRA_PATTY",
                    "Extra Patty",
                    50.0,
                    Set.of("burger")
            ),
            "EXTRA_SAUCE", new AddOn(
                    "EXTRA_SAUCE",
                    "Special Dip & Sauce",
                    15.0,
                    Set.of("burger", "pizza", "sandwiches & wraps", "snacks & sides", "pasta")
            ),
            "EXTRA_SPICE", new AddOn(
                    "EXTRA_SPICE",
                    "Extra Spice Sprinkles",
                    10.0,
                    Set.of("burger", "pizza", "sandwiches & wraps", "snacks & sides", "pasta", "indian meals")
            ),
            "EXTRA_PANEER", new AddOn(
                    "EXTRA_PANEER",
                    "Extra Paneer Cubes",
                    40.0,
                    Set.of("indian meals", "sandwiches & wraps", "pizza")
            ),
            "EXTRA_SALAN", new AddOn(
                    "EXTRA_SALAN",
                    "Extra Mirchi Ka Salan",
                    25.0,
                    Set.of("indian meals")
            ),
            "EXTRA_ICE_CREAM_SCOOP", new AddOn(
                    "EXTRA_ICE_CREAM_SCOOP",
                    "Extra Ice Cream Scoop",
                    30.0,
                    Set.of("dessert", "beverage")
            )
    );

    public static AddOn getAddOn(String id) {
        if (id == null) return null;
        return ADD_ONS.get(id.trim().toUpperCase());
    }

    public static boolean isValidAddOn(String id) {
        return id != null && ADD_ONS.containsKey(id.trim().toUpperCase());
    }

    public static boolean isAllowedForCategory(String id, String category) {
        AddOn addOn = getAddOn(id);
        if (addOn == null || category == null) return false;
        return addOn.allowedCategories().contains(category.trim().toLowerCase());
    }

    public static Map<String, AddOn> getAllAddOns() {
        return Collections.unmodifiableMap(ADD_ONS);
    }
}
