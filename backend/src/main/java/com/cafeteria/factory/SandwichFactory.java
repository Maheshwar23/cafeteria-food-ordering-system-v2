package com.cafeteria.factory;

import com.cafeteria.model.FoodItem;
import com.cafeteria.model.Sandwich;

public class SandwichFactory extends FoodFactory {

    @Override
    public FoodItem createFoodItem(String name, double price) {
        return new Sandwich(name, price);
    }
}
