//    Plan: 
//    set up map elemets for icons
//    make changes so that code functions on local server

import * as bootstrap from 'bootstrap'
import Autocomplete from "bootstrap5-autocomplete/autocomplete.js";

class UrlState {
    state: Object
    callback: Function
    multivalued: Set<string>
    base_location: string

    constructor(callback: Function, multivalued: string[] | undefined = undefined) {
        this.state = {}
        this.callback = callback
        this.multivalued = new Set(multivalued || [])
        window.addEventListener("popstate", async () => await this.setup())
    }
    async setup() {
        this.base_location = window.location.href.split("?", 1)[0]
        if (window.location.search) {
            const params = new URLSearchParams(window.location.search)
            this.state = {}
            for (const [k, v] of params) {
                if (this.multivalued.has(k)) {
                    this.state[k] = v.split("|")
                } else {
                    this.state[k] = v
                }
            }
        } else {
            this.state = {}
        }
        await this.callback(this.state)
    }
    update(obj: Object) {
        this.state = { ...this.state, ...obj }
        this.refresh()
    }
    remove(key: string) {
        if (key in this.state) {
            delete this.state[key]
            this.refresh()
        }
    }
    reset(obj: Object | undefined = undefined) {
        this.state = obj || {}
        this.refresh()
    }
    refresh() {
        let params = ""
        if (Object.keys(this.state).length > 0) {
            let params_map = {}
            for (const [k, v] of Object.entries(this.state)) {
                if (this.multivalued.has(k)) {
                    params_map[k] = v.join("|")
                } else {
                    params_map[k] = v
                }
            }
            params = "?" + new URLSearchParams(params_map).toString()
        }
        window.history.pushState(this.state, "", this.base_location + params)
        this.callback(this.state)
    }
}

let DISC_DROPDOWN: HTMLDivElement | undefined = undefined

class EditMode {
    proposalButton: HTMLButtonElement
    proposalForm: HTMLFormElement
    proposalStart: HTMLButtonElement
    proposalSubmit: HTMLButtonElement
    proposalMeta: HTMLMetaElement
    rulings: NodeListOf<HTMLDivElement>
    proposal: Proposal
    proposalModal: bootstrap.Modal

    constructor() {
        this.proposalButton = document.getElementById('proposalButton') as HTMLButtonElement
        this.proposalForm = document.getElementById('proposalForm') as HTMLFormElement
        this.proposalStart = document.getElementById("proposalStart") as HTMLButtonElement
        this.proposalSubmit = document.getElementById('proposalSubmit') as HTMLButtonElement
        this.proposalMeta = document.querySelector('meta[name="proposal"]') as HTMLMetaElement
        if (this.proposalMeta) {
            this.proposal = JSON.parse(this.proposalMeta.content)
        }
        this.proposalModal = new bootstrap.Modal('#proposalModal')
        this.proposalButton.addEventListener("click", (event) => this.proposalModal.show())
        if (this.proposalStart) {
            this.proposalForm.action = "http://127.0.0.1:5000/proposal"
            this.proposalStart.addEventListener("click", (event) => this.proposalForm.submit())
        }
        if (this.proposalSubmit) {
            this.proposalForm.action = "http://127.0.0.1:5000/proposal/submit"
            this.proposalSubmit.addEventListener("click", (event) => this.proposalForm.submit())
        }
    }

    displayRulingCard(elem: HTMLDivElement, ruling: Ruling, mainUid: string = "") {
        let card = document.createElement("div")
        card.classList.add("card", "my-1", "krcg-ruling")
        elem.append(card)
        let body = document.createElement("div")
        body.classList.add("card-body", "d-flex", "flex-column", "align-items-start")
        card.append(body)

        if (ruling.target.uid != mainUid) {
            let group = document.createElement("a")
            group.classList.add("badge", "rounded-pill", "bg-primary-subtle", "text-primary-emphasis", "text-decoration-none")
            group.href = `groups.html?uid=${ruling.target.uid}`
            group.innerText = ruling.target.name
            body.append(group)
        }
        // rework ruling text
        let text = ruling.text
        for (const symbol of ruling.symbols) {
            text = text.replaceAll(
                symbol.text,
                `<span class="krcg-icon">${symbol.symbol}</span>`
            )
        }
        for (const card of ruling.cards) {
            let elem = document.createElement("span")
            elem.classList.add("krcg-card")
            elem.innerText = card.name
            text = text.replaceAll(card.text, elem.outerHTML.toString())
        }
        let card_text = document.createElement("p")
        card_text.classList.add("card-text", "my-2")
        if (this.proposal) {
            card_text.contentEditable = "true"
            card_text.addEventListener("focusin", this.displayEditTools);
        }
        body.append(card_text)
        let links_div = document.createElement("div")
        links_div.classList.add("card-footer", "text-body-secondary")
        card.append(links_div)
        for (const reference of ruling.references) {
            text = text.replace(reference.text, "")
            let link_div = document.createElement("div")
            link_div.classList.add("card-link", "badge", "text-bg-secondary")
            let link = document.createElement("a")
            link.classList.add("text-decoration-none", "text-reset")
            link.href = reference.url
            link.innerText = reference.uid
            link.target = "blank"
            link_div.append(link)
            if (this.proposal) {
                let remove_button = document.createElement("button")
                remove_button.classList.add("badge", "btn", "ms-2", "text-bg-danger")
                remove_button.type = "button"
                remove_button.innerHTML = '<i class="bi-trash3"></i>'
                link_div.append(remove_button)
            }
            links_div.append(link_div)
        }
        if (this.proposal) {
            let plus_button = document.createElement("button")
            plus_button.classList.add("badge", "btn", "mx-2", "text-bg-primary")
            plus_button.type = "button"
            plus_button.innerHTML = '<i class="bi-plus-lg"></i>'
            links_div.append(plus_button)
        }
        card_text.innerHTML = text
        addCardEvents(card_text)
    }

