import { useState, useEffect } from "react";
import './App.css';

function App() {
  let [ids, setIds] = useState([]);
  let [names, setNames] = useState([]);
  let [blue, setBlue] = useState(["a", "b", "c", "d", "e"]);
  let [red, setRed] = useState(["f", "g", "h", "i", "j"]);
  let [hideBlue, setHideBlue] = useState(true);
  let [hideRed, setHideRed] = useState(true);

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

  let mapTeam = (team, color) => team.map((number, index) => {
    let hidden = color === "blue" ? hideBlue : hideRed;

    let img = typeof number === "string" || hidden
      ? <img src="https://ddragon.leagueoflegends.com/cdn/14.11.1/img/profileicon/29.png" alt="helmet bro icon"/>
      : <img src={`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/champion/${ids[number]}.png`} alt={names[number]}/>

    let div = <div>
                { typeof number === "string" || hidden
                  ? null
                  : <p>{names[number]}</p> }
                <input placeholder={`Summoner ${index + 1}`} spellCheck="false"/>
              </div>

    return (
      <div key={number} className="summoner">
        { color === "blue" ? [img, div] : [div, img] }
      </div>
    )
  });

  return (
    <div>
      <header>
        <h1>ARAM Randomizer</h1>
      </header>
      <main>
        <div>
          {mapTeam(blue, "blue")}
        </div>
        <div className="middle">
          <button onClick={() => createTeams()}>Accept!</button>
          <h2>Toggle Visibility</h2>
          <div>
            <label>Blue Team</label>
            <input type="checkbox" onChange={() => setHideBlue(!hideBlue)} checked={hideBlue}/>
            <label>Red Team</label>
            <input type="checkbox" onChange={() => setHideRed(!hideRed)} checked={hideRed}/>
          </div>
        </div>
        <div>
          {mapTeam(red, "red")}
        </div>
      </main>
    </div>
  );
}

export default App;