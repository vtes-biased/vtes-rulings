//    Idea: 
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