    displayEditTools(event: FocusEvent) {
        let disc_dropdown = document.createElement("div")
        disc_dropdown.classList.add("btn-group")
        const target = event.target as HTMLParagraphElement
        target.before(disc_dropdown)
        if (DISC_DROPDOWN) {
            DISC_DROPDOWN.remove()
        }
        DISC_DROPDOWN = disc_dropdown
        let button = document.createElement("button")
        button.classList.add("btn", "btn-secondary", "btn-sm", "dropdown-toggle")
        button.type = "button"
        button.dataset.bsToggle = "dropdown"
        button.ariaExpanded = "false"
        button.innerText = "Disc"
        disc_dropdown.append(button)
        let ul = document.createElement("ul")
        ul.classList.add("dropdown-menu")
        disc_dropdown.append(ul)
        for (const icon of Object.values(ANKHA_SYMBOLS)) {
            let li = document.createElement("li")
            ul.append(li)
            let item = document.createElement("button")
            item.classList.add("dropdown-item")
            item.innerHTML = `<span class="krcg-icon">${icon}</span>`
            li.append(item)
            item.addEventListener("click", insertDisc)
        }
        new bootstrap.Dropdown(button)
    }
}

function insertDisc(clickEvent: Event) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const newElement = document.createElement('span');
    newElement.classList.add("krcg-icon")
    newElement.innerText = (clickEvent.target as HTMLSpanElement).innerText;
    range.insertNode(newElement);
}

class CardSearch extends EditMode {
    cardSearchInput: HTMLInputElement
    cardImg: HTMLImageElement
    cardID: HTMLDivElement
    cardName: HTMLHeadingElement
    cardGroup: HTMLDivElement
    cardAdv: HTMLDivElement
    cardText: HTMLParagraphElement
    rulingsDiv: HTMLDivElement
    rulingsList: HTMLDivElement
    backrefTitle: HTMLDivElement
    backrefList: HTMLDivElement
    autocomplete: Autocomplete
    state: UrlState

    constructor() {
        super()
        this.cardSearchInput = document.getElementById("cardSearchInput") as HTMLInputElement
        this.cardImg = document.getElementById('cardImg') as HTMLImageElement
        this.cardID = document.getElementById('cardID') as HTMLDivElement
        this.cardName = document.getElementById('cardName') as HTMLHeadingElement
        this.cardGroup = document.getElementById('cardGroup') as HTMLDivElement
        this.cardAdv = document.getElementById('cardAdv') as HTMLDivElement
        this.cardText = document.getElementById('cardText') as HTMLParagraphElement
        this.rulingsDiv = document.getElementById('rulingsDiv') as HTMLDivElement
        this.rulingsList = document.getElementById('rulingsList') as HTMLDivElement
        this.backrefTitle = document.getElementById('backrefTitle') as HTMLDivElement
        this.backrefList = document.getElementById('backrefList') as HTMLDivElement

        Autocomplete.init();
        this.autocomplete = new Autocomplete(
            this.cardSearchInput,
            { "onSelectItem": (item: any) => this.state.reset({ uid: item.value }) }
        );
        this.state = new UrlState(async (data: any) => await this.displayCard(data))
    }

