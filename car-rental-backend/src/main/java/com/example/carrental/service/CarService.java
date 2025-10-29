package com.example.carrental.service;

import com.example.carrental.model.Car;
import com.example.carrental.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id).orElse(null);
    }

    public Car addCar(Car car) {
        return carRepository.save(car);
    }

    public Car updateCar(Long id, Car updatedCar) {
        Optional<Car> existingOpt = carRepository.findById(id);
        if (existingOpt.isEmpty()) return null;

        Car existing = existingOpt.get();
        existing.setName(updatedCar.getName());
        existing.setType(updatedCar.getType());
        existing.setPrice(updatedCar.getPrice());
        existing.setDescription(updatedCar.getDescription());
        existing.setImageUrl(updatedCar.getImageUrl());
        return carRepository.save(existing);
    }

    public boolean deleteCar(Long id) {
        if (!carRepository.existsById(id)) return false;
        carRepository.deleteById(id);
        return true;
    }
}
