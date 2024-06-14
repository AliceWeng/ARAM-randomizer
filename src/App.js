import { useState, useEffect } from "react";
import './App.css';

function App() {
  let [ids, setIds] = useState([]); // Used for img src.
  let [names, setNames] = useState([]); // Used for champion name.
  let [blueTeam, setBlueTeam] = useState([]);
  let [redTeam, setRedTeam] = useState([]); 
  let [bluePlayers, setBluePlayers] = useState(5);
  let [redPlayers, setRedPlayers] = useState(5);
  let [blueRerolls, setBlueRerolls] = useState([]);
  let [redRerolls, setRedRerolls] = useState([]);
  let [hideBlue, setHideBlue] = useState(false);
  let [hideRed, setHideRed] = useState(false);
  let [rolls, setRolls] = useState(0);

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

  let createTeams = e => {
    e.preventDefault();
    if(!blueTeam.length && !redTeam.length) {
      let numbers = [];
      let blue = [];
      let red = [];
      for(let i = 0; i < Number(bluePlayers) + Number(redPlayers); i++) {
        let number = Math.floor(Math.random() * ids.length);
        if(numbers.includes(number)) {
          i--;
        } else {
          numbers.push(number);
          if(i < bluePlayers) {
            blue.push(number);
          } else {
            red.push(number);
          }
        }
      }
      setBlueTeam(blue);
      setRedTeam(red);
    }
  }

  let renderTeam = color => {
    let team = [];
    for(let i = 0; i < 5; i++) {
      let hidden = color === blueTeam ? hideBlue : hideRed;
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
          { color === blueTeam ? [img, div] : [div, img] }
        </div>
      )
    }
    return team;
  }

  let roll = () => {
    setRolls(rolls + 1);
    if(rolls < 2) {
      let numbers = [...blueTeam, ...redTeam, ...blueRerolls, ...redRerolls];
      let blue = [...blueRerolls];
      let red = [...redRerolls];
      for(let i = 0; i < (Number(bluePlayers) + Number(redPlayers)) * 2; i++) {
        if(!blueRerolls.length && !redRerolls.length) {
          if(i % 2 === 0) {
            let number = Math.floor(Math.random() * ids.length);
            if(numbers.includes(number)) {
              i--;
            } else {
              numbers.push(number);
              if(i < bluePlayers * 2) {
                blue.push(number);
              } else {
                red.push(number);
              }
            }
          } else {
            if(i < bluePlayers * 2) {
              blue.push(undefined);
            } else {
              red.push(undefined);
            }
          }
        } else {
          if(i % 2 === 1) {
            let number = Math.floor(Math.random() * ids.length);
            if(numbers.includes(number)) {
              i--;
            } else {
              numbers.push(number);
              if(i < bluePlayers * 2) {
                blue.splice(i, 1, number);
              } else {
                red.splice(i - 10, 1, number);
              }
            }
          }
        }
      }
      setBlueRerolls(blue);
      setRedRerolls(red);
    }
  }

  let renderRerolls = color => {
    let rerolls = [];
    for(let i = 0; i < 10; i++) {
      let hidden = color === blueRerolls ? hideBlue : hideRed;
      rerolls.push(<div key={i} className="reroll">
                    { color[i] === undefined || hidden
                      ? null
                      : <img
                          title={names[color[i]]}
                          src={`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/champion/${ids[color[i]]}.png`}
                          alt={names[color[i]]}/> }
                   </div>)
    }
    return rerolls;
  }

  let options = () => {
    let options = [];
    for(let i = 5; i > 0; i--) {
      options.push(<option key={i} value={i}>{i}</option>);
    }
    return options;
  }

  let reset = () => {
    setBlueTeam([]);
    setRedTeam([]);
    setBluePlayers(5);
    setRedPlayers(5);
    setBlueRerolls([]);
    setRedRerolls([]);
    setRolls(0);
  } 

  return (
    <>
      <header>
        <h1>ARAM Randomizer</h1>
      </header>
      <main>
        <div style={{display: "flex"}}>
          <div>
            {renderTeam(blueTeam)}
          </div>
          <div>
            {renderRerolls(blueRerolls)}
          </div>
        </div>
        <div>
          { !blueTeam.length && !redTeam.length
            ? <form onSubmit={createTeams} className="container">
                <h2>Number of Players</h2>
                <div>
                 <label>Blue Team</label>
                <select onChange={e => setBluePlayers(e.target.value)}>
                  {options()}
                </select>
                <label>Red Team</label>
                <select onChange={e => setRedPlayers(e.target.value)}>
                  {options()}
                </select>
                </div>
                <button>Start Game</button>
              </form>
            : rolls < 2
            ? <div className="container">
                <button onClick={() => roll()}>Reroll</button>
              </div>
            : <div className="container">
                <button onClick={() => reset()}>Reset</button>
              </div>
          }
          <div className="container">
            <h2>Hide Visibility</h2>
            <div>
              <label htmlFor="toggleBlue">Blue Team</label>
              <input id="toggleBlue" type="checkbox" onChange={() => setHideBlue(!hideBlue)}/>
              <label htmlFor="toggleRed">Red Team</label>
              <input id="toggleRed" type="checkbox" onChange={() => setHideRed(!hideRed)}/>
            </div>
          </div>
        </div>
        <div style={{display: "flex"}}>
          <div>
            {renderRerolls(redRerolls)}
          </div>
          <div>
            {renderTeam(redTeam)}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;