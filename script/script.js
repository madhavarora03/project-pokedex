const search     = document.querySelector('#search');
const number     = document.querySelector('#number');
const pkmnImg    = document.querySelector('#pokemon-image');
const types      = document.querySelector('#types');
const weight     = document.querySelector('#weight-value');
const height     = document.querySelector('#height-value');
const statNumber = document.querySelectorAll('.stat-number');
const innerBar   = document.querySelectorAll('.bar-inner');
const outerBar   = document.querySelectorAll('.bar-outer');
const pokedex    = document.querySelector('#pokedex');
const about      = document.querySelector('#about-heading');
const baseStats  = document.querySelector('#base-stats-heading');
const statDesc   = document.querySelectorAll('.stat-description');
const pkmnDesc   = document.querySelector('#description');
const pkmnMoves = document.querySelector('div.moves-dropdown');
// const scrollBar = document.querySelector('.moves-dropdown');
// const scrollBarHover = document.querySelector('.moves-dropdown');

var pkmn_stats = [];
var pkmn_moves = [];

const typeColors = {
    "rock":     [182, 158,  49],
    "ghost":    [112,  85, 155],
    "steel":    [183, 185, 208],
    "water":    [100, 147, 235],
    "grass":    [116, 203,  72],
    "psychic":  [251,  85, 132],
    "ice":      [154, 214, 223],
    "dark":     [117,  87,  76],
    "fairy":    [230, 158, 172],
    "normal":   [170, 166, 127],
    "fighting": [193,  34,  57],
    "flying":   [168, 145, 236],
    "poison":   [164,  62, 158],
    "ground":   [222, 193, 107],
    "bug":      [167, 183,  35],
    "fire":     [245, 125,  49],
    "electric": [249, 207,  48],
    "dragon":   [112,  55, 255]
}


function updates_moves(_data)
{
    for (i in pkmn_moves)
        pkmn_moves[i].remove();

    pkmn_moves = [];
    for(var i = 0; i < _data.moves.length; i++)
    {    
        // console.log(_data.moves[i].move.name);
        pkmn_moves.push(document.createElement('p'));
        pkmn_moves[i].innerHTML = capitalizeFirstLetter(_data.moves[i].move.name);

        pkmnMoves.appendChild(pkmn_moves[i]);
    }
}

function capitalizeFirstLetter(string) {
    const arr = string.split("-");
    
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    
    const str = arr.join(" ");
    return str;
}

window.onclick = function(event){
    if (!event.target.matches('#heading-moves-action')) {
        document.getElementById ("dropdown-moves").style.display = "none";
    }
}
function expandMoves(){
    let displayVal = getComputedStyle(document.getElementById('dropdown-moves')).getPropertyValue('display');
    if(displayVal === 'block'){
        document.getElementById ("dropdown-moves").style.display = "none";
    }
    else if(displayVal === 'none'){
        document.getElementById ("dropdown-moves").style.display = "block";
    }
}
fetchApi = async (pkmnName) => {
    // Joining pokemon names with more than one word
    pkmnName = pkmnName.split(' ').join('-');
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pkmnName.toLowerCase());
    if(response.status===200){
        const pkmnData = await response.json();
        return pkmnData;
    }
    return false;
}

search.addEventListener('change', async(event) => {
    const pkmnData = await fetchApi(event.target.value);
    if (!pkmnData){
        alert("Pokémon does not exist!");
        return;
    }

    // Fetches description data and updates description
    const description_response = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + pkmnData.id.toString());
    const pkmnDescData = await description_response.json();

    pkmnDesc.innerHTML = pkmnDescData.flavor_text_entries[9].flavor_text;


    // Setting theme colour
    const themeColour = typeColors[pkmnData.types[0].type.name];

    // Sets pokemon image
    pkmnImg.src = pkmnData.sprites.other.home.front_default;

    // Finding the max-stat for relative sizing of inner-bar.
    pkmn_stats = [];
    for(var i in pkmnData.stats)
        pkmn_stats.push([pkmnData.stats[i].base_stat]);
    
    let max_stat = Math.max(...pkmn_stats);
        
    // Sets pokemon number # at the top of the page
    number.innerHTML = '#' + pkmnData.id.toString().padStart(3, '0');
    // Sets pokemon image
    pkmnImg.src = pkmnData.sprites.other.home.front_default;
    // Updates "Type" bubble
    types.innerHTML = '';
    pkmnData.types.forEach((t) => {
        // t.type.name
        let newType = document.createElement('span');
        let color   = typeColors[t.type.name];
        newType.innerHTML = t.type.name;
        newType.classList.add('type');
        newType.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`

        types.appendChild(newType);
    });

    // Updates Weight
    weight.innerHTML = (pkmnData.weight/10.0) + " kg";

    // Updates Height
    height.innerHTML = (pkmnData.height/10.0) + " m";

    // Updates Moves    
    updates_moves(pkmnData);
    
    // Updates stat number and stat bar
    pkmnData.stats.forEach((s, i) => {       
        statNumber[i].innerHTML = s.base_stat.toString().padStart(3,'0');
        Math.max(s.base_stat);
        innerBar[i].style.width = `${((s.base_stat/max_stat)*100)-10}%`;
        innerBar[i].style.backgroundColor = `rgb(${themeColour[0]},${themeColour[1]},${themeColour[2]})`
        outerBar[i].style.backgroundColor = `rgba(${themeColour[0]},${themeColour[1]},${themeColour[2]},0.3)`
        statDesc[i].style.color = `rgb(${themeColour[0]},${themeColour[1]},${themeColour[2]})`
    });

    // Updates Pokedex background
    pokedex.style.backgroundColor = `rgb(${themeColour[0]},${themeColour[1]},${themeColour[2]})`

    // Updates the colour of headings and stats heading
    about.style.color = `rgb(${themeColour[0]},${themeColour[1]},${themeColour[2]})`
    baseStats.style.color = `rgb(${themeColour[0]},${themeColour[1]},${themeColour[2]})`

    // Changes the scroll-bar color
    document.body.style.scrollbarFaceColor = `rgba(${themeColour[0]},${themeColour[1]},${themeColour[2]},0.7)`
    document.body.style.scrollbarHighlightColor = `rgb(${themeColour[0]},${themeColour[1]},${themeColour[2]})`

});



async function updates_moves_Bulbasaur() {
    let _dat = await fetchApi('bulbasaur');
    // console.log("testing");
    // console.log(_dat);
    if (!_dat)
        return
    updates_moves(_dat);
}
updates_moves_Bulbasaur();
