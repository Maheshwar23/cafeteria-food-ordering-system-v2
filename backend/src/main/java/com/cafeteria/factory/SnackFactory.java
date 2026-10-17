package com.cafeteria.factory;

import com.cafeteria.model.FoodItem;
import com.cafeteria.model.Snack;

public class SnackFactory extends FoodFactory {

    @Override
    public FoodItem createFoodItem(String name, double price) {
        return new Snack(name, price);
    }
}
