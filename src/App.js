import { useState, useEffect } from "react";
import './App.css';

function App() {
  let [champions, setChampions] = useState([]);
  let [blue, setBlue] = useState([]);
  let [red, setRed] = useState([]);

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    const response = await fetch("https://ddragon.leagueoflegends.com/cdn/14.11.1/data/en_US/champion.json");
    const championsData = await response.json();
    setChampions(Object.keys(championsData.data));
  };

  const createTeams = () => {
    let numbers = [];
    let blue = [];
    let red = [];
    for(let i = 0; i < 10; i++) {
      let number = Math.floor(Math.random() * champions.length);
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

  let mapTeam = team => team.map(index => {
      return (
        <div key={index}>
          <img src={`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/champion/${champions[index]}.png`} alt={champions[index]}/>
          <p>{champions[index]}</p>
        </div>
      )
    });

  return (
    <div>
      <header>

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