import { useState, useEffect } from "react";
import './App.css';

function App() {
  let [ids, setIds] = useState([]);
  let [names, setNames] = useState([]);
  let [championPool, setChampionPool] = useState([]);
  let [blue, setBlue] = useState([]);
  let [red, setRed] = useState([]);
  let [hideBlue, setHideBlue] = useState(false);
  let [hideRed, setHideRed] = useState(false);
  let [selected, setSelected] = useState();

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
    for(let i = 0; i < 30; i++) {
      let number = Math.floor(Math.random() * ids.length);
      if(numbers.includes(number)) {
        i--;
      } else {
        numbers.push(number);
        if(numbers.length <= 15) {
          blue.push(number);
        } else red.push(number);
      }
    }
    setBlue(blue);
    setRed(red);
  }

  let team = color => {
    let team = [];
    for(let i = 0; i < 5; i++) {
      let hidden = color === blue ? hideBlue : hideRed;
      let img = color[i] === undefined || hidden
        ? <img key={i} src="https://ddragon.leagueoflegends.com/cdn/14.11.1/img/profileicon/29.png" alt="helmet bro icon"/>
        : <img key={i} src={`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/champion/${ids[color[i]]}.png`} alt={names[color[i]]}/>
      let div = <div key={i + 1}>
                  { color[i] === undefined || hidden
                    ? null
                    : <p>{names[color[i]]}</p> }
                  <input type="text" placeholder={`Summoner ${i + 1}`} spellCheck="false"/>
                </div>
      team.push(
        <div key={i} className="summoner">
          { color === blue ? [img, div] : [div, img] }
        </div>
      )
    }
    return team;
  }

  let rerolls = color => {
    let rerolls = [];
    for(let i = 5; i < 15; i++) {
      let hidden = color === blue ? hideBlue : hideRed;
      rerolls.push(
        <div key={i} className="reroll">
          { color[i] === undefined || hidden 
            ? null
            : <img
                onClick={() => setSelected(color[i])}
                title={names[color[i]]}
                src={`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/champion/${ids[color[i]]}.png`}
                alt={names[color[i]]}/> }
        </div>
      )
    }
    return rerolls;
  }

  return (
    <>
      <header>
        <h1>ARAM Randomizer</h1>
      </header>
      <main>
        <div style={{display: "flex"}}>
          <div>
            {team(blue)}
          </div>
          <div>
            {rerolls(blue)}
          </div>
        </div>
        <div className="controls">
          <button onClick={() => createTeams()}>Accept!</button>
          <h2>Hide Visibility</h2>
          <div>
            <label htmlFor="toggleBlue">Blue Team</label>
            <input id="toggleBlue" type="checkbox" onChange={() => setHideBlue(!hideBlue)}/>
            <label htmlFor="toggleRed">Red Team</label>
            <input id="toggleRed" type="checkbox" onChange={() => setHideRed(!hideRed)}/>
          </div>
        </div>
        <div style={{display: "flex"}}>
          <div>
            {rerolls(red)}
          </div>
          <div>
            {team(red)}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;