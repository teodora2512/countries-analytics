package com.example.countries.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class CountryClient {
   private final RestTemplate restTemplate=new RestTemplate();

   private String URL="https://restcountries.com/v3.1/all?fields=name,population,area,region,languages";

   public List<Map<String, Object>> fetchCountries(){

       return restTemplate.getForObject(URL, List.class);
   }
}
