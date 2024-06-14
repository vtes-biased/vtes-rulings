//    Plan: 
//    search bar for looking at cards using API https://api.krcg.org/complete/{user input from search bar}
//    from there, user can click on one of the names generated from that list for full description of the rulings related to the specific card
//    this page will also have a text box allowing the user to submit a ruling via the "https://api.krcg.org/submit-ruling/{card from list}
//    and another one for the link to official ruling from a rules director. 

//div element(s)
const cardSearchRegion = document.querySelector('#cardSearch') as HTMLDivElement;
const searchResultsRegion = document.querySelector('#searchDisplay') as HTMLDivElement;
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
    searchResultsRegion.className = "dont-display";
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
        searchResultsRegion.className = "dont-display";
        cardDisplayRegion.className = "display";
    })
    .catch((error) => { //if an error occurs, catches it here, and logs it into the console
        console.log(error);
    })
}

//returns a list of cards that are similar to the typed item
export const performSearch = async () =>{
    //changes regions shown
    cardSearchRegion.className = "dont-display";
    searchResultsRegion.className = "display";
    cardDisplayRegion.className = "dont-display";
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
        cardSearchRegion.className = "dont-display";
        searchResultsRegion.className = "display";
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
        newSpan.addEventListener('click', event => getCard(data[i]));
        //add items to list
        newLi.appendChild(newSpan);
        searchResults.appendChild(newLi);
    }
}

const processCardData = (data: CardInfo) => {
    cardDisplay.innerHTML = "Card name: " + data.name + "\nCard ID: " + data.id + "\nCard Types:";
    for(let i = 0; i < data.types.length; i++){
        cardDisplay.innerHTML = cardDisplay.innerHTML + data.types[i] + ", ";
    }
    cardDisplay.innerHTML = cardDisplay.innerHTML + "\nCard Disciplines: ";
    for(let i = 0; i < data.disciplines.length; i++){
        cardDisplay.innerHTML = cardDisplay.innerHTML + data.disciplines[i] + ", ";
    }
    cardDisplay.innerHTML = 
    cardDisplay.innerHTML + 
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
    "Rulings Made: ";
    
}

//Interfaces:

interface CardInfo {
    id: number,
    name: string,
    url: string,
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
    links: Links,
}

interface Links{
    links: string[],
}

//event listeners
cardSearchButton.addEventListener('click', performSearch);