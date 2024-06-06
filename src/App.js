import { useState, useEffect } from "react";
import './App.css';

function App() {
  let [ids, setIds] = useState([]);
  let [names, setNames] = useState([]);
  let [blue, setBlue] = useState([]);
  let [red, setRed] = useState([]);

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    const response = await fetch("https://ddragon.leagueoflegends.com/cdn/14.11.1/data/en_US/champion.json");
    const champions = await response.json();
    const keys = Object.keys(champions.data);
    setIds(keys);
    setNames(keys.map(key => champions.data[key].name));
  };

  const createTeams = () => {
    let numbers = [];
    let blue = [];
    let red = [];
    for(let i = 0; i < 10; i++) {
      let number = Math.floor(Math.random() * ids.length);
      if(numbers.includes(number)) {
        i--;
      } else {
        numbers.push(number);
        if(numbers.length <= 5) {
          blue.push(number);
        } else red.push(number);
      }
    }
    setBlue(blue);
    setRed(red);
  }

  let mapTeam = team => team.map((number, index) => {
      return (
        <div key={index} className="summoner">
          <img src={`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/champion/${ids[number]}.png`} alt={names[number]}/>
          <div>
            <p>{names[number]}</p>
            <input placeholder={`Summoner ${index + 1}`} maxLength="16"/>
          </div>
        </div>
      )
    });

  return (
    <div>
      <header>
        <h1>ARAM Randomizer</h1>
      </header>
      <main>
        <div className="versus">
          <div>
            {mapTeam(blue)}
          </div>
          <button onClick={() => createTeams()}>Accept!</button>
          <div>
            {mapTeam(red)}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;