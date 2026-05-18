package com.example.countries.service;

import com.example.countries.client.CountryClient;
import com.example.countries.dto.Country;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CountryService {

    private final CountryClient client;

    private List<Country> cachedCountries;

    private static final Logger log =
            LoggerFactory.getLogger(CountryService.class);


    public CountryService(CountryClient client) {
        this.client = client;
    }


    public List<Country> getCountries(){

        if(cachedCountries==null){
            log.info("Fetching countries....");
            cachedCountries=loadCountries();
        }
        else{
            log.info("Returning countries from cache");
        }
        return cachedCountries;
    }

   private List<Country> loadCountries(){

        List<Map<String,Object>> response=client.fetchCountries();

        List<Country> result=new ArrayList<>();

        for (Map country:response){

            Map nameMap=(Map)country.get("name");

            String name= Optional.ofNullable(nameMap).map(m->(String) m.get("common")).orElse("Unknown");
            Object populationObj=country.get("population");
            Object areaObj=country.get("area");
            String region = Optional.ofNullable((String) country.get("region")).orElse("Unknown");
            Map<String, Object>languagesMap=(Map<String, Object>)country.get("languages");

            long population = populationObj !=null ? ((Number)populationObj).longValue():0;
            double area=areaObj !=null ? ((Number)areaObj).doubleValue():0;
            String languages = "Unknown";

            if (languagesMap != null) {
                languages = languagesMap.values()
                        .stream()
                        .map(Object::toString)
                        .collect(Collectors.joining(", "));
            }

            result.add(new Country(name,population,area,region,languages));
        }

        return result;
    }
}
