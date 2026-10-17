package com.cafeteria.controller.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a single food item line in a place-order request.
 * The client supplies category, name, quantity, and optional add-on IDs.
 * Price (base and add-on) is ALWAYS sourced from the server-side CustomizationRegistry
 * to prevent client price tampering.
 */
public class OrderItemRequest {

    @NotBlank(message = "Food item category is required")
    private String category;

    @NotBlank(message = "Food item name is required")
    private String name;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    /**
     * Optional list of add-on IDs (e.g. "EXTRA_CHEESE", "EXTRA_PATTY").
     * The backend validates these against the CustomizationRegistry.
     * The client must NEVER submit prices for add-ons.
     */
    private List<String> addOns = new ArrayList<>();

    public OrderItemRequest() {
    }

    public OrderItemRequest(String category, String name, Integer quantity) {
        this.category = category;
        this.name = name;
        this.quantity = quantity;
    }

    public OrderItemRequest(String category, String name, Integer quantity, List<String> addOns) {
        this.category = category;
        this.name = name;
        this.quantity = quantity;
        this.addOns = addOns != null ? addOns : new ArrayList<>();
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public List<String> getAddOns() {
        return addOns;
    }

    public void setAddOns(List<String> addOns) {
        this.addOns = addOns != null ? addOns : new ArrayList<>();
    }
}
