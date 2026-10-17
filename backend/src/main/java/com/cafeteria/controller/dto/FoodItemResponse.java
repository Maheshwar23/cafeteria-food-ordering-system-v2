package com.cafeteria.controller.dto;

import com.cafeteria.entity.FoodItemEntity;

/**
 * DTO for food item responses.
 */
public class FoodItemResponse {

    private Long id;
    private String name;
    private double price;
    private String category;
    private boolean vegetarian = true;

    public FoodItemResponse() {
    }

    public FoodItemResponse(Long id, String name, double price, String category) {
        this(id, name, price, category, true);
    }

    public FoodItemResponse(Long id, String name, double price, String category, boolean vegetarian) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.vegetarian = vegetarian;
    }

    public FoodItemResponse(FoodItemEntity entity) {
        if (entity != null) {
            this.id = entity.getId();
            this.name = entity.getName();
            this.price = entity.getPrice();
            this.category = entity.getCategory();
            this.vegetarian = entity.isVegetarian();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isVegetarian() {
        return vegetarian;
    }

    public void setVegetarian(boolean vegetarian) {
        this.vegetarian = vegetarian;
    }
}
