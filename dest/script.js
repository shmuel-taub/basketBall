"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const url = "https://nbaserver-q21u.onrender.com/api/filter";
function getPlayers(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(JSON.stringify(filter));
        try {
            const response = yield fetch(url, {
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
            const resJson = yield response.json();
            return resJson;
            //   console.log("json",json, response.body);
        }
        catch (error) {
            console.error(error.message);
            return [];
        }
    });
}
function getInput() {
    return {
        position: document.getElementById("search-position").value,
        points: +document.getElementById("points").value,
        twoPercent: +document.getElementById("two-precent").value,
        threePercent: +document.getElementById("three-precent").value
    };
}
const submitButton = document.getElementById("submit");
if (submitButton) {
    submitButton === null || submitButton === void 0 ? void 0 : submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        let input = getInput();
        renderPlayers(input);
    });
}
function renderPlayers(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        let table = document.getElementById("players-table");
        table.innerHTML = `<thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">Position</th>
                  <th scope="col">Points</th>
                  <th scope="col">%FG</th>
                  <th scope="col">%3P</th>
                  <th scope="col">Action</th>
                </tr>
                
            </thead>`;
        let players = yield getPlayers(filter);
        for (let player of players) {
            table.appendChild(renderPlayer(player));
        }
    });
}
function renderPlayer(player) {
    let row = document.createElement("tr");
    row.innerHTML = `
        <th scope="row">${player.playerName}</th>
        <td>${player.position}</td>
        <td>${player.points}</td>
        <td>${player.twoPercent}</td>
        <td>${player.threePercent}</td>`;
    let action = document.createElement("td");
    let selectButton = document.createElement("button");
    // to do only first name
    selectButton.textContent = `add ${player.playerName.split(' ')[0]} to current team`;
    selectButton.addEventListener("click", () => {
        // console.log(player)
        choosePlayer(player);
    });
    action.appendChild(selectButton);
    row.appendChild(action);
    return row;
}
function choosePlayer(player) {
    let playerEl = document.getElementById(`${player.position}`);
    let dictionary = { "PG": "Point Guard", "SG": "Shooting Guard",
        "SF": "Small Forward", "PF": "Power Forward", "C": "Center" };
    if (playerEl) {
        playerEl.innerHTML = `<div class="position">${dictionary[player.position]}</div>
            <div class="name">${player.playerName}</div>
            <div class="grade">Three Precent: ${player.threePercent}</div>
            <div class="grade">Two Precent: ${player.twoPercent}</div>
            <div class="grade">Points: ${player.points}</div>`;
    }
}
