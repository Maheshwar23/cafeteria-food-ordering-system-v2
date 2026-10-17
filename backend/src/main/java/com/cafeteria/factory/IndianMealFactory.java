package com.cafeteria.factory;

import com.cafeteria.model.FoodItem;
import com.cafeteria.model.IndianMeal;

public class IndianMealFactory extends FoodFactory {

    @Override
    public FoodItem createFoodItem(String name, double price) {
        return new IndianMeal(name, price);
    }
}