    async displayCard(card) {
        if (!card.uid) { return }
        fetch('http://127.0.0.1:5000/card/' + card.uid)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
                }
                return response.json()
            })
            .then((data) => {
                this.processCardData(data)
            })
            .catch((error) => {
                console.log(error)
            })
        this.cardSearchInput.value = ""
    }

    processCardData(data: Card) {
        this.cardImg.src = data.img;
        this.cardImg.alt = data.printed_name + " card image";
        this.cardID.innerText = data.uid;
        this.cardName.innerText = data.printed_name;
        if (data.group) {
            this.cardGroup.classList.remove("invisible");
            if (data.group === "ANY") {
                this.cardGroup.innerText = data.group;
            }
            else {
                this.cardGroup.innerText = "G" + data.group;
            }
        }
        else {
            this.cardGroup.classList.add("invisible");
        }
        if (data.advanced) {
            this.cardAdv.classList.remove("invisible");
        }
        else {
            this.cardAdv.classList.add("invisible");
        }
        let text = data.text
        for (const symbol of data.text_symbols) {
            text = text.replaceAll(
                symbol.text,
                `<span class="krcg-icon">${symbol.symbol}</span>`
            )
        }
        text = text.replaceAll("\n", "<br>")
        this.cardText.innerHTML = text;
        this.rulingsDiv.classList.remove("invisible")
        if (data.rulings && data.rulings.length > 0) {
            this.rulingsList.innerHTML = ""
            this.rulingsList.innerText = ""
        }
        else {
            this.rulingsList.innerHTML = ""
            this.rulingsList.innerText = "No ruling."
        }
        for (const ruling of data.rulings) {
            this.displayRulingCard(this.rulingsList, ruling, data.uid)
        }
        if (data.backrefs && data.backrefs.length > 0) {
            this.backrefTitle.classList.remove("invisible")
        }
        else {
            this.backrefTitle.classList.add("invisible")
        }
        this.backrefList.innerHTML = ""
        for (const card of data.backrefs) {
            let div = document.createElement("a")
            div.href = this.state.base_location + "?" + new URLSearchParams({ uid: card.uid }).toString()
            div.classList.add("card", "bg-primary-subtle", "link-underline", "link-underline-opacity-0")
            div.style.width = "12rem"
            div.classList.add("m-1")
            let img = document.createElement("img")
            img.classList.add("card-img-top")
            img.src = card.img
            img.alt = card.name
            img.style.height = "11rem"
            img.style.objectFit = "cover"
            img.style.objectPosition = "left top"
            div.appendChild(img)
            let title = document.createElement("p")
            title.classList.add("card-title", "text-center", "fw-bold", "my-2")
            title.innerText = card.name
            div.appendChild(title)
            this.backrefList.appendChild(div)
        }
    }
}

class GroupPage extends EditMode {
    groupsList: HTMLDivElement
    groupDisplay: HTMLDivElement

    constructor() {
        super()
        this.groupsList = document.getElementById("groupsList") as HTMLDivElement
        this.groupDisplay = document.getElementById('groupDisplay') as HTMLDivElement
    }

    displayGroup() {
        if (!this.groupDisplay) { return }
        const rulings = JSON.parse(this.groupDisplay.dataset.rulings)
        for (let ruling of rulings) {
            this.displayRulingCard(this.groupDisplay, ruling, this.groupDisplay.dataset.uid)
        }
    }
}

function addCardEvents(pelem: HTMLElement) {
    for (let elem of pelem.children) {
        if (elem.classList.contains("krcg-card")) {
            elem.addEventListener("click", clickCard.bind(elem))
            elem.addEventListener("mouseover", overCard.bind(elem))
            elem.addEventListener("mouseout", outCard)
        }
    }
}

function navActivateCurrent() {
    for (let elem of document.getElementsByClassName("nav-link")) {
        if (elem.tagName === "A") {
            if ((elem as HTMLAnchorElement).href === window.location.href.split('?')[0]) {
                elem.classList.add("active")
                elem.ariaCurrent = "page"
            } else {
                elem.classList.remove("active")
                elem.ariaCurrent = ""
            }
        }
    }
}

async function load() {
    navActivateCurrent()
    if (window.location.pathname === "/index.html") {
        let cardSearch = new CardSearch()
        await cardSearch.state.setup()
    }
    if (window.location.pathname === "/groups.html") {
        let groupPage = new GroupPage()
        groupPage.displayGroup()
    }
}
window.addEventListener("load", load)


// //Functions:

// //gets information about a specific card
// export const getCard_1 = async (cardName: string) => {
//     //cardSearchRegion.className = "dont-display";
//     //cardDisplayRegion.className = "display";
//     //initialize request
//     let request;
//     //generate request
//     request = new Request(
//         'https://api.krcg.org/card/' + cardName.replace(' ', ''), //Use ID, not name!!
//         { method: 'GET' }
//     );
//     //send request
//     fetch(request)
//         .then((response) => { // <= wait until response is recieved from API
//             //if the request doesn't come back OK
//             if (!response.ok) {
//                 //throw an error
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json(); //converts json response to js variables & returns them
//         })
//         .then((data) => { // <= after response is recieved, Process the data recieved
//             changeURL(data)
//             //getCard_2(data);
//             console.log('4');
//             //changes regions shown
//         })
//         .catch((error) => { //if an error occurs, catches it here, and logs it into the console
//             console.log(error);
//         })
// }

// const changeURL = (cardID: IdQuery) => {
//     window.history.pushState({}, "", "http://127.0.0.1:5000/index.html?id=" + cardID.id);
//     getCard_2(cardID.id);
// }

// function DisplayCard(item) {
//     fetch('http://127.0.0.1:5000/card/' + item.value)
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json(); //converts json response to js variables & returns them
//         })
//         .then((data) => { // <= after response is recieved, Process the data recieved
//             processCardData(data);
//         })
//         .catch((error) => { //if an error occurs, catches it here, and logs it into the console
//             console.log(error);
//         })
//     cardSearchInput.value = ""
// }

