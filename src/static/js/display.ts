//    Plan: 
//    search bar for looking at cards using API https://api.krcg.org/complete/{user input from search bar}
//    from there, user can click on one of the names generated from that list for full description of the rulings related to the specific card
//    this page will also have a text box allowing the user to submit a ruling via the "https://api.krcg.org/submit-ruling/{card from list}
//    and another one for the link to official ruling from a rules director. 

//div element(s)
const cardSearchRegion = document.querySelector('#cardSearch') as HTMLDivElement;
const cardDisplayRegion = document.querySelector('#cardDisplay') as HTMLDivElement;
//button element(s)
const cardSearchButton = document.querySelector('#cardSearchButton') as HTMLButtonElement;
const rulingSubmissionButton = document.querySelector('#rulingSubmissionButton') as HTMLButtonElement;
//input element(s)
const cardSearchInput = document.querySelector('#cardSearch') as HTMLInputElement;
const rulingInput = document.querySelector('#rulingSubmission') as HTMLInputElement;
const linkInput = document.querySelector('#linkSubmission') as HTMLInputElement;
//list element(s)
const searchResults = document.querySelector('#searchResults') as HTMLUListElement;
//p element(s)
const cardDisplay = document.querySelector('#displayCard') as HTMLParagraphElement;

//Code:


//Functions:

