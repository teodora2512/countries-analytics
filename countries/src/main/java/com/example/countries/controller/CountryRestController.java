package com.example.countries.controller;

import com.example.countries.dto.Country;
import com.example.countries.service.CountryService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RequestMapping("/api/countries")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class CountryRestController {

    private final CountryService service;

    public CountryRestController(CountryService service) {
        this.service = service;

    }

    @GetMapping
    public List<Country> getAllCountries(){
        return service.getCountries();
    }

    //Bar Chart – Top 10 most populated countries
    @GetMapping("/top-population")
    public List<Country> getTopCountries(){
        return service.getCountries()
                .stream()
                .sorted((a,b)->Long.compare(b.getPopulation(),a.getPopulation()))
                .limit(10)
                .toList();
    }

    //Pie/Donut Chart – Countries by Region
    @GetMapping("/regions")
    public Map<String,Long> byRegion(){
        return service.getCountries()
                .stream()
                .collect(Collectors.groupingBy(Country::getRegion,Collectors.counting()));
    }

    //Line Chart – Population density trend
    @GetMapping("/density")
    public List<Map<String,Object> >density(){

        return service.getCountries()
                .stream()
                .filter(c->c.getArea()>0)
                .map(c->{
                    Map<String,Object> m=new HashMap<>();
                    m.put("name", c.getName());
                    m.put("density",(double)c.getPopulation()/c.getArea());

                    return m;
                })
                .toList();
    }

    //Scatter Plot – Population vs. Area
    @GetMapping("/population-vs-area")
    public List<Map<String, Object>> populationVsArea(){
        return service.getCountries()
                .stream()
                .map(c->{
                    Map<String,Object> m=new HashMap<>();

                    m.put("name", c.getName());
                    m.put("population", c.getPopulation());
                    m.put("area", c.getArea());

                    return m;
                })
                .toList();
    }


    @GetMapping("/top-languages")
    public Map<String,Long>topLanguages(){
        return service.getCountries()
                .stream()
                .filter(c->c.getLanguages()!=null && !c.getLanguages().equals("Unknown"))
                .flatMap(c->List.of(c.getLanguages().split(", ")).stream())
                .collect(Collectors.groupingBy(language->language,Collectors.counting()))
                .entrySet()
                .stream()
                .sorted((a,b)->Long.compare(b.getValue(),a.getValue()))
                .limit(10)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (a,b)->a,
                        java.util.LinkedHashMap::new
                ));
    }
}
