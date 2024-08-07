//    Plan: Try it out!
//    set up map elemets for icons
//    make changes so that code functions on local server

//div element(s)
const cardSearchRegion = document.querySelector('#cardSearch') as HTMLDivElement;
const cardDisplayRegion = document.querySelector('#cardDisplay') as HTMLDivElement;

const groupSearchRegion = document.querySelector('#groupSearch') as HTMLDivElement;
const groupDisplayRegion = document.querySelector('#groupDisplay') as HTMLDivElement;
//button element(s)
const cardNewRulingSub = document.querySelector('#cardNewRulingSub') as HTMLButtonElement;
const cardEditRulingSub = document.querySelector('#cardEditRulingSub') as HTMLButtonElement;
const groupNewRulingSub = document.querySelector('#groupNewRulingSub') as HTMLButtonElement;
const groupEditRulingSub = document.querySelector('#groupEditRulingSub') as HTMLButtonElement;
//input element(s)
const cardSearchInput = document.querySelector('#cardSearchBar') as HTMLInputElement;
const groupSearchInput = document.querySelector('#groupSearchBar') as HTMLInputElement;
const rulingInput = document.querySelector('#rulingSubmission') as HTMLInputElement;
const cardNewRulingInput = document.querySelector('#cardNewRulingInput') as HTMLInputElement;
const cardNewRulingReference = document.querySelector('#cardNewRulingReference') as HTMLInputElement;
const cardEditRulingInput = document.querySelector('#cardEditRulingInput') as HTMLInputElement;
const cardEditRulingReference = document.querySelector('#cardEditRulingReference') as HTMLInputElement;
//const linkInput = document.querySelector('#linkSubmission') as HTMLInputElement;
//list element(s)
const cardSearchResults = document.querySelector('#cardSearchResults') as HTMLUListElement;
const cardRulingList = document.querySelector('#cardRulings') as HTMLUListElement;
const cardBackrefs = document.querySelector('#cardBackrefs') as HTMLUListElement;

const cardsInGroup = document.querySelector('#cardsInGroup') as HTMLUListElement;
const groupSearchResults = document.querySelector('#groupSearchResults') as HTMLUListElement;
const groupRulingList = document.querySelector('#groupRulings') as HTMLUListElement;
const groupBackrefs = document.querySelector('#groupBackrefs') as HTMLUListElement;
//p element(s)
const cardDisplay = document.querySelector('#cardInfo') as HTMLParagraphElement;
const groupDisplay = document.querySelector('#groupInfo') as HTMLParagraphElement;
//h elements
const cardsInGroupLabel = document.querySelector('#cardsInGroupLabel') as HTMLHeadingElement
//img elements
const displayCardImg = document.querySelector('#displayCardImg') as HTMLImageElement;

//navigation elements
const cardSearchNavigation = document.querySelector('#cardNav') as HTMLDivElement;
const groupSearchNavigation = document.querySelector('#groupNav') as HTMLDivElement;
//search input
const searchByCard = document.querySelector('#SearchByCard') as HTMLDivElement;
const searchByGroup = document.querySelector('#SearchByGroup') as HTMLDivElement;

//search result navigation
let dropdownResults = cardSearchResults.getElementsByTagName('div');
let dropdownIndex = 0;
//Code:

//Variables:
let discIconMap = new Map();
let clanIconMap = new Map();
let typeIconMap = new Map();

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
export const getCard_1 = async (cardName: string) => {
    //cardSearchRegion.className = "dont-display";
    //cardDisplayRegion.className = "display";
    //initialize request
    let request;
    //generate request
    request = new Request(
        'https://api.krcg.org/card/' + cardName.replace(' ', ''), //Use ID, not name!!
        { method: 'GET' }
    );
    //send request
    fetch(request)
        .then((response) => { // <= wait until response is recieved from API
            //if the request doesn't come back OK
            if (!response.ok) {
                //throw an error
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); //converts json response to js variables & returns them
        })
        .then((data) => { // <= after response is recieved, Process the data recieved
            changeURL(data)
            //getCard_2(data);
            console.log('4');
            //changes regions shown
        })
        .catch((error) => { //if an error occurs, catches it here, and logs it into the console
            console.log(error);
        })
}

const changeURL = (cardID: IdQuery) =>{
    window.history.pushState({}, "", "http://127.0.0.1:5000/index.html?id=" + cardID.id);
    getCard_2(cardID.id);
}

