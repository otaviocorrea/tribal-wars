// ==UserScript==
// @name          SUPER Auto-farm on the Map by Otavio Corrêa
// @version       1.0.3
// @namespace     https://github.com/otaviocorrea/tribal-wars
// @email         otaviocorrea@gmail.com
// @description   Automatically farm barbarian villages on the map using farm assistent
// @author        Otavio Corrêa P. Silva
// @include       https://*&screen=map*
// @require       http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL   https://raw.githubusercontent.com/otaviocorrea/tribal-wars/main/scripts/auto-farm-map.js
// @updateURL     https://github.com/otaviocorrea/tribal-wars/raw/main/scripts/auto-farm-map.js
// @icon          https://raw.githubusercontent.com/otaviocorrea/tribal-wars/main/assets/img/map.png
// @grant         GPL
// ==/UserScript==

'use strict';

var settings = {
  letter: 'a',
  pointsToUseB: 0,
  maxDistance: 0,
  villageSwitch: false,
  defaultLoadTime: 5*1000
}

var asParameters = {
  active: true,
  a: {
    active: true,
    units: {archer: 0,axe: 0,catapult: 0,heavy: 0,knight: 0,light: 0,marcher: 0,militia: 0,ram: 0,snob: 0,spear: 0,spy: 0,sword: 0}
  },
  b: {
    active: true,
    units: {archer: 0,axe: 0,catapult: 0,heavy: 0,knight: 0,light: 0,marcher: 0,militia: 0,ram: 0,snob: 0,spear: 0,spy: 0,sword: 0}
  },
}

const images = {
  load: 'https://raw.githubusercontent.com/otaviocorrea/tribal-wars/main/assets/img/load.gif',
}
var units = {archer: 0,axe: 0,catapult: 0,heavy: 0,knight: 0,light: 0,marcher: 0,militia: 0,ram: 0,snob: 0,spear: 0,spy: 0,sword: 0};
var farmActive = false;
var startButton = null;

// LOADERS
const loadSettings = () => {
  let temp = localStorage.getItem('farm-map-settings');
  if(temp){temp = JSON.parse(temp)}
  else{
    localStorage.setItem('farm-map-settings', JSON.stringify(settings))
    temp = JSON.parse(localStorage.getItem('farm-map-settings'));
  }
  settings = temp
}

const loadAsParameters = () => {
  let a = JSON.parse(document.getElementById('mp_farm_a').getAttribute('data-template'));
  let b = JSON.parse(document.getElementById('mp_farm_b').getAttribute('data-template'));
  asParameters.a.active = !a.has_no_units;
  asParameters.b.active = !b.has_no_units;

  asParameters.active = (asParameters.a.active || asParameters.b.active);

  Object.keys(units).forEach(unit => {
    asParameters.a.units[unit] = a[unit];
    asParameters.b.units[unit] = b[unit];
  })
}

// VILLAGES FUNCTIONS

const distance = (xCoord, yCoord) => {
  return TWMap.context.FATooltip.distance(game_data.village.x, game_data.village.y, xCoord, yCoord);
}

const distanceFilter = (a,b) => {
  if (a.distance < b.distance) return -1;
  if (a.distance > b.distance) return 1;
  return 0;
}

const parseCordinate = (villageKey) => { return TWMap.CoordByXY(villageKey); }; // => [xCoord, yCoord]

const getParsedVillages = () => {
  let villagesKeys  = Object.keys(TWMap.villages), villages = [];
  villagesKeys.forEach(key => {
    if(TWMap.villages[key].owner == "0"){
      let villageCoord = parseCordinate(key);
      villages.push({key: key, x: villageCoord[0], y: villageCoord[1], distance: distance(villageCoord[0], villageCoord[1]),...TWMap.villages[key]});
    }
  })

  return villages.sort(distanceFilter);
}


// UTILS
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const randomSleepTime = () => {
  let timerParameters = {min: 1, max: 4}; //Time range in seconds
  return ((Math.floor(Math.random() * (timerParameters.max - timerParameters.min + 1) + timerParameters.min)) + Math.random()) * 1000;
}

const chooseLetter = (village) => {
  let primary = settings.letter;
  let secondary = primary == 'a' ? 'b' : 'a';

  return ((parseInt(settings.pointsToUseB) > 0) && (parseInt(village.points) >= parseInt(settings.pointsToUseB)) && asParameters[secondary].active) ? secondary : primary;
}

const subtractUnits = (farmLetter) => {
  let isNegative = false;
  farmLetter = asParameters[farmLetter].units;
  Object.keys(units).forEach(unit => {
    units[unit] = (parseInt(units[unit]) - parseInt(farmLetter[unit]));
    isNegative = isNegative ? isNegative : (units[unit] < 0);
  });

  return !isNegative;
}