// //returns a list of cards that are similar to the typed item
// export const performCardSearch = async () => {
//     cardSearchInput.value.replace(' ', '')
//     if (cardSearchInput.value.length <= 2) {
//         return;
//     }
//     //initialize request
//     let request;
//     //generate request
//     request = new Request(
//         'https://api.krcg.org/complete/' + cardSearchInput.value,
//         { method: 'GET' }
//     );
//     //send request
//     fetch(request)
//         .then((response) => { // <= wait until response is recieved from API
//             if (!response.ok) {//if the request doesn't come back valid
//                 //throw an error
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json(); //converts json response to js variables & returns them
//         })
//         .then((data) => { // <= after response is recieved, Process the data recieved
//             processCardSearchData(data);
//             //changes regions shown
//             //cardDisplayRegion.className = "dont-display";

//         })
//         .catch((error) => { //if an error occurs, catches it here, and logs it into the console
//             console.log(error);
//         })
// }

// export const performGroupSearch = async (groupName: string) => {
//     let request;
//     groupSearchRegion.className = "dont-display";
//     groupDisplayRegion.className = "display";
//     //generate request
//     request = new Request(
//         'http://127.0.0.1:5000/group' + groupName.replace(' ', ''),
//         { method: 'GET' }
//     );
//     //send request
//     fetch(request)
//         .then((response) => { // <= wait until response is recieved from API
//             //if the request doesn't come back OK
//             if (!response.ok) {
//                 //throw an error
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json(); //converts json response to js variables & returns them
//         })
//         .then((data) => { // <= after response is recieved, Process the data recieved
//             processGroupData(data);
//             //changes regions shown
//         })
//         .catch((error) => { //if an error occurs, catches it here, and logs it into the console
//             console.log(error);
//         })
// }

// const processCardSearchData = (data: string[]) => {
//     let length = data.length;
//     cardSearchResults.replaceChildren();
//     for (let i = 0; i < length; i++) {
//         const newDiv = document.createElement("div");
//         const newSpan = document.createElement("span");
//         newSpan.className = "krcg-card";
//         newSpan.innerHTML = data[i];
//         newSpan.addEventListener('click', event => getCard_1(data[i].replace(' ', '')));
//         //add items to list
//         newDiv.appendChild(newSpan);
//         cardSearchResults.appendChild(newDiv);
//     }
// // }

// function addCardEvents(pelem: HTMLElement) {
//     for (let elem of pelem.children) {
//         if (elem.classList.contains("krcg-card")) {
//             elem.addEventListener("click", clickCard.bind(elem))
//             elem.addEventListener("mouseover", overCard.bind(elem))
//             elem.addEventListener("mouseout", outCard)
//         }
//     }
// }

// function processCardData(data: Card) {
//     cardImg.src = data.img;
//     cardImg.alt = data.printed_name + " card image";
//     cardID.innerHTML = data.uid;
//     cardName.innerHTML = data.printed_name;
//     if (data.group) {
//         cardGroup.classList.remove("invisible");
//         if (data.group === "ANY") {
//             cardGroup.innerHTML = data.group;
//         }
//         else {
//             cardGroup.innerHTML = "G" + data.group;
//         }
//     }
//     else {
//         cardGroup.classList.add("invisible");
//     }
//     if (data.advanced) {
//         cardAdv.classList.remove("invisible");
//     }
//     else {
//         cardAdv.classList.add("invisible");
//     }
//     let text = data.text
//     for (const symbol of data.text_symbols) {
//         text = text.replaceAll(symbol.text, `<span class="krcg-icon">${symbol.symbol}</span>`)
//     }
//     text = text.replaceAll("\n", "<br>")
//     cardText.innerHTML = text;
//     rulingsDiv.classList.remove("invisible")
//     if (data.rulings && data.rulings.length > 0) {
//         rulingsList.innerHTML = ""
//         rulingsList.innerText = ""
//     }
//     else {
//         rulingsList.innerHTML = ""
//         rulingsList.innerText = "No ruling."
//     }
//     for (const ruling of data.rulings) {
//         let div = document.createElement("div")
//         div.classList.add("card")
//         div.classList.add("my-1")
//         let body = document.createElement("div")
//         body.classList.add("card-body")
//         div.appendChild(body)
//         let text = ruling.text
//         for (const symbol of ruling.symbols) {
//             text = text.replaceAll(symbol.text, `<span class="krcg-icon">${symbol.symbol}</span>`)
//         }
//         for (const card of ruling.cards) {
//             let elem = document.createElement("span")
//             elem.classList.add("krcg-card")
//             elem.innerText = card.name
//             text = text.replaceAll(card.text, elem.outerHTML.toString())
//         }
//         let card_text = document.createElement("p")
//         card_text.classList.add("card-text")
//         body.appendChild(card_text)
//         addCardEvents(card_text)
//         for (const reference of ruling.references) {
//             text = text.replace(reference.text, "")
//             let link = document.createElement("a")
//             link.classList.add("card-link")
//             link.href = reference.url
//             link.innerText = reference.uid
//             link.target = "blank"
//             body.appendChild(link)
//         }
//         card_text.innerHTML = text
//         addCardEvents(card_text)
//         rulingsList.appendChild(div)
//     }
//     if (data.backrefs && data.backrefs.length > 0) {
//         backrefTitle.classList.remove("invisible")
//     }
//     else {
//         backrefTitle.classList.add("invisible")
//     }
//     backrefList.innerHTML = ""
//     for (const card of data.backrefs) {
//         let div = document.createElement("div")
//         div.classList.add("card")
//         div.style.width = "12rem"
//         div.classList.add("m-1")
//         let img = document.createElement("img")
//         img.classList.add("card-img-top")
//         img.src = card.img
//         img.alt = card.name
//         img.style.height = "11rem"
//         img.style.objectFit = "cover"
//         img.style.objectPosition = "left top"
//         div.appendChild(img)
//         let title = document.createElement("p")
//         title.classList.add("card-title", "text-center", "fw-bold", "my-2")
//         title.innerText = card.name
//         div.appendChild(title)
//         backrefList.appendChild(div)
//     }
// //Blood Cost
// if (data.blood_cost != undefined) {
//     CardInfoDisplayUpdate("</br>\nBlood Cost: " + data.blood_cost);
// }
// //Conviction Cost
// if (data.conviction_cost != undefined) {
//     CardInfoDisplayUpdate("</br>\nConviction Cost: " + data.conviction_cost);
// }
// //Pool Cost
// if (data.pool_cost != undefined) {
//     CardInfoDisplayUpdate("</br>\nPool Cost: " + data.pool_cost);
// }