export const getCard_2 = async (cardID: number) => {
    let request;
    //generate request
    request = new Request(
        'http://127.0.0.1:5000/card/' + cardID, 
        { method: 'GET' }
    );
    //send request
    fetch(request)
        .then((response) => { // <= wait until response is recieved from API
            //if the request doesn't come back OK
            if (!response.ok) {
                //throw an error
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); //converts json response to js variables & returns them
        })
        .then((data) => { // <= after response is recieved, Process the data recieved
            processCardData(data);
            cardDisplayRegion.className = "display";
            cardSearchRegion.className = "dont-display";
            console.log('4');
            //changes regions shown
        })
        .catch((error) => { //if an error occurs, catches it here, and logs it into the console
            console.log(error);
        })
}

//returns a list of cards that are similar to the typed item
export const performCardSearch = async () => {
    cardSearchInput.value.replace(' ', '')
    if (cardSearchInput.value.length <= 2) {
        return;
    }
    //initialize request
    let request;
    //generate request
    request = new Request(
        'https://api.krcg.org/complete/' + cardSearchInput.value,
        { method: 'GET' }
    );
    //send request
    fetch(request)
        .then((response) => { // <= wait until response is recieved from API
            if (!response.ok) {//if the request doesn't come back valid
                //throw an error
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); //converts json response to js variables & returns them
        })
        .then((data) => { // <= after response is recieved, Process the data recieved
            processCardSearchData(data);
            //changes regions shown
            //cardDisplayRegion.className = "dont-display";

        })
        .catch((error) => { //if an error occurs, catches it here, and logs it into the console
            console.log(error);
        })
}

export const performGroupSearch = async (groupName: string) => {
    let request;
    groupSearchRegion.className = "dont-display";
    groupDisplayRegion.className = "display";
    //generate request
    request = new Request(
        'http://127.0.0.1:5000/group' + groupName.replace(' ', ''),
        { method: 'GET' }
    );
    //send request
    fetch(request)
        .then((response) => { // <= wait until response is recieved from API
            //if the request doesn't come back OK
            if (!response.ok) {
                //throw an error
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); //converts json response to js variables & returns them
        })
        .then((data) => { // <= after response is recieved, Process the data recieved
            processGroupData(data);
            //changes regions shown
        })
        .catch((error) => { //if an error occurs, catches it here, and logs it into the console
            console.log(error);
        })
}

const processCardSearchData = (data: string[]) => {
    let length = data.length;
    cardSearchResults.replaceChildren();
    for (let i = 0; i < length; i++) {
        const newDiv = document.createElement("div");
        newDiv.className = "cardSearchOption";
        newDiv.innerHTML = data[i];
        newDiv.addEventListener('click', event => getCard_1(data[i].replace(' ', '')));
        //add items to list
        cardSearchResults.appendChild(newDiv);
    }
    dropdownIndex = 0;
    dropdownResults = cardSearchResults.getElementsByTagName('div');
    dropdownResults.item(dropdownIndex).className = "cardSearchOptionSelected";
}