//gets information about a specific card
export const getCard = async (cardName: string) =>{
    cardSearchRegion.className = "dont-display";
    cardDisplayRegion.className = "display";
    //initialize request
    let request;
    //generate request
    request = new Request(
        'https://api.krcg.org/card/' + cardName, 
        { method: 'GET' }
    );
    //send request
    fetch(request)
    .then((response) =>{ // <= wait until response is recieved from API
        //if the request doesn't come back OK
        if(!response.ok){
            //throw an error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); //converts json response to js variables & returns them
    })
    .then((data) => { // <= after response is recieved, Process the data recieved
        processCardData(data);
        //changes regions shown
        cardSearchRegion.className = "dont-display";
        cardDisplayRegion.className = "display";
    })
    .catch((error) => { //if an error occurs, catches it here, and logs it into the console
        console.log(error);
    })
}

//returns a list of cards that are similar to the typed item
export const performSearch = async () =>{
    cardSearchInput.innerHTML.replace(' ', '')
    if(cardSearchInput.innerHTML.length <= 2){
        return;
    }
    //initialize request
    let request;
    //generate request
    request = new Request(
        'https://api.krcg.org/complete/' + cardSearchInput.innerText, 
        { method: 'GET' }
    );
    //send request
    fetch(request)
    .then((response) =>{ // <= wait until response is recieved from API
        if(!response.ok){//if the request doesn't come back valid
            //throw an error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); //converts json response to js variables & returns them
    })
    .then((data) => { // <= after response is recieved, Process the data recieved
        processSearchData(data);
        //changes regions shown
        cardDisplayRegion.className = "dont-display";
        
    })
    .catch((error) => { //if an error occurs, catches it here, and logs it into the console
        console.log(error);
    })
}

const processSearchData = (data: string[]) =>{
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
}

const processCardData = (data: CardInfo) => {
    cardDisplay.innerHTML = "Card name: <span class=\"krcg-card\">" + data.name + "</span>\nCard ID: " + data.id + "\nCard Types: ";
    for(let i = 0; i < data.types.length; i++){
        cardDisplay.innerHTML = cardDisplay.innerHTML + typeIcon(data.types[i]) + ", ";
    }
    cardDisplay.innerHTML = cardDisplay.innerHTML + "\nCard Disciplines: ";
    for(let i = 0; i < data.disciplines.length; i++){
        cardDisplay.innerHTML = cardDisplay.innerHTML + discIcon(data.disciplines[i]) + ", ";
    }
    cardDisplay.innerHTML = cardDisplay.innerHTML + "\nCard Clans: ";
    for(let i = 0; i < data.disciplines.length; i++){
        cardDisplay.innerHTML = cardDisplay.innerHTML + clanIcon(data.clans[i]) + ", ";
    }
    cardDisplay.innerHTML = 
    cardDisplay.innerHTML + 
    "\nCapacity: " + data.capacity +
    "\nCard Text: " + data.card_text + 
    "\nFlavor Text: " + data.flavor_text + 
    "\nSets: ";
    for(let i = 0; i < data.ordered_sets.length; i++){
        cardDisplay.innerHTML = cardDisplay.innerHTML + data.ordered_sets[i] + ", ";
    }
    cardDisplay.innerHTML = cardDisplay.innerHTML + "\nArtists: ";
    for(let i = 0; i < data.artists.length; i++){
        cardDisplay.innerHTML = cardDisplay.innerHTML + data.artists[i] + ", ";
    }
    cardDisplay.innerHTML = cardDisplay.innerHTML + 
    "Rulings Made: \n";
    for(let i = 0; i < data.rulings.text.length; i++){
        cardDisplay.innerHTML = cardDisplay.innerHTML + data.rulings.text.length[i] + "\n";
    }
    //use the .replace() function to replace the text with an icon.
    for(let i = cardDisplay.innerHTML.indexOf("["); i != undefined; i = cardDisplay.innerHTML.indexOf("[")){
        let holster = cardDisplay.innerHTML.substring(cardDisplay.innerHTML.indexOf("[") + 1, cardDisplay.innerHTML.indexOf("]"));
        cardDisplay.innerHTML.replace(holster, discIcon(holster));

        let firstPart = cardDisplay.innerHTML.substring(0, cardDisplay.innerHTML.indexOf("["));
        let secondPart = cardDisplay.innerHTML.substring(cardDisplay.innerHTML.indexOf("[") + 1, cardDisplay.innerHTML.indexOf("]"));
        let thirdPart = cardDisplay.innerHTML.substring(cardDisplay.innerHTML.indexOf("]") + 1);
        cardDisplay.innerHTML = firstPart + secondPart + thirdPart;
    }
}

//TODO: create function that returns icon based on the input
function discIcon(iconName: string){
    let returnValue = "";
    switch(iconName){
        case "test":
            returnValue = "test case sucess";
        break;
        case "Abombwe":
            returnValue = "<span class=\"krcg-icon\">w</span>";
        break;
        case "Animalism":
            returnValue = "<span class=\"krcg-icon\">i</span>";
        break;
        case "Auspex":
            returnValue = "<span class=\"krcg-icon\">a</span>";
            break;
        case "Celerity":
            returnValue = "<span class=\"krcg-icon\">c</span>";
        break;
        case "Chimerstry":
            returnValue = "<span class=\"krcg-icon\">k</span>";
        break;
        case "Daimoinon":
            returnValue = "<span class=\"krcg-icon\">y</span>";
        break;
        case "Dementation":
            returnValue = "<span class=\"krcg-icon\">e</span>";
        break;
        case "Dominate":
            returnValue = "<span class=\"krcg-icon\">d</span>";
        break;
        case "Fortitude":
            returnValue = "<span class=\"krcg-icon\">f</span>";
        break;
        case "Melpominee":
            returnValue = "<span class=\"krcg-icon\">m</span>";
        break;
        case "Mytherceria":
            returnValue = "<span class=\"krcg-icon\">x</span>";
        break;
        case "Necromancy":
            returnValue = "<span class=\"krcg-icon\">n</span>";
        break;
        case "Obeah":
            returnValue = "<span class=\"krcg-icon\">b</span>";
        break;
        case "Obfuscate":
            returnValue = "<span class=\"krcg-icon\">o</span>";
        break;
        case "Obtenebration":
            returnValue = "<span class=\"krcg-icon\">$</span>";
        break;
        case "Potence":
            returnValue = "<span class=\"krcg-icon\">p</span>";
        break;
        case "Presence":
            returnValue = "<span class=\"krcg-icon\">r</span>";
        break;
        case "Protean":
            returnValue = "<span class=\"krcg-icon\">j</span>";
        break;
        case "Quietus":
            returnValue = "<span class=\"krcg-icon\">q</span>";
        break;
        case "Sanguinus":
            returnValue = "<span class=\"krcg-icon\">g</span>";
        break;
        case "Serpentis":
            returnValue = "<span class=\"krcg-icon\">s</span>";
        break;
        case "Spiritus":
            returnValue = "<span class=\"krcg-icon\">z</span>";
        break;
        case "Temporis":
            returnValue = "<span class=\"krcg-icon\">?</span>";
        break;
        case "Thanatosis":
            returnValue = "<span class=\"krcg-icon\">h</span>";
        break;
        case "Thaumaturgy":
            returnValue = "<span class=\"krcg-icon\">t</span>";
        break;
        case "Valeren":
            returnValue = "<span class=\"krcg-icon\">l</span>";
        break;
        case "Vicissitude":
            returnValue = "<span class=\"krcg-icon\">v</span>";
        break;
        case "Visceratika":
            returnValue = "<span class=\"krcg-icon\">u</span>";
        break;
        case "Maleficia":
            returnValue = "<span class=\"krcg-icon\">â</span>";
        break;
        case "Striga":
            returnValue = "<span class=\"krcg-icon\">à</span>";
        break;
        default:
            console.log("an error has occured with the disc icon input, must fix");
        break;
    }
    return returnValue;
}
const clanIcon = (iconName: string) => {
    let returnValue = "";
    switch(iconName){
        case "test":

        break;
        case "Brujah":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Malkavian":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Nosferatu":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Toreador":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Tremere":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Ventrue":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Caitiff":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Abomination":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Assamite":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Baali":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Followers of Set":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Gangrel":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Gargoyle":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Giovanni":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Nagaraja":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Ravnos":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Salubri":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Samedi":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "True Brujah":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Akunanse":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Guruhi":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Ishtarri":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        case "Osebo":
            returnValue = "<span class=\"krcg-clan\"></span>";
        break;
        default:
            console.log("an error has occured with the clan icon input, must fix");
        break;
    }
}
const typeIcon = (iconName: string) => {
    let returnValue = "";
    switch(iconName){
        case "test":

        break;
        default:

        break;
    }
}



//Interfaces:

interface CardInfo {
    id: number,
    name: string,
    url: string,
    capacity: number,
    clans: string[],
    types: string[],
    disciplines: string[],
    card_text: string,
    flavor_text: string,
    ordered_sets: string[],
    artists: string[],
    rulings: Rulings,
}

interface Rulings{
    text: string[],
    //links: Links,
}

// interface Links{
//     links: string[],
// }

//event listeners
//cardSearchButton.addEventListener('click', performSearch);
cardSearchInput.addEventListener('keydown', performSearch);