// //Disciplines
// if (data.disciplines[0] != undefined) {
//     if (data.disciplines[0].length > 1) {
//         CardInfoDisplayUpdate("</br>\nCard Disciplines: ");
//         for (let i = 0; i < data.disciplines.length; i++) {
//             CardInfoDisplayUpdate(discIcon(data.disciplines[i]) + ", ");
//         }
//     }
//     else if (data.disciplines[0].length > 0) {
//         CardInfoDisplayUpdate("</br>\nCard Discipline: " + data.disciplines[0]);
//     }
// }
// //Groups
// if (data.groups[0] != undefined) {
//     if (data.groups.length > 1) {
//         CardInfoDisplayUpdate("</br>\nCard Groups: ");
//         for (let i = 0; i < data.groups.length; i++) {
//             CardInfoDisplayUpdate(discIcon(data.groups[i]) + ", ");
//         }
//     }
//     else if (data.groups.length > 0) {
//         CardInfoDisplayUpdate("</br>\nCard Group: " + data.groups[0]);
//     }
// }
// //Card Types
// if (data.types[0] != undefined) {
//     if (data.types.length > 1) {
//         CardInfoDisplayUpdate("</br>\nCard Types: ");
//         for (let i = 0; i < data.types.length; i++) {
//             if (i != data.types.length - 1) {
//                 CardInfoDisplayUpdate(typeIcon(data.types[i]) + ", ");
//             }
//             else {
//                 CardInfoDisplayUpdate(typeIcon(data.types[i]));
//             }
//         }
//     }
//     else if (data.types.length > 0) {
//         CardInfoDisplayUpdate("</br>\nCard Type: " + data.types[0]);
//     }
// }
// //Symbols
// if (data.symbols[0] != undefined) {
//     if (data.symbols.length > 1) {
//         CardInfoDisplayUpdate("</br>\nCard Symbols: ");
//         for (let i = 0; i < data.symbols.length; i++) {
//             if (i != data.symbols.length - 1) {
//                 CardInfoDisplayUpdate(data.symbols[i].text + ": <span class=\"krcg-icon\">" + data.symbols[i].symbol + "</span>, ");
//             }
//             else {
//                 CardInfoDisplayUpdate(data.symbols[i].text + ": <span class=\"krcg-icon\">" + data.symbols[i].symbol + "</span>");
//             }
//         }
//     }
//     else if (data.symbols.length > 0) {
//         CardInfoDisplayUpdate("</br>\nCard Symbol: " + data.symbols[0].text + ": <span class=\"krcg-icon\">" + data.symbols[0].symbol + "</span>");
//     }
// }
// //Card Text
// if (data.text != undefined) {
//     CardInfoDisplayUpdate("</br>\nCard Text: " + data.text);
// }
// //Rulings
// cardRulingList.replaceChildren();
// if (data.rulings.length > 1) {
//     CardInfoDisplayUpdate("</br>\nRelevant Rulings: </br>\n");
//     for (let i = 0; i < data.rulings.length; i++) {
//         const newLi = document.createElement('div');
//         //newLi.innerHTML = newLi.innerHTML + "Ruling ID: " + data.rulings[i].uid;
//         newLi.innerHTML = newLi.innerHTML + "</br>\nRuling Made: " + data.rulings[i].text;
//         if (data.rulings[i].references.length > 0) {
//             for (let j = 0; j < data.rulings[i].references.length; j++) {
//                 newLi.innerHTML.replace(data.rulings[i].references[j].text,
//                     "</br>\n<a href=\"" + data.rulings[i].references[j].url + "\">" + data.rulings[i].references[j].text + "</a>");
//             }
//         }