const processCardData = (data: CardInfo) => {
    cardDisplay.innerHTML = "<div>" + data.uid + "</div>" +"<h2>" + data.printed_name + "<h2>";
    //add if statemets to handle possible errors!
    //Card Image
    if (data.img != undefined){
        displayCardImg.src = data.img;
        displayCardImg.alt = data.printed_name + " card image";
    }
    //Blood Cost
    if (data.blood_cost != undefined){
        CardInfoDisplayUpdate("</br>\nBlood Cost: " + data.blood_cost);
    }
    //Conviction Cost
    if (data.conviction_cost != undefined){
        CardInfoDisplayUpdate("</br>\nConviction Cost: " + data.conviction_cost);
    }
    //Pool Cost
    if (data.pool_cost != undefined){
        CardInfoDisplayUpdate("</br>\nPool Cost: " + data.pool_cost);
    }

    //Disciplines
    if(data.disciplines[0] != undefined){
        if (data.disciplines[0].length > 1){
            CardInfoDisplayUpdate("</br>\nDisciplines: ");
            for (let i = 0; i < data.disciplines.length; i++) {
                CardInfoDisplayUpdate(discIcon(data.disciplines[i]) + ", ");
            }
        }
        else if(data.disciplines[0].length > 0){
            CardInfoDisplayUpdate("</br>\nDiscipline: " + data.disciplines[0]);
        }
    }
    //Groups
    if(data.groups[0] != undefined){
        if (data.groups.length > 1){
            CardInfoDisplayUpdate("</br>\nGroups: ");
            for (let i = 0; i < data.groups.length; i++) {
                CardInfoDisplayUpdate(discIcon(data.groups[i]) + ", ");
            }
        }
        else if(data.groups.length > 0){
            CardInfoDisplayUpdate("</br>\nGroup: " + data.groups[0]);
        }
    }
    //Card Types
    if(data.types[0] != undefined){
        if (data.types.length > 1){
            CardInfoDisplayUpdate("</br>\nTypes: ");
            for (let i = 0; i < data.types.length; i++) {
                if(i != data.types.length - 1){
                    CardInfoDisplayUpdate(typeIcon(data.types[i]) + ", ");
                }
                else{
                    CardInfoDisplayUpdate(typeIcon(data.types[i]));
                }
            }
        }
        else if(data.types.length > 0){
            CardInfoDisplayUpdate("</br>\nType: " + data.types[0]);
        }
    }
    //Symbols
    if(data.symbols[0] != undefined){
        if (data.symbols.length > 1){
            CardInfoDisplayUpdate("</br>\nSymbols: ");
            for (let i = 0; i < data.symbols.length; i++) {
                if(i != data.symbols.length - 1){
                    CardInfoDisplayUpdate(data.symbols[i].text + ": <span class=\"krcg-icon\">" + data.symbols[i].symbol + "</span>, ");
                }
                else{
                    CardInfoDisplayUpdate(data.symbols[i].text + ": <span class=\"krcg-icon\">" + data.symbols[i].symbol + "</span>");
                }
            }
        }
        else if(data.symbols.length > 0){
            CardInfoDisplayUpdate("</br>\nCard Symbol: " + data.symbols[0].text + ": <span class=\"krcg-icon\">" + data.symbols[0].symbol + "</span>");
        }
    }
    //Card Text
    if (data.text != undefined){
        CardInfoDisplayUpdate("</br>\nCard Text: " + data.text);
    }
    //Rulings
    cardRulingList.replaceChildren();
    if (data.rulings.length > 1){
        CardInfoDisplayUpdate("</br>\nRelevant Rulings: </br>\n");
        for (let i = 0; i < data.rulings.length; i++) {
            const newLi = document.createElement('div');
            newLi.className = "ruling"
            //newLi.innerHTML = newLi.innerHTML + "Ruling ID: " + data.rulings[i].uid;
            const rulingName = document.createElement('div');
            const rulingText = document.createElement('div');
            rulingText.className = "rulingText";
            rulingText.innerHTML = data.rulings[i].text;
            rulingName.className = "rulingName";
            rulingName.innerHTML = data.rulings[i].uid;
            if (data.rulings[i].references.length > 0){
                for(let j = 0; j < data.rulings[i].references.length; j++){
                    rulingText.innerHTML.replace(data.rulings[i].references[j].text,
                        "</br>\n<a href=\"" + data.rulings[i].references[j].url +"\">"+ data.rulings[i].references[j].text + "</a>");
                }
            }

            if(data.rulings[i].symbols.length > 0){
                for(let j = 0; j < data.rulings[i].symbols.length; j++){
                    rulingText.innerHTML.replace(data.rulings[i].symbols[j].text,
                        "<span class=\"krcg-icon\">" + data.rulings[i].symbols[j].symbol + "</span>");
                }
            } 

            if(data.rulings[i].cards.length > 0){
                for(let j = 0; j < data.rulings[i].cards.length; j++){
                    rulingText.innerHTML.replace(data.rulings[i].cards[j].name,
                        "<a href=\"http://127.0.0.1:5000/card/" + data.rulings[i].cards[j].name +"\" id=\"cardLink\">"+ data.rulings[i].cards[j].name + "</a>");
                }
            }
            const editButton = document.createElement('button');
            editButton.className = "rulingEdit";
            editButton.innerHTML = "edit";
            editButton.addEventListener('click', EditCardRuling);
            newLi.appendChild(rulingName);
            newLi.appendChild(rulingText);
            newLi.appendChild(editButton);    
            cardRulingList.appendChild(newLi);
            cardRulingList.appendChild(document.createElement('br'));       
        }
    }
    else if (data.rulings.length > 0){
        CardInfoDisplayUpdate("</br>\nRelevant Ruling: </br>\n");
        const newLi = document.createElement('div');
        newLi.className = "ruling"
        //newLi.innerHTML = newLi.innerHTML + "Ruling ID: " + data.rulings[i].uid;
        const rulingName = document.createElement('div');
        const rulingText = document.createElement('div');
        rulingText.className = "rulingText";
        rulingText.innerHTML = data.rulings[0].text;
        rulingName.className = "rulingName";
        rulingName.innerHTML = data.rulings[0].uid;
        if (data.rulings[0].references.length > 0){
            for(let j = 0; j < data.rulings[0].references.length; j++){
                rulingText.innerHTML.replace(data.rulings[0].references[j].text,
                    "</br>\n<a href=\"" + data.rulings[0].references[j].url +"\">"+ data.rulings[0].references[j].text + "</a>");
            }
        }

        if(data.rulings[0].symbols.length > 0){
            for(let j = 0; j < data.rulings[0].symbols.length; j++){
                rulingText.innerHTML.replace(data.rulings[0].symbols[j].text,
                    "<span class=\"krcg-icon\">" + data.rulings[0].symbols[j].symbol + "</span>");
            }
        } 

        if(data.rulings[0].cards.length > 0){
            for(let j = 0; j < data.rulings[0].cards.length; j++){
                rulingText.innerHTML.replace(data.rulings[0].cards[j].name,
                    "<a href=\"http://127.0.0.1:5000/card/" + data.rulings[0].cards[j].name +"\" id=\"cardLink\">"+ data.rulings[0].cards[j].name + "</a>");
            }
        }
        const editButton = document.createElement('button');
        editButton.className = "rulingEdit";
        editButton.innerHTML = "edit";
        editButton.addEventListener('click', EditCardRuling);
        newLi.appendChild(rulingName);
        newLi.appendChild(rulingText);
        newLi.appendChild(editButton);    
        cardRulingList.appendChild(newLi);
        cardRulingList.appendChild(document.createElement('br'));
    }
    const createRuling = document.createElement('button');
    createRuling.className = "rulingCreate"
    createRuling.innerHTML = "New Ruling";
    createRuling.addEventListener('click', CreateCardRuling);
    cardRulingList.appendChild(createRuling);
    //Backreferences
    cardBackrefs.replaceChildren();
    if ((data.backrefs[0] != undefined)){
        let length = data.backrefs.length;
        for (let i = 0; i < length; i++) {
            const newLi = document.createElement("div");
            const newSpan = document.createElement("span");
            newSpan.className = "krcg-card";
            newSpan.innerHTML = data.backrefs[i].name;
            newSpan.addEventListener('click', event => getCard_1(data.backrefs[i].name.replace(' ', '')));
            newLi.className = "backrefs";
            //add items to list
            newLi.appendChild(newSpan);
            cardBackrefs.appendChild(newLi);
        }
    }
}

