package com.cafeteria.controller;

import com.cafeteria.controller.dto.FoodItemResponse;
import com.cafeteria.entity.FoodItemEntity;
import com.cafeteria.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for food item queries.
 *
 * GET /api/food-items             - list all food items from the database
 * GET /api/food-items?category=X  - filter by category (Burger, Pizza, Beverage, Dessert)
 */
@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @GetMapping
    public ResponseEntity<List<FoodItemResponse>> getFoodItems(
            @RequestParam(required = false) String category) {

        List<FoodItemEntity> items;
        if (category != null && !category.isBlank()) {
            items = foodItemRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            items = foodItemRepository.findAll();
        }

        List<FoodItemResponse> response = items.stream()
                .map(FoodItemResponse::new)
                .toList();

        return ResponseEntity.ok(response);
    }
}