//         if (data.rulings[i].symbols.length > 0) {
//             newLi.innerHTML = newLi.innerHTML + "</br>\nIncluded Symbols: </br>\n";
//             for (let j = 0; j < data.rulings[i].symbols.length; j++) {
//                 newLi.innerHTML.replace(data.rulings[i].symbols[j].text,
//                     "<span class=\"krcg-icon\">" + data.rulings[i].symbols[j].symbol + "</span>");
//             }
//         }

//         if (data.rulings[i].cards.length > 0) {
//             newLi.innerHTML = newLi.innerHTML + "</br>\nRelevant Card(s): </br>\n";
//             for (let j = 0; j < data.rulings[i].cards.length; j++) {
//                 newLi.innerHTML.replace(data.rulings[i].cards[j].name,
//                     "<a href=\"http://127.0.0.1:5000/card/" + data.rulings[i].cards[j].name + "\">" + data.rulings[i].cards[j].name + "</a>");
//             }
//         }
//         cardRulingList.appendChild(newLi);
//     }
// }
// else if (data.rulings.length > 0) {
//     CardInfoDisplayUpdate("</br>\nRelevant Ruling: </br>\n");
//     const newLi = document.createElement('li');
//     newLi.innerHTML = newLi.innerHTML + "Ruling ID: " + data.rulings[0].uid;
//     newLi.innerHTML = newLi.innerHTML + "</br>\nRuling Made: " + data.rulings[0].text + "</br>\n";
//     if (data.rulings[0].references.length > 0) {
//         for (let j = 0; j < data.rulings[0].references.length; j++) {
//             newLi.innerHTML = newLi.innerHTML + "<a href=\"" + data.rulings[0].references[j].url + "\">" + data.rulings[0].references[j].text + "</a>";
//             newLi.innerHTML = newLi.innerHTML + "</br>\nDate Updated / Created: " + data.rulings[0].references[j].date;
//         }
//     }

//     if (data.rulings[0].symbols.length > 0) {
//         newLi.innerHTML = newLi.innerHTML + "Included Symbols: </br>\n";
//         for (let j = 0; j < data.rulings[0].symbols.length; j++) {
//             newLi.innerHTML = newLi.innerHTML + "<span class=\"krcg-icon\">" + data.rulings[0].symbols[j].symbol + "</span>";
//         }
//     }

//     if (data.rulings[0].cards.length > 0) {
//         for (let j = 0; j < data.rulings[0].cards.length; j++) {
//             newLi.innerHTML.replace(data.rulings[0].cards[j].name,
//                 "<a href=\"http://127.0.0.1:5000/card/" + data.rulings[0].cards[j].uid +
//                 "\" , id=\"referenceLink\">" + data.rulings[0].cards[j].name + "</a>");
//             // const newDiv = document.createElement('div'); 
//             // newDiv.innerHTML = data.rulings[0].cards[j].name + "</br>\n";
//             // newDiv.addEventListener('click', event => getCard_1(data.rulings[0].cards[j].name.replace(' ', '')));
//             // newLi.appendChild(newDiv);
//         }
//     }
//     cardRulingList.appendChild(newLi);
// }
// //Backreferences
// cardBackrefs.replaceChildren();
// if ((data.backrefs[0] != undefined)) {
//     let length = data.backrefs.length;
//     for (let i = 0; i < length; i++) {
//         const newLi = document.createElement("li");
//         const newSpan = document.createElement("span");
//         newSpan.className = "krcg-card";
//         newSpan.innerHTML = data.backrefs[i].name;
//         newSpan.addEventListener('click', event => getCard_1(data.backrefs[i].name.replace(' ', '')));
//         newLi.className = "backrefs";
//         //add items to list
//         newLi.appendChild(newSpan);
//         cardBackrefs.appendChild(newLi);
//     }
// }
// }

// const processGroupData = (data: GroupInfo) => {
//     groupDisplay.innerHTML = "Group Name: " + data.name + "</br>\n";
//     groupRulingList.replaceChildren();
//     if (data.rulings.length > 1) {
//         GroupInfoDisplayUpdate("Relevant Rulings: </br>\n");
//         for (let i = 0; i < data.rulings.length; i++) {
//             const newLi = document.createElement('li');
//             newLi.innerHTML = newLi.innerHTML + "Ruling ID: " + data.rulings[i].uid;
//             newLi.innerHTML = newLi.innerHTML + "</br>\nRuling Made: " + data.rulings[i].text + "</br>\n";
//             if (data.rulings[i].references.length > 0) {
//                 for (let j = 0; j < data.rulings[i].references.length; j++) {
//                     newLi.innerHTML = newLi.innerHTML + "<a href=\"" + data.rulings[i].references[j].url + "\">" + data.rulings[i].references[j].text + "</a>";
//                     newLi.innerHTML = newLi.innerHTML + "</br>\nDate Updated / Created: " + data.rulings[i].references[j].date;
//                 }
//             }