const EditCardRuling = () => {
    if((cardEditRulingInput.value != "") && (cardEditRulingReference.value != "")){
        fetch('http://127.0.0.1:5000/proposal',{
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                card: "",
                symbol: "",
                text: '',
            })
        })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))
    }else if (cardEditRulingInput.value != ""){

    }
}
cardEditRulingSub.addEventListener('click', EditCardRuling);

const CreateCardRuling = () => {
    if(cardNewRulingInput.value != ""){
        fetch('http://127.0.0.1:5000/proposal',{
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                card: "",
                symbol: "",
                reference: '',
                text: '',
            })
        })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))
    }
}
cardNewRulingSub.addEventListener('click', CreateCardRuling);

const processGroupData = (data: GroupInfo) => {
    groupDisplay.innerHTML = "Group Name: " + data.name + "</br>\n";
    groupRulingList.replaceChildren();
    if (data.rulings.length > 1){
        GroupInfoDisplayUpdate("Relevant Rulings: </br>\n");
        for (let i = 0; i < data.rulings.length; i++) {
            const newLi = document.createElement('li');
            newLi.innerHTML = newLi.innerHTML + "Ruling ID: " + data.rulings[i].uid;
            newLi.innerHTML = newLi.innerHTML + "</br>\nRuling Made: " + data.rulings[i].text + "</br>\n";
            if (data.rulings[i].references.length > 0){
                for(let j = 0; j < data.rulings[i].references.length; j++){
                    newLi.innerHTML = newLi.innerHTML + "<a href=\"" + data.rulings[i].references[j].url +"\">"+ data.rulings[i].references[j].text + "</a>";
                    newLi.innerHTML = newLi.innerHTML + "</br>\nDate Updated / Created: " + data.rulings[i].references[j].date;
                }
            }

            if(data.rulings[i].symbols.length > 0){
                newLi.innerHTML = newLi.innerHTML + "Included Symbols: </br>\n";
                for(let j = 0; j < data.rulings[i].symbols.length; j++){
                    newLi.innerHTML = newLi.innerHTML + "<span class=\"krcg-icon\">" + data.rulings[i].symbols[j].symbol + "</span>";
                }
            } 

            if(data.rulings[i].cards.length > 0){
                newLi.innerHTML = newLi.innerHTML + "</br>\nRelevant Card(s): </br>\n";
                for(let j = 0; j < data.rulings[i].cards.length; j++){
                    const newDiv = document.createElement('div'); 
                    newDiv.innerHTML = data.rulings[i].cards[j].name + "</br>\n";
                    newDiv.addEventListener('click', event => getCard_1(data.rulings[i].cards[j].name.replace(' ', '')));
                    newLi.appendChild(newDiv);
                }
            }    
            groupRulingList.appendChild(newLi);       
        }
    }
    else if (data.rulings.length > 0){
        GroupInfoDisplayUpdate("Relevant Ruling: </br>\n");
        const newLi = document.createElement('li');
        newLi.innerHTML = newLi.innerHTML + "Ruling ID: " + data.rulings[0].uid;
        newLi.innerHTML = newLi.innerHTML + "</br>\nRuling Made: " + data.rulings[0].text + "</br>\n";
        if (data.rulings[0].references.length > 0){
            for(let j = 0; j < data.rulings[0].references.length; j++){
                newLi.innerHTML = newLi.innerHTML + "<a href=\"" + data.rulings[0].references[j].url +"\">"+ data.rulings[0].references[j].text + "</a>";
                newLi.innerHTML = newLi.innerHTML + "</br>\nDate Updated / Created: " + data.rulings[0].references[j].date;
            }
        }

        if(data.rulings[0].symbols.length > 0){
            newLi.innerHTML = newLi.innerHTML + "Included Symbols: </br>\n";
            for(let j = 0; j < data.rulings[0].symbols.length; j++){
                newLi.innerHTML = newLi.innerHTML + "<span class=\"krcg-icon\">" + data.rulings[0].symbols[j].symbol + "</span>";
            }
        } 

        if(data.rulings[0].cards.length > 0){
            newLi.innerHTML = newLi.innerHTML + "</br>\nRelevant Card(s): </br>\n";
            for(let j = 0; j < data.rulings[0].cards.length; j++){
                const newDiv = document.createElement('div'); 
                newDiv.innerHTML = data.rulings[0].cards[j].name + "</br>\n";
                newDiv.addEventListener('click', event => getCard_1(data.rulings[0].cards[j].name.replace(' ', '')));
                newLi.appendChild(newDiv);
            }
        }    
        groupRulingList.appendChild(newLi);      
    }

    if(data.cards.length > 1){
        cardsInGroupLabel.innerHTML = "Cards Under This Ruling: ";
        let length = data.cards.length
        for(let i = 0; i < length; i++){
            const newLi = document.createElement('li');
            newLi.innerHTML = newLi.innerHTML + "Card Name: " + data.cards[i].name;
            newLi.addEventListener('click', event => getCard_1(data.cards[i].name.replace(' ', '')));
            cardsInGroup.appendChild(newLi);
        }
    }
    else if (data.cards.length > 0){
        cardsInGroupLabel.innerHTML = "Card Under This Ruling: ";
        const newLi = document.createElement('li');
        newLi.innerHTML = newLi.innerHTML + "Card Name: " + data.cards[0].name;
        newLi.addEventListener('click', event => getCard_1(data.cards[0].name.replace(' ', '')));
        cardsInGroup.appendChild(newLi);
    }
}