const saveSettings = () => {
  let letter = document.getElementById('letter-map-farm').value;
  let pointsToUseB = parseInt(document.getElementById('points-to-use-alternative-letter-map-farm').value);
  let villageSwitch = document.getElementById('switch-village-map-farm').checked;
  let maxDistance = parseFloat(document.getElementById('distance-map-farm').value);

  settings = {...settings, letter, pointsToUseB, villageSwitch, maxDistance};
  localStorage.setItem('farm-map-settings', JSON.stringify(settings));

  console.log('💾 Saved!');
}

// GUI FUNCTIONS
const createScreeenElements = async () => {
  let div = document.querySelector("#content_value > h2");
  let originalContent = div.innerHTML;
  div.innerHTML = `${originalContent}<br><br><img width="30px" src="${images.load}">`;
  let html = `${originalContent}<br><br>`;

  await sleep(settings.defaultLoadTime);

  html += '<table class="vis">';
  html += '<tr>';
  html += '<th>Farm using</th>';
  html += `<th>Points to use ${settings.letter == 'a' ? 'b' : 'a'}</th>`
  html += '<th>Switch Village?</th>';
  html += '<th>Max. Distance</th>';
  html += '<th></th>';
  html += '<th></th>';
  html += '</tr>';
  html += '<tr>';
  html += `<td align="center"><select name="letter-map-farm" id='letter-map-farm'>`;
  html += `<option value="a" ${settings.letter == 'a' ? 'selected' : ''}>A</option><option value="b" ${settings.letter == 'b' ? 'selected' : ''}>B</option>`;
  html += `</select></td>`;
  html += `<td align="center"><input type="number" id='points-to-use-alternative-letter-map-farm' value="${settings.pointsToUseB}"></td>`;
  html += `<td align="center"><input type="checkbox" id='switch-village-map-farm' value="true" ${settings.villageSwitch ? 'checked' : ''}></td>`;
  html += `<td align="center"><input type="number" id='distance-map-farm' value="${settings.maxDistance}" size="2"></td>`;
  html += `<td align="center"><button id="save-settings-map-farm" class="btn">Save</button></td>`;
  html += `<td align="center"><button id="start-map-farm" class="btn">${!farmActive ? 'Start' : 'Stop'} Farm</button></td>`;
  html += '</tr>';
  html += '</table>';

  if(asParameters.active){
    div.innerHTML = html;

    startButton = document.getElementById('start-map-farm');
    startButton.addEventListener("click", toggleFarm, false);
    let saveButton = document.getElementById('save-settings-map-farm');
    saveButton.addEventListener("click", saveSettings, false);
  }else{div.innerHTML = originalContent+'<br><br><h3>⚠️⚠️⚠️ Farm assistent is required!!! ⚠️⚠️⚠️</h3>';};

}

// FARM FUNCTIONS

const farm = async (villages) => {
  units = TWMap.current_units;
  loadAsParameters();
  if(farmActive){
    console.log('🔥🐎 Farm started!');
    for(let i in villages){
      let village = villages[i];
      if(!farmActive || !subtractUnits(chooseLetter(village)) || !(settings.maxDistance == '0' || settings.maxDistance >= village.distance)) break;
      await sleep(randomSleepTime());
      farmVillage(village);
    }
  }

  endFarm();
}

const farmVillage = (village) => {
  TWMap.mapHandler.onClick(village.x, village.y, new Event('click'));
  let url = TWMap.urls.ctx[`mp_farm_${chooseLetter(village)}`].replace(/__village__/, village.id).replace(/__source__/, game_data.village.id);
  TribalWars.get(url, null, function (a) { TWMap.context.ajaxDone(null, url); }, undefined, undefined);
  console.log('🪓');
}

const endFarm = () => {
  if(!farmActive) return;
  console.log('🎉👍 Farm completed in this village!');
  return settings.villageSwitch ? nextVillage() : killFarm();
}

const initFarm = () => {
  if(farmActive) return;
  farmActive = true;
  sessionStorage.setItem('map-farm-active', farmActive);
  startButton.innerHTML = `Stop Farm`;
  console.log('🟢🤖 Autofarm started!');
  farm(getParsedVillages());
}

const killFarm = () => {
  if(!farmActive) return;
  farmActive = false;
  sessionStorage.setItem('map-farm-active', farmActive);
  startButton.innerHTML = `Start Farm`;
  console.log('🛑🤖 Autofarm stopped!');
}

const toggleFarm = (element) => {
  farmActive ? killFarm() : initFarm();
}

const nextVillage = () => {
  document.getElementById('village_switch_right').click();
}

// INITIATORS
const init = async () => {
  farmActive = sessionStorage.getItem('map-farm-active') == 'true';
  loadSettings();
  loadAsParameters();
  createScreeenElements();

  await sleep(settings.defaultLoadTime - 1000);
  if(farmActive) farm(getParsedVillages());
};

init();
