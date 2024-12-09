type Position = "PG" | "SG" | "SF" | "PF" | "C"

type PlayerReq = {
    position: Position,
    twoPercent: Number,
    threePercent: Number,
    points: Number
}

type PlayerRes = PlayerReq & {playerName : string} 

const url = "https://nbaserver-q21u.onrender.com/api/filter"

async function getPlayers(filter: PlayerReq): Promise<PlayerRes[]> {
    console.log(JSON.stringify(filter))
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filter)
    });
    // console.log("hi2")
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
  
      const resJson = await response.json();
      return resJson
    //   console.log("json",json, response.body);
    } catch (error) {
      console.error((error as Error).message);
      return []
    }
  }

  function getInput(): PlayerReq {
    return {
      position: (document.getElementById("search-position") as HTMLInputElement).value as Position,
      points: +(document.getElementById("points") as HTMLInputElement).value,
      twoPercent: +(document.getElementById("two-precent") as HTMLInputElement).value,
      threePercent: +(document.getElementById("three-precent") as HTMLInputElement).value
    }
  }

  const submitButton = document.getElementById("submit")
  if (submitButton) {
    submitButton?.addEventListener("click", (e: Event) => {
      e.preventDefault()
      let input = getInput()
      renderPlayers(input)
    })
  }

async function renderPlayers(filter: PlayerReq) {
  let table = document.getElementById("players-table") as HTMLElement
  table.innerHTML = `<thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">Position</th>
                  <th scope="col">Points</th>
                  <th scope="col">%FG</th>
                  <th scope="col">%3P</th>
                  <th scope="col">Action</th>
                </tr>
                
            </thead>`
  let players = await getPlayers(filter)
  for (let player of players)
  {
    table.appendChild(renderPlayer(player))
  }
}

function renderPlayer(player: PlayerRes): HTMLElement {
    let row = document.createElement("tr")
    row.innerHTML = `
        <th scope="row">${player.playerName}</th>
        <td>${player.position}</td>
        <td>${player.points}</td>
        <td>${player.twoPercent}</td>
        <td>${player.threePercent}</td>`
    let action = document.createElement("td")
    let selectButton = document.createElement("button")
    // to do only first name
    selectButton.textContent = `add ${player.playerName.split(' ')[0]} to current team`

    selectButton.addEventListener("click", () => {
      // console.log(player)
      choosePlayer(player)
    })
    action.appendChild(selectButton)
    row.appendChild(action)
    
    return row
}

function choosePlayer(player: PlayerRes) {
  let playerEl = document.getElementById(`${player.position}`)
  let dictionary = {"PG": "Point Guard", "SG": "Shooting Guard",
                    "SF": "Small Forward", "PF": "Power Forward", "C": "Center"}
  if (playerEl) {
    playerEl.innerHTML = `<div class="position">${dictionary[player.position]}</div>
            <div class="name">${player.playerName}</div>
            <div class="grade">Three Precent: ${player.threePercent}</div>
            <div class="grade">Two Precent: ${player.twoPercent}</div>
            <div class="grade">Points: ${player.points}</div>`
  }

}