const EditGroupRuling = () => {

}
groupEditRulingSub.addEventListener('click', EditGroupRuling);

const CreateGroupRuling = () => {

}
groupNewRulingSub.addEventListener('click', CreateGroupRuling);

function CardInfoDisplayUpdate(additionalText: string){
    cardDisplay.innerHTML = cardDisplay.innerHTML + additionalText;
}

function GroupInfoDisplayUpdate(additionalText: string){
    groupDisplay.innerHTML = groupDisplay.innerHTML + additionalText;
}

function discIcon(iconName: string) {
    let returnValue = discIconMap.get(iconName);
    if(returnValue == undefined){
        returnValue = iconName;
    }
    return returnValue;
}

const clanIcon = (iconName: string) => {
    let returnValue = clanIconMap.get(iconName);
    return returnValue;
}
const typeIcon = (iconName: string) => {
    let returnValue = typeIconMap.get(iconName);
    return returnValue;
}

const cardNavSwap = (swap : boolean) =>{
    cardSearchResults.replaceChildren();
    cardSearchInput.value = "";
    searchByCard.className = "display";
    searchByGroup.className = "dont-display";
    cardSearchRegion.className = "display";
    cardDisplayRegion.className = "dont-display";
    if(swap){
        window.history.pushState({}, "", "http://127.0.0.1:5000/index.html");
    }
}

