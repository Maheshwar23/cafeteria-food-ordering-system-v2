package com.cafeteria.controller.dto;

import com.cafeteria.entity.OrderItemEntity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Represents a single line item within an order response.
 */
public class OrderItemResponse {

    private String foodName;
    private String foodCategory;
    private double unitPrice;
    private int quantity;
    private double subtotal;
    private List<String> customizations = new ArrayList<>();

    public OrderItemResponse() {
    }

    public OrderItemResponse(String foodName, String foodCategory, double unitPrice, int quantity, double subtotal) {
        this.foodName = foodName;
        this.foodCategory = foodCategory;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }

    public OrderItemResponse(OrderItemEntity entity) {
        if (entity != null) {
            this.foodName = entity.getFoodName();
            this.foodCategory = entity.getFoodCategory();
            this.unitPrice = entity.getUnitPrice();
            this.quantity = entity.getQuantity();
            this.subtotal = entity.getSubtotal();
            if (entity.getCustomizations() != null && !entity.getCustomizations().isBlank()) {
                this.customizations = Arrays.asList(entity.getCustomizations().split(","));
            }
        }
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getFoodCategory() {
        return foodCategory;
    }

    public void setFoodCategory(String foodCategory) {
        this.foodCategory = foodCategory;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public List<String> getCustomizations() {
        return customizations;
    }

    public void setCustomizations(List<String> customizations) {
        this.customizations = customizations != null ? customizations : new ArrayList<>();
    }
}
