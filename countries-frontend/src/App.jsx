import { useEffect, useState } from "react";
import axios from "axios";

import{
  BarChart,Bar,
  XAxis,YAxis,
  Tooltip,CartesianGrid,
  PieChart,Pie,Cell,Legend,
  ScatterChart,Scatter,
  LineChart, Line,
  ResponsiveContainer
} from "recharts";

import "./App.css";

const COLORS = ["#6366f1","#f97316","#10b981","#f59e0b","#3b82f6","#ec4899","#14b8a6"];

const formatPop = (value) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  return value;
};
const CustomTooltip=({active, payload})=>{
  if(active &&payload &&payload.length){
    const d=payload[0].payload;
    return(
      <div style={{background: "white", border: "1px solid #ccc", padding: "8px", borderRadius: "6px" }}>
      <p><strong>{d.name}</strong></p>
      <p>Population: {formatPop(d.population)}</p>
      <p>Area: {d.area.toLocaleString()} km²</p>
      </div>
    );
  }
  return null;

}

const API_URL="http://localhost:8080/api/countries";

function App(){
  const[countries, setCountries]=useState([]);

  const [topPopulation, setTopPopulation]=useState([]);
  const[regions,setRegions]=useState([]);
  const[scatterData, setScatterData]=useState([]);
  const[densityData, setDensityData]=useState([]);
  const[languageData, setLanguagesData]=useState([]);

  const [showVisualizations, setShowVisualizations] = useState(false);
  const [activeChart, setActiveChart] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(()=>{
    axios.get(`${API_URL}`)
      .then(res=>setCountries(res.data));
    axios.get(`${API_URL}/top-population`)
      .then(res=>{setTopPopulation(res.data)});
    axios.get(`${API_URL}/regions`)
      .then(res => {
        const formatted=Object.entries(res.data).map(([numeRegiune,valoare])=>({
          region: numeRegiune,
          count: valoare
        }));
        setRegions(formatted);
      });
      axios.get(`${API_URL}/population-vs-area`)
        .then(res=> setScatterData(res.data));
      axios.get(`${API_URL}/density`)
        .then(res=>{
          const sorted= res.data
          .sort((a,b)=>b.density-a.density)
          .slice(0,20);
          setDensityData(sorted);
        })
      axios.get(`${API_URL}/top-languages`)
        .then(res=>{
          const formatted=Object.entries(res.data).map(([language,count])=>({
            language,
            count
        }));
          setLanguagesData(formatted);
        });
  },[]);

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (country.region && country.region.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="app">
      <section className="hero">
        <div className="globe">🌍</div>
        <h1>Countries Analytics Dashboard</h1>
        <p>
          Explore population, area, regions, density and languages using data from a public REST API
        </p>
      </section>
      <section className="table-section">
        <h2>Countries Data</h2>
        {countries.length==0 ? (
          <p>Se incarca datele de la server...</p>
        ):(
          <>
          <div className="search-container">
              <input
                type="text"
                placeholder="🔍 Search country or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Country Name</th>
                  <th>Population</th>
                  <th>Area(km²)</th>
                  <th>Region</th>
                </tr>
              </thead>
              <tbody>
                {filteredCountries.map((country,index)=>(
                  <tr key={index}>
                    <td>{country.name}</td>
                    <td>{country.population.toLocaleString()}</td>
                    <td>{country.area.toLocaleString()}</td>
                    <td>{country.region}</td>
                  </tr>
                ))}
                {filteredCountries.length==0 &&(
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#6b7280"}}>
                      No countries found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </>
        )}
      </section>
      <div className="main-button-wrapper">
        <button
          className="main-button"
          onClick={() => setShowVisualizations(!showVisualizations)}
        >
          Data Visualization
        </button>
      </div>

      {showVisualizations && (
        <section className="visualization-menu">
          <button onClick={() => setActiveChart("topPopulation")}>
            Top 10 Most Populated Countries
          </button>

          <button onClick={() => setActiveChart("scatter")}>
            Population vs Area
          </button>

          <button onClick={() => setActiveChart("regions")}>
            Countries by Region
          </button>

          <button onClick={() => setActiveChart("density")}>
            Population Density Trend
          </button>

          <button onClick={() => setActiveChart("languages")}>
            Top 10 Official Languages
          </button>
        </section>
      )}
      <section className="chart-section">
        {activeChart=="topPopulation" && (
          <div className="chart-card">
          <h2>Top 10 Most Populated Countries</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topPopulation}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis 
                  tickFormatter= {formatPop} width={60}
                />
                <Tooltip/>
                <Bar dataKey="population" fill="#8884d8"/>
            </BarChart>
          </ResponsiveContainer>
          </div>
        )}
        {activeChart=="regions" &&(
          <div className="chart-card">
            <h2>Countries by region</h2>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={regions}
                    dataKey="count"
                    nameKey="region"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {regions.map((entry,index)=>(
                      <Cell key={index}  fill={COLORS[index%COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip />
               </PieChart>
              </ResponsiveContainer>
          </div>
        )}
        {activeChart=="scatter"&&(
          <div className="chart-card">
            <h2>Population vs Area</h2>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <XAxis
                  type="number"
                  dataKey="area"
                  name="Area"
                  unit="km"
                
                />
                <YAxis
                  type="number"
                  dataKey="population"
                  name="Population"
                  tickFormatter={formatPop}
                  width={60}
                />
                <Tooltip content={<CustomTooltip/>}cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Countries" data={scatterData} fill="#16a34a" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
        {activeChart=="density"&&(
          <div className="chart-card">
            <h2>Population density trend(top 20)</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={densityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    interval={0} 
                    tick={{ fontSize: 11 }} 
                  />
                  <YAxis 
                    dataKey="density"
                    domain={[0, "dataMax"]}
                    tickFormatter={(value) => `${Math.round(value)}`}
                    width={80}
                  />
                  <Tooltip formatter={(value) => `${value.toFixed(1)} people/km²`} />
                  <Line 
                    type="monotone" 
                    dataKey="density" 
                    stroke="#f97316" 
                    dot={true} />
                  </LineChart>
              </ResponsiveContainer>  
          </div>
        )}
        {activeChart=="languages" &&(
          <div className="chart-card">
            <h2>Top 10 Official Languages by Number of Countries</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={languageData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="language"
                  type="category"
                  width={100}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;