const groupNavSwap = (swap : boolean) =>{
    groupSearchResults.replaceChildren();
    groupSearchInput.value = "";
    searchByCard.className = "dont-display";
    searchByGroup.className = "display"; 
    groupSearchRegion.className = "display";
    groupDisplayRegion.className = "dont-display";
    if(swap){
        window.history.pushState({}, "", "http://127.0.0.1:5000/index.html?group");
    }
}

const SearchResultNavUp = () => {
    if(dropdownIndex > 0){
        dropdownIndex -= 1;
        dropdownResults[dropdownIndex].className = "cardSearchOptionSelected";
        dropdownResults[dropdownIndex + 1].className = "cardSearchOption";
    }
}
const SearchResultNavDown = () => {
    if(dropdownIndex < dropdownResults.length){
        dropdownIndex += 1;
        dropdownResults.item(dropdownIndex).className = "cardSearchOptionSelected";
        dropdownResults.item(dropdownIndex - 1).className = "cardSearchOption";
    }
}
const SearchResultNavSelect = () => {
    getCard_1(dropdownResults.item(dropdownIndex).innerHTML.replace(' ', ''))
}
//check for key presses, and have things occur based on state / key pressed
document.onkeydown = checkKey;

function checkKey (e) {
    e = e || window.event;
    if(e.keyCode == '38'){
        //up arrow
        SearchResultNavUp();
    }
    else if(e.keyCode == '40'){
        //down arrow
        SearchResultNavDown();
    }
    else if(e.keyCode == '13'){
        //enter key
        SearchResultNavSelect();
    }
    else{
        console.log(e.keyCode);
    }
}

//Interfaces:

interface CardInfo {
    blood_cost: number,
    conviction_cost: number,
    disciplines: string[],
    groups: string[],
    img: string,
    name: string,
    pool_cost: number,
    printed_name: string,
    symbols: Symbols[],
    text: string,
    text_symbols: Symbols[],
    types: string[],
    uid: string,
    rulings: Rulings[],
    unique_name : string,
    backrefs: Backrefs[],
}

interface GroupInfo{
    cards: Cards[],
    name: string,
    rulings: Rulings[],
    uid: string,
}

interface Rulings {
    uid: string,
    target: RulingTarget,
    cards: Cards[],
    references: References[],
    symbols: Symbols[],
    text: string,
}

interface RulingTarget{
    name: string,
    uid: string,
}

interface References{
    text: string,
    uid: string,
    date: string,
    source: string,
    url: URL,
}

interface Symbols{
    text: string,
    symbol: string,
}

interface Cards {
    img: string,
    name: string,
    prefix: string,
    printed_name: string,
    text: string,
    uid: string,
}

interface Backrefs {
    img: string,
    name: string,
    printed_name: string,
    uid: string,
}

interface IdQuery{
    id: number,
}

//event listeners
cardSearchInput.addEventListener('keyup', performCardSearch);

cardSearchNavigation.addEventListener('click', event => cardNavSwap(true));
groupSearchNavigation.addEventListener('click', event => groupNavSwap(true));
//
const hrefCheck = () => {
    if(location.href.includes("id") && location.href.includes("group")){
        let position = location.href.indexOf("id");
        let idSearch = location.href.slice(position + 3, position + 9);
        console.log(idSearch);
        performGroupSearch(idSearch);
    }
    else if(location.href.includes("id")){
        let position = location.href.indexOf("id");
        let idSearch = parseInt(location.href.slice(position + 3, position + 9), 10);
        console.log(idSearch);
        getCard_2(idSearch);
    }
    else{
        cardNavSwap(false);
    }
}
hrefCheck();
window.addEventListener('popstate', hrefCheck);

export {};