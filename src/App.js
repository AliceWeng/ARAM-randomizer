import { useState, useEffect } from "react";
import './App.css';

function App() {
  let [champions, setChampions] = useState([]);

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    const response = await fetch("https://ddragon.leagueoflegends.com/cdn/14.11.1/data/en_US/champion.json");
    const championsData = await response.json();
    setChampions(Object.keys(championsData.data));
  };

  return (
    <div>
      <header>

      </header>
      <main>

      </main>
    </div>
  );
}

export default App;