//             if (data.rulings[i].symbols.length > 0) {
//                 newLi.innerHTML = newLi.innerHTML + "Included Symbols: </br>\n";
//                 for (let j = 0; j < data.rulings[i].symbols.length; j++) {
//                     newLi.innerHTML = newLi.innerHTML + "<span class=\"krcg-icon\">" + data.rulings[i].symbols[j].symbol + "</span>";
//                 }
//             }

//             if (data.rulings[i].cards.length > 0) {
//                 newLi.innerHTML = newLi.innerHTML + "</br>\nRelevant Card(s): </br>\n";
//                 for (let j = 0; j < data.rulings[i].cards.length; j++) {
//                     const newDiv = document.createElement('div');
//                     newDiv.innerHTML = data.rulings[i].cards[j].name + "</br>\n";
//                     newDiv.addEventListener('click', event => getCard_1(data.rulings[i].cards[j].name.replace(' ', '')));
//                     newLi.appendChild(newDiv);
//                 }
//             }
//             groupRulingList.appendChild(newLi);
//         }
//     }
//     else if (data.rulings.length > 0) {
//         GroupInfoDisplayUpdate("Relevant Ruling: </br>\n");
//         const newLi = document.createElement('li');
//         newLi.innerHTML = newLi.innerHTML + "Ruling ID: " + data.rulings[0].uid;
//         newLi.innerHTML = newLi.innerHTML + "</br>\nRuling Made: " + data.rulings[0].text + "</br>\n";
//         if (data.rulings[0].references.length > 0) {
//             for (let j = 0; j < data.rulings[0].references.length; j++) {
//                 newLi.innerHTML = newLi.innerHTML + "<a href=\"" + data.rulings[0].references[j].url + "\">" + data.rulings[0].references[j].text + "</a>";
//                 newLi.innerHTML = newLi.innerHTML + "</br>\nDate Updated / Created: " + data.rulings[0].references[j].date;
//             }
//         }

//         if (data.rulings[0].symbols.length > 0) {
//             newLi.innerHTML = newLi.innerHTML + "Included Symbols: </br>\n";
//             for (let j = 0; j < data.rulings[0].symbols.length; j++) {
//                 newLi.innerHTML = newLi.innerHTML + "<span class=\"krcg-icon\">" + data.rulings[0].symbols[j].symbol + "</span>";
//             }
//         }

//         if (data.rulings[0].cards.length > 0) {
//             newLi.innerHTML = newLi.innerHTML + "</br>\nRelevant Card(s): </br>\n";
//             for (let j = 0; j < data.rulings[0].cards.length; j++) {
//                 const newDiv = document.createElement('div');
//                 newDiv.innerHTML = data.rulings[0].cards[j].name + "</br>\n";
//                 newDiv.addEventListener('click', event => getCard_1(data.rulings[0].cards[j].name.replace(' ', '')));
//                 newLi.appendChild(newDiv);
//             }
//         }
//         groupRulingList.appendChild(newLi);
//     }

//     if (data.cards.length > 1) {
//         cardsInGroupLabel.innerHTML = "Cards Under This Ruling: ";
//         let length = data.cards.length
//         for (let i = 0; i < length; i++) {
//             const newLi = document.createElement('li');
//             newLi.innerHTML = newLi.innerHTML + "Card Name: " + data.cards[i].name;
//             newLi.addEventListener('click', event => getCard_1(data.cards[i].name.replace(' ', '')));
//             cardsInGroup.appendChild(newLi);
//         }
//     }
//     else if (data.cards.length > 0) {
//         cardsInGroupLabel.innerHTML = "Card Under This Ruling: ";
//         const newLi = document.createElement('li');
//         newLi.innerHTML = newLi.innerHTML + "Card Name: " + data.cards[0].name;
//         newLi.addEventListener('click', event => getCard_1(data.cards[0].name.replace(' ', '')));
//         cardsInGroup.appendChild(newLi);
//     }
// }

// function CardInfoDisplayUpdate(additionalText: string) {
//     cardDisplay.innerHTML = cardDisplay.innerHTML + additionalText;
// }

// function GroupInfoDisplayUpdate(additionalText: string) {
//     groupDisplay.innerHTML = groupDisplay.innerHTML + additionalText;
// }

// function discIcon(iconName: string) {
//     let returnValue = discIconMap.get(iconName);
//     if (returnValue == undefined) {
//         returnValue = iconName;
//     }
//     return returnValue;
// }

// const clanIcon = (iconName: string) => {
//     let returnValue = clanIconMap.get(iconName);
//     return returnValue;
// }
// const typeIcon = (iconName: string) => {
//     let returnValue = typeIconMap.get(iconName);
//     return returnValue;
// }

