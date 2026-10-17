package com.cafeteria.factory;

import com.cafeteria.model.FoodItem;
import com.cafeteria.model.Pasta;

public class PastaFactory extends FoodFactory {

    @Override
    public FoodItem createFoodItem(String name, double price) {
        return new Pasta(name, price);
    }
}
