import { main } from '@popperjs/core';
import * as bootstrap from 'bootstrap'
import Autocomplete from "bootstrap5-autocomplete/autocomplete.js";

Autocomplete.init();

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


const ERROR_TOAST_DIV = document.getElementById('errorToast') as HTMLDivElement
let ERROR_TOAST = bootstrap.Toast.getOrCreateInstance(ERROR_TOAST_DIV)

// class ModalWithOrigin extends bootstrap.Modal {
//     origin: HTMLElement | undefined

//     constructor(...args: ConstructorParameters<typeof bootstrap.Modal>) {
//         super(...args)
//         this.origin = undefined
//     }

//     show(relatedTarget?: HTMLElement): void {

//     }
// }

function displayError(msg: string) {
    let body = ERROR_TOAST_DIV.querySelector("div.toast-body") as HTMLDivElement
    body.innerText = msg
    ERROR_TOAST.show()
}

class EditMode {
    proposalButton: HTMLButtonElement
    proposalForm: HTMLFormElement
    proposalStart: HTMLButtonElement
    proposalSubmit: HTMLButtonElement
    proposalApprove: HTMLButtonElement
    proposalMeta: HTMLMetaElement
    referenceNewButton: HTMLButtonElement
    rulings: NodeListOf<HTMLDivElement>
    proposal: Proposal
    proposalModal: bootstrap.Modal
    referencelModal: bootstrap.Modal

    constructor() {
        this.proposalButton = document.getElementById('proposalButton') as HTMLButtonElement
        this.proposalForm = document.getElementById('proposalForm') as HTMLFormElement
        this.proposalStart = document.getElementById("proposalStart") as HTMLButtonElement
        this.proposalSubmit = document.getElementById('proposalSubmit') as HTMLButtonElement
        this.proposalApprove = document.getElementById('proposalApprove') as HTMLButtonElement
        this.proposalMeta = document.querySelector('meta[name="proposal"]') as HTMLMetaElement
        this.referenceNewButton = document.getElementById('referenceNewButton') as HTMLButtonElement
        if (this.proposalMeta) {
            this.proposal = JSON.parse(this.proposalMeta.content)
            this.displayProposal(this.proposal)
        }
        this.proposalModal = new bootstrap.Modal('#proposalModal')
        this.referencelModal = new bootstrap.Modal('#referenceModal')
        this.proposalButton.addEventListener("click", (event) => this.proposalModal.show())
        console.log(window.location)
        const next = encodeURIComponent(window.location.pathname + window.location.search)
        if (this.proposalStart) {
            this.proposalForm.action = `http://127.0.0.1:5000/proposal?next=${next}`
            this.proposalStart.addEventListener("click", (event) => this.proposalForm.submit())
        }
        if (this.proposalSubmit) {
            this.proposalForm.action = `http://127.0.0.1:5000/proposal/submit?next=${next}`
            this.proposalSubmit.addEventListener("click", (event) => this.proposalForm.submit())
        }
        if (this.proposalApprove) {
            this.proposalForm.action = `http://127.0.0.1:5000/proposal/approve?next=${next}`
            this.proposalApprove.addEventListener("click", (event) => this.proposalForm.submit())
        }
    }