// const cardNavSwap = (swap: boolean) => {
//     cardSearchResults.replaceChildren();
//     cardSearchInput.value = "";
//     searchByCard.className = "display";
//     searchByGroup.className = "dont-display";
//     cardSearchRegion.className = "display";
//     cardDisplayRegion.className = "dont-display";
//     if (swap) {
//         window.history.pushState({}, "", "http://127.0.0.1:5000/index.html");
//     }
// }

// const groupNavSwap = (swap: boolean) => {
//     groupSearchResults.replaceChildren();
//     groupSearchInput.value = "";
//     searchByCard.className = "dont-display";
//     searchByGroup.className = "display";
//     groupSearchRegion.className = "display";
//     groupDisplayRegion.className = "dont-display";
//     if (swap) {
//         window.history.pushState({}, "", "http://127.0.0.1:5000/index.html");
//     }
// }

// krcg.js functions
declare function clickCard(): void
declare function overCard(): void
declare function outCard(): void


//Interfaces:

interface UID {
    uid: string
}

interface NID extends UID {
    name: string
}

interface Reference extends UID {
    url: string,
    source: string,
    date: string
}

interface SymbolSubstitution {
    text: string,
    symbol: string
}

interface BaseCard extends NID {
    printed_name: string,
    img: string
}

interface CardSubstitution extends BaseCard {
    text: string
}

interface ReferencesSubstitution extends Reference {
    text: string
}

interface CardInGroup extends BaseCard {
    prefix: string,
    symbols: SymbolSubstitution[]
}


interface Group {
    uid: string,
    name: string,
    cards: CardInGroup[],
    rulings: Ruling[]
}

interface GroupOfCard extends NID {
    prefix: string,
    symbols: SymbolSubstitution[]
}

interface CardVariant extends UID {
    group: number,
    advanced: boolean
}

interface Ruling extends UID {
    target: NID,
    text: string,
    symbols: SymbolSubstitution[],
    references: ReferencesSubstitution[],
    cards: CardSubstitution[]
}

interface Card extends BaseCard {
    types: string[],
    disciplines: string[],
    text: string,
    symbols: SymbolSubstitution[],
    text_symbols: SymbolSubstitution[],
    rulings: Ruling[],
    groups: GroupOfCard[],
    backrefs: BaseCard[],
    // crypt only
    capacity: number | undefined,
    group: string | undefined,
    clan: string | undefined,
    advanced: boolean | undefined,
    variants: CardVariant[] | undefined,
    // library only
    pool_cost: number | undefined,
    blood_cost: number | undefined,
    conviction_cost: number | undefined
}

interface Proposal extends UID {
    name: string
    description: string
    rulings: { [key: string]: { [key: string]: Ruling } }
    references: { [key: string]: Reference }
    groups: { [key: string]: Group }
}

const ANKHA_SYMBOLS = {
    "abo": "w",
    "ani": "i",
    "aus": "a",
    "cel": "c",
    "chi": "k",
    "dai": "y",
    "dem": "e",
    "dom": "d",
    "for": "f",
    "mal": "<",
    "mel": "m",
    "myt": "x",
    "nec": "n",
    "obe": "b",
    "obf": "o",
    "obt": "$",
    "pot": "p",
    "pre": "r",
    "pro": "j",
    "qui": "q",
    "san": "g",
    "ser": "s",
    "spi": "z",
    "str": "+",
    "tem": "?",
    "thn": "h",
    "tha": "t",
    "val": "l",
    "vic": "v",
    "vis": "u",
    "ABO": "W",
    "ANI": "I",
    "AUS": "A",
    "CEL": "C",
    "CHI": "K",
    "DAI": "Y",
    "DEM": "E",
    "DOM": "D",
    "FOR": "F",
    "MAL": ">",
    "MEL": "M",
    "MYT": "X",
    "NEC": "N",
    "OBE": "B",
    "OBF": "O",
    "OBT": "£",
    "POT": "P",
    "PRE": "R",
    "PRO": "J",
    "QUI": "Q",
    "SAN": "G",
    "SER": "S",
    "SPI": "Z",
    "STR": "=",
    "TEM": "!",
    "THN": "H",
    "THA": "T",
    "VAL": "L",
    "VIC": "V",
    "VIS": "U",
    "viz": ")",
    "def": "@",
    "jud": "%",
    "inn": "#",
    "mar": "&",
    "ven": "(",
    "red": "*",
    "ACTION": "0",
    "POLITICAL": "2",
    "POLITICAL ACTION": "2",
    "ALLY": "3",
    "RETAINER": "8",
    "EQUIPMENT": "5",
    "MODIFIER": "1",
    "ACTION MODIFIER": "1",
    "REACTION": "7",
    "COMBAT": "4",
    "REFLEX": "6",
    "POWER": "§",
    "FLIGHT": "^",
    "flight": "^",
    "MERGED": "µ",
    "CONVICTION": "¤",
}