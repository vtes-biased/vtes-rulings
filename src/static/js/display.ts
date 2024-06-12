//    Idea: 
//    search bar for looking at cards using API https://api.krcg.org/complete/{user input from search bar}
//    from there, user can click on one of the names generated from that list for full description of the rulings related to the specific card
//    this page will also have a text box allowing the user to submit a ruling via the "https://api.krcg.org/submit-ruling/{card from list}
//    and another one for the link to official ruling from a rules director. 

const cardSearchInput = document.querySelector('#cardSearch') as HTMLInputElement;