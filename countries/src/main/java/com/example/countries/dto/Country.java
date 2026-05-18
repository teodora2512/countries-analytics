package com.example.countries.dto;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class Country {
    private String name;
    private long population;
    private double area;
    private String region;
    private String languages;


    public Country( String name, long population, double area, String region, String languages) {
        this.name = name;
        this.population = population;
        this.area = area;
        this.region = region;
        this.languages=languages;
    }
}
