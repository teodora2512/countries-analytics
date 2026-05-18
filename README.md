# 🌍 Countries Analytics Dashboard

A full-stack web application built with **Spring Boot** and **React** that consumes data from the public REST Countries API and displays it through interactive charts and tables.

The application demonstrates:
- REST API integration
- Backend data processing
- Interactive data visualization
- Frontend-backend communication
- Simple in-memory caching
- Responsive UI design

---

# Features

## 📊 Interactive Charts
- Top 10 Most Populated Countries (Bar Chart)
- Population vs Area (Scatter Plot)
- Countries by Region (Pie Chart)
- Population Density Trend (Line Chart)
- Top 10 Official Languages (Horizontal Bar Chart)

## 🌐 Country Table
- Displays:
  - Country Name
  - Population
  - Area (km²)
  - Region
- Search functionality by country or region

## ⚡ Backend Features
- Consumes external REST API
- Processes nested JSON data
- Exposes custom REST endpoints
- Uses in-memory caching to avoid repeated external API calls

---

# Technologies Used

## Backend
- Java 17
- Spring Boot
- Spring Web
- RESTTemplate
- Lombok

## Frontend
- React
- Axios
- Recharts
- CSS3

---

# 📡 External API

REST Countries API:

https://restcountries.com/

Endpoint used:

https://restcountries.com/v3.1/all?fields=name,population,area,region,languages

---

# Project Architecture

```
REST Countries API
        ↓
CountryClient
        ↓
CountryService
        ↓
CountryRestController
        ↓
React Frontend
        ↓
Charts + Table

```
---

# ⚙️ Backend Structure
```
src/main/java/com/example/countries
│
├── client
│   └── CountryClient.java
│
├── controller
│   └── CountryRestController.java
│
├── dto
│   └── Country.java
│
└── service
    └── CountryService.java

```