    displayRulingCard(elem: HTMLDivElement, ruling: Ruling, mainUid: string = "") {
        let card = document.createElement("div")
        card.classList.add("card", "my-1", "krcg-ruling")
        card.dataset.KrcgRulingText = ruling.text
        card.dataset.KrcgRulingUid = ruling.uid
        card.dataset.KrcgRulingTargetUid = mainUid
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
                `<span class="krcg-icon" contenteditable="false">${symbol.symbol}</span>`
            )
        }
        for (const card of ruling.cards) {
            let elem = document.createElement("span")
            elem.classList.add("krcg-card")
            elem.contentEditable = "false"
            elem.innerText = card.name
            text = text.replaceAll(card.text, elem.outerHTML.toString())
        }
        let card_text = document.createElement("p")
        card_text.classList.add("card-text", "my-2")
        if (this.proposal && ruling.target.uid === mainUid) {
            card_text.contentEditable = "true"
            card_text.addEventListener("focusin", displayEditTools)
            card_text.addEventListener("input", debounce(async () => { await rulingSave(card) }))
            // card_text.addEventListener("blur", (ev) => {
            //     console.log(ev)
            //     console.log(window.getSelection())
            //     const sel = window.getSelection()
            //     if (!sel.anchorNode) { return }
            //     CARET = new Range()
            //     console.log(sel.anchorNode)
            //     CARET.setStart(sel.anchorNode, sel.anchorOffset)
            //     CARET.setEnd(sel.anchorNode, sel.anchorOffset)
            // })
        }
        body.append(card_text)
        let links_div = document.createElement("div")
        links_div.classList.add("card-footer", "text-body-secondary")
        card.append(links_div)
        for (const reference of ruling.references) {
            text = text.replace(reference.text, "")
            addRulingReference(card, links_div, reference, Boolean(this.proposal), false)
        }
        if (this.proposal) {
            let plus_button = document.createElement("button")
            plus_button.classList.add("badge", "btn", "mx-2", "text-bg-primary")
            plus_button.type = "button"
            plus_button.innerHTML = '<i class="bi-plus-lg"></i>'
            links_div.append(plus_button)
            plus_button.addEventListener("click", () => {
                this.referencelModal.show(card)
                this.referenceNewButton.addEventListener(
                    "click",
                    async (ev) => { await createAndAddLink(ev, card); this.referencelModal.hide() },
                    { once: true }
                )
            })
        }
        card_text.innerHTML = text
        addCardEvents(card_text)
        document.addEventListener("selectionchange", memorizePosition)
    }

    displayProposal(proposal: Proposal) {
        console.log(proposal)
        const proposalAccBody = document.getElementById("proposalAccBody") as HTMLDivElement
        proposalAccBody.replaceChildren()
        if (proposal.description) {
            const description = document.createElement("p")
            proposalAccBody.append(description)
            description.innerText = proposal.description
        }
        const head = document.createElement("strong")
        proposalAccBody.append(head)
        head.innerText = "Modifications: "
        let length: number = 0
        for (const mod of proposal.modified) {
            length++
            const link = document.createElement("a")
            link.classList.add("mx-2")
            proposalAccBody.append(link)
            let page = undefined
            if (mod.type === "group") {
                page = "groups.html"
            }
            else {
                page = "index.html"
            }
            link.href = `/${page}?uid=${mod.uid}`
            link.innerHTML = mod.name
        }
        if (proposal.modified.length < 1) {
            const text = document.createElement("p")
            proposalAccBody.append(text)
            text.innerText = "No modifications yet"
        }
        // const contentContainer = document.getElementById("contentContainer") as HTMLDivElement
        // const acc = document.createElement("div")
        // acc.classList.add("accordion")
        // acc.id = "proposalAcc"
        // contentContainer.prepend(acc)
        // const acc_item = document.createElement("div")
        // acc_item.classList.add("accordion-item")
        // acc.append(acc_item)
        // const header = document.createElement("h2")
        // header.classList.add("accordion-header")
        // acc_item.append(header)
        // const button = document.createElement("button")
        // button.classList.add("accordion-button")
        // button.type = "button"
        // button.dataset.bsToggle = "collapse"
        // button.dataset.bsTarget = "#collapseOne"
        // button.ariaExpanded = "true"
        // button.innerText = `Proposal: ${proposal.name}`
        // header.append(button)
        // const collapse = document.createElement("div")
        // collapse.classList.add("accordion-collapse", "collapsed")
        // collapse.dataset.bsParent = "#proposalAcc"
        // acc_item.append(collapse)
        // const body = document.createElement("div")
        // body.classList.add("accordion-body")
        // body.innerText = proposal.description
        // collapse.append(body)
        // new bootstrap.Collapse(collapse)
    }
}

