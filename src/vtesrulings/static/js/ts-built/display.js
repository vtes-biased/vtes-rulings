//    Plan: 
//    set up map elemets for icons
//    make changes so that code functions on local server
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//div element(s)
const cardSearchRegion = document.querySelector('#cardSearch');
const cardDisplayRegion = document.querySelector('#cardDisplay');
//button element(s)
const cardSearchButton = document.querySelector('#cardSearchButton');
const rulingSubmissionButton = document.querySelector('#rulingSubmissionButton');
//input element(s)
const cardSearchInput = document.querySelector('#cardSearchBar');
const rulingInput = document.querySelector('#rulingSubmission');
//const linkInput = document.querySelector('#linkSubmission') as HTMLInputElement;
//list element(s)
const searchResults = document.querySelector('#searchResults');
//p element(s)
const cardDisplay = document.querySelector('#displayCard');
//Code:
//Variables:
let discIconMap = new Map();
let clanIconMap = new Map();
discIconMap.set("Abombwe", "<span class=\"krcg-icon\">w</span>");
discIconMap.set("Animalism", "<span class=\"krcg-icon\">i</span>");
discIconMap.set("Auspex", "<span class=\"krcg-icon\">a</span>");
discIconMap.set("Celerity", "<span class=\"krcg-icon\">c</span>");
discIconMap.set("Chimerstry", "<span class=\"krcg-icon\">k</span>");
discIconMap.set("Daimoinon", "<span class=\"krcg-icon\">y</span>");
discIconMap.set("Dementation", "<span class=\"krcg-icon\">e</span>");
discIconMap.set("Dominate", "<span class=\"krcg-icon\">d</span>");
discIconMap.set("Fortitude", "<span class=\"krcg-icon\">f</span>");
discIconMap.set("Melpominee", "<span class=\"krcg-icon\">m</span>");
discIconMap.set("Mytherceria", "<span class=\"krcg-icon\">x</span>");
discIconMap.set("Necromancy", "<span class=\"krcg-icon\">n</span>");
discIconMap.set("Obeah", "<span class=\"krcg-icon\">b</span>");
discIconMap.set("Obfuscate", "<span class=\"krcg-icon\">o</span>");
discIconMap.set("Obtenebration", "<span class=\"krcg-icon\">$</span>");
discIconMap.set("Potence", "<span class=\"krcg-icon\">p</span>");
discIconMap.set("Presence", "<span class=\"krcg-icon\">r</span>");
discIconMap.set("Protean", "<span class=\"krcg-icon\">j</span>");
discIconMap.set("Quietus", "<span class=\"krcg-icon\">q</span>");
discIconMap.set("Sanguinus", "<span class=\"krcg-icon\">g</span>");
discIconMap.set("Serpentis", "<span class=\"krcg-icon\">s</span>");
discIconMap.set("Spiritus", "<span class=\"krcg-icon\">z</span>");
discIconMap.set("Temporis", "<span class=\"krcg-icon\">?</span>");
discIconMap.set("Thanatosis", "<span class=\"krcg-icon\">h</span>");
discIconMap.set("Thaumaturgy", "<span class=\"krcg-icon\">t</span>");
discIconMap.set("Valeren", "<span class=\"krcg-icon\">l</span>");
discIconMap.set("Vicissitude", "<span class=\"krcg-icon\">v</span>");
discIconMap.set("Visceratika", "<span class=\"krcg-icon\">u</span>");
discIconMap.set("Maleficia", "<span class=\"krcg-icon\">â</span>");
discIconMap.set("Striga", "<span class=\"krcg-icon\">à</span>");
clanIconMap.set("Brujah", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Malkavian", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Nosferatu", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Toreador", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Tremere", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Ventrue", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Caitiff", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Abomination", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Assamite", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Baali", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Followers of Set", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Gangrel", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Gargoyle", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Giovanni", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Nagaraja", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Ravnos", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Salubri", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Samedi", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("True Brujah", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Akunanse", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Guruhi", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Ishtarri", "<span class=\"krcg-clan\"></span>");
clanIconMap.set("Osebo", "<span class=\"krcg-clan\"></span>");
//Functions:
//gets information about a specific card
const getCard = (cardName) => __awaiter(this, void 0, void 0, function* () {
    cardSearchRegion.className = "dont-display";
    cardDisplayRegion.className = "display";
    //initialize request
    let request;
    //generate request
    request = new Request('https://api.krcg.org/card/' + cardName.replace(' ', ''), { method: 'GET' });
    //send request
    fetch(request)
        .then((response) => {
        //if the request doesn't come back OK
        if (!response.ok) {
            //throw an error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); //converts json response to js variables & returns them
    })
        .then((data) => {
        processCardData(data);
        //changes regions shown
        cardSearchRegion.className = "dont-display";
        cardDisplayRegion.className = "display";
    })
        .catch((error) => {
        console.log(error);
    });
});
//returns a list of cards that are similar to the typed item
const performSearch = () => __awaiter(this, void 0, void 0, function* () {
    cardSearchInput.innerHTML.replace(' ', '');
    if (cardSearchInput.innerHTML.length <= 2) {
        return;
    }
    //initialize request
    let request;
    //generate request
    request = new Request('https://api.krcg.org/complete/' + cardSearchInput.innerText, { method: 'GET' });
    //send request
    fetch(request)
        .then((response) => {
        if (!response.ok) { //if the request doesn't come back valid
            //throw an error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); //converts json response to js variables & returns them
    })
        .then((data) => {
        processSearchData(data);
        //changes regions shown
        cardDisplayRegion.className = "dont-display";
    })
        .catch((error) => {
        console.log(error);
    });
});
const processSearchData = (data) => {
    let length = data.length;
    for (let i = 0; i < length; i++) {
        const newLi = document.createElement("li");
        const newSpan = document.createElement("span");
        newSpan.className = "krcg-card";
        newSpan.innerHTML = data[i];
        newSpan.addEventListener('click', event => getCard(data[i].replace(' ', '')));
        //add items to list
        newLi.appendChild(newSpan);
        searchResults.appendChild(newLi);
    }
};
const processCardData = (data) => {
    cardDisplay.innerHTML = "Card name: <span class=\"krcg-card\">" + data.name + "</span>\nCard ID: " + data.id + "\nCard Types: ";
    for (let i = 0; i < data.types.length; i++) {
        cardDisplay.innerHTML = cardDisplay.innerHTML + typeIcon(data.types[i]) + ", ";
    }
    cardDisplay.innerHTML = cardDisplay.innerHTML + "\nCard Disciplines: ";
    for (let i = 0; i < data.disciplines.length; i++) {
        cardDisplay.innerHTML = cardDisplay.innerHTML + discIcon(data.disciplines[i]) + ", ";
    }
    cardDisplay.innerHTML = cardDisplay.innerHTML + "\nCard Clans: ";
    for (let i = 0; i < data.disciplines.length; i++) {
        cardDisplay.innerHTML = cardDisplay.innerHTML + clanIcon(data.clans[i]) + ", ";
    }
    cardDisplay.innerHTML =
        cardDisplay.innerHTML +
            "\nCapacity: " + data.capacity +
            "\nCard Text: " + data.card_text +
            "\nFlavor Text: " + data.flavor_text +
            "\nSets: ";
    for (let i = 0; i < data.ordered_sets.length; i++) {
        cardDisplay.innerHTML = cardDisplay.innerHTML + data.ordered_sets[i] + ", ";
    }
    cardDisplay.innerHTML = cardDisplay.innerHTML + "\nArtists: ";
    for (let i = 0; i < data.artists.length; i++) {
        cardDisplay.innerHTML = cardDisplay.innerHTML + data.artists[i] + ", ";
    }
    cardDisplay.innerHTML = cardDisplay.innerHTML +
        "Rulings Made: \n";
    for (let i = 0; i < data.rulings.text.length; i++) {
        cardDisplay.innerHTML = cardDisplay.innerHTML + data.rulings.text[i] + "\n";
    }
    //use the .replace() function to replace the text with an icon.
    for (let i = cardDisplay.innerHTML.indexOf("["); i != undefined; i = cardDisplay.innerHTML.indexOf("[")) {
        let holster = cardDisplay.innerHTML.substring(cardDisplay.innerHTML.indexOf("[") + 1, cardDisplay.innerHTML.indexOf("]"));
        cardDisplay.innerHTML.replace(holster, discIcon(holster));
        let firstPart = cardDisplay.innerHTML.substring(0, cardDisplay.innerHTML.indexOf("["));
        let secondPart = cardDisplay.innerHTML.substring(cardDisplay.innerHTML.indexOf("[") + 1, cardDisplay.innerHTML.indexOf("]"));
        let thirdPart = cardDisplay.innerHTML.substring(cardDisplay.innerHTML.indexOf("]") + 1);
        cardDisplay.innerHTML = firstPart + secondPart + thirdPart;
    }
};
function discIcon(iconName) {
    let returnValue = discIconMap.get(iconName);
    return returnValue;
}
const clanIcon = (iconName) => {
    let returnValue = clanIconMap.get(iconName);
    return returnValue;
};
const typeIcon = (iconName) => {
    let returnValue = "";
    return returnValue;
};
// interface Links{
//     links: string[],
// }
//event listeners
cardSearchButton.addEventListener('click', performSearch);
cardSearchInput.addEventListener('keydown', performSearch);