let CURRENT_P: HTMLParagraphElement | undefined = undefined
let CURRENT_NODE: Node | undefined = undefined
let OFFSET: number = 0

function displayEditTools(event: FocusEvent) {
    // runs when focusin on one of the rulings <p> element
    CURRENT_P = event.target as HTMLParagraphElement
    CURRENT_P.before(EDIT_CONTROLS)
}

function memorizePosition() {
    // save offset inside current <p> element
    const selection = window.getSelection()
    console.log(selection)
    if (selection.anchorNode.parentElement != CURRENT_P) { return }
    CURRENT_NODE = selection.anchorNode
    OFFSET = selection.anchorOffset
    console.log(OFFSET)
}

async function createAndAddLink(ev: MouseEvent, card: HTMLDivElement) {
    try {
        const response = await fetch("http://127.0.0.1:5000/reference", {
            method: "post",
            body: new FormData((ev.target as HTMLButtonElement).form)
        })
        if (!response.ok) {
            throw new Error((await response.json())[0])
        }
        const data = await response.json() as Reference
        addRulingReference(card, card.querySelector("div.card-footer"), data, true, true)
        await rulingSave(card)
    }
    catch (error) {
        console.log("Error posting reference", error.message)
        displayError(error.message)
    }
}

function addRulingReference(
    card: HTMLDivElement,
    links_div: HTMLDivElement,
    data: Reference,
    edit_mode: boolean,
    prepend: boolean) {
    let link_div = document.createElement("div")
    link_div.classList.add("card-link", "badge", "text-bg-secondary")
    let link = document.createElement("a")
    link.classList.add("text-decoration-none", "text-reset", "krcg-reference")
    link.href = data.url
    link.innerText = data.uid
    link.target = "blank"
    link_div.append(link)
    if (edit_mode) {
        let remove_button = document.createElement("button")
        remove_button.classList.add("badge", "btn", "ms-2", "text-bg-danger")
        remove_button.type = "button"
        remove_button.innerHTML = '<i class="bi-trash3"></i>'
        link_div.append(remove_button)
        remove_button.addEventListener("click", async () => {
            link_div.remove()
            await rulingSave(card)
        })
    }
    if (prepend) {
        links_div.prepend(link_div)
    }
    else {
        links_div.append(link_div)
    }
}

function insertDisc(clickEvent: Event) {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const newElement = document.createElement('span')
    newElement.classList.add("krcg-icon")
    newElement.contentEditable = "false"
    newElement.innerText = (clickEvent.target as HTMLSpanElement).innerText
    range.insertNode(newElement)
    selection.setPosition(newElement.nextSibling, 0)
}

function insertCard(item: any) {
    const newElement = document.createElement('span')
    newElement.classList.add("krcg-card")
    newElement.contentEditable = "false"
    newElement.innerText = item.label
    const range = new Range()
    range.setStart(CURRENT_NODE, OFFSET)
    range.setEnd(CURRENT_NODE, OFFSET)
    range.insertNode(newElement)
    addCardEvents(CURRENT_P)
    // SELECTION.setPosition(newElement.nextSibling, 0)
}

function debounce(func: Function, timeout = 300) {
    let timer: number | undefined = undefined;
    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(async () => { await func.apply(this, args); }, timeout);
    };
}

async function rulingSave(elem: HTMLDivElement) {
    console.log("in rulingSave", elem)
    if (!elem.classList.contains("krcg-ruling")) {
        console.log("Div is not a krcg-ruling", elem)
        return
    }
    let full_text: string = ""
    const text = elem.querySelector("p.card-text").childNodes
    for (const node of text) {
        if (node.nodeType == Node.TEXT_NODE) {
            full_text += node.nodeValue
        }
        else if (node.nodeType == Node.ELEMENT_NODE && node.nodeName == "SPAN") {
            let span_elem = node as HTMLSpanElement
            if (span_elem.classList.contains("krcg-icon")) {
                full_text += `[${ANKHA_SYMBOLS_REVERSE[span_elem.innerText]}]`
            }
            else if (span_elem.classList.contains("krcg-card")) {
                full_text += `{${span_elem.innerText}}`
            }
        }
    }
    for (const reference of elem.querySelectorAll("a.krcg-reference")) {
        full_text += ` [${(reference as HTMLAnchorElement).innerText}]`
    }
    if (full_text != elem.dataset.KrcgRulingText) {
        console.log("Updating ruling", elem.dataset.KrcgRulingUid, elem.dataset.KrcgRulingText, full_text)
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/ruling/${elem.dataset.KrcgRulingTargetUid}/${elem.dataset.KrcgRulingUid}`,
                {
                    method: "put",
                    body: JSON.stringify({ text: full_text })
                }
            )
            if (!response.ok) {
                throw new Error((await response.json())[0])
            }
            // TODO: unsure whether to use respone.text or full_text
            // might even update the whole card, but might cause concurrency issues
            const ruling = await response.json() as Ruling
            elem.dataset.KrcgRulingText = ruling.text
        }
        catch (error) {
            console.log("Error posting reference", error.message)
            displayError(error.message)
        }
    }
    else {
        console.log("Ruling unchanged", elem.dataset.KrcgRulingUid)
    }
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
        this.autocomplete = new Autocomplete(
            this.cardSearchInput,
            { "onSelectItem": (item: any) => this.state.reset({ uid: item.value }) }
        );
        this.state = new UrlState(async (data: any) => await this.displayCard(data))
    }

    async displayCard(card: BaseCard) {
        if (!card.uid) { return }
        try {
            const response = await fetch('http://127.0.0.1:5000/card/' + card.uid)
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }
            const data = await response.json() as Card
            this.processCardData(data)
        } catch (error) {
            console.log(error)
        }
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

interface Modification extends NID {
    type: string // one of: <group, card>
}

interface Proposal extends UID {
    name: string
    description: string
    rulings: { [key: string]: { [key: string]: Ruling } }
    references: { [key: string]: Reference }
    groups: { [key: string]: Group }
    modified: Modification[]
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

const ANKHA_SYMBOLS_REVERSE = Object.fromEntries(
    Object.entries(ANKHA_SYMBOLS).map(([k, v]) => [v, k])
)

let EDIT_CONTROLS = document.createElement("div") as HTMLDivElement
EDIT_CONTROLS.classList.add("container", "d-flex", "flex-row")
let DISC_DROPDOWN = document.createElement("div") as HTMLDivElement
EDIT_CONTROLS.append(DISC_DROPDOWN)
DISC_DROPDOWN.classList.add("btn-group")
let button = document.createElement("button")
button.classList.add("btn", "btn-secondary", "btn-sm", "dropdown-toggle")
button.type = "button"
button.dataset.bsToggle = "dropdown"
button.ariaExpanded = "false"
button.innerText = "Disc"
DISC_DROPDOWN.append(button)
let ul = document.createElement("ul")
ul.classList.add("dropdown-menu")
DISC_DROPDOWN.append(ul)
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

let CARD_SEARCH = document.createElement("form") as HTMLFormElement
EDIT_CONTROLS.append(CARD_SEARCH)
let input = document.createElement("input") as HTMLInputElement
CARD_SEARCH.append(input)
input.classList.add("form-control", "autocomplete", "mx-2")
input.placeholder = "Card name"
input.dataset.server = "http://127.0.0.1:5000/complete/"
input.dataset.liveServer = "true"
input.dataset.suggestionsThreshold = "3"
new Autocomplete(input,
    { "onSelectItem": (item: any) => insertCard(item) }
)
