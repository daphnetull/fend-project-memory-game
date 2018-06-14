/*
 * Create a list that holds all of your cards
 */

let cards = document.querySelectorAll('.card');
let openCardList = []; 
let classOfCards = [];
let matchedCardsList = [];

/*
 * Secondary set of lists that holds all of the class names for each card - used for the shuffle
 */

let listOfIcons = [];
let oldClassNames = [];
let newClassNames = [];

/*
 * Variable to store how many moves the user has taken
 */

let movesTaken = 0;

/*
 * Variable to store the unordered lists of stars - will create a node of 2 items - 1 for stars in modal window, 1 for regular stars
  */ 

const stars = document.querySelectorAll('.stars');

/*
 * Variable to store the span element that displays to the user number of moves taken by the user
 */

const movesDisplay = document.querySelectorAll('.moves');

/*
 * Variable to store the reset button
 */ 

const resetButton = document.querySelectorAll('.restart');

/*
 * Variable to store the modal window & its associated parts
 */

const modalWindow = document.querySelectorAll('.modal');
const modalWin = document.querySelector('.winning-modal');
let modalTime = document.querySelector('.user-time');

/* 
 * Timer variables
 */

let timerDisplay = document.querySelector('.timer-label');
let timerVar;
let seconds = 0;
let minutes = 0;
let totalTime;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}  

function shuffleCards(){
    listOfIcons = document.querySelectorAll('.card i');
    oldClassNames = [];
    newClassNames = [];
    listOfIcons.forEach(function(icon){
        oldClassNames.push(icon.classList.item(1));
    })
    newClassNames = oldClassNames.slice();
    newClassNames = shuffle(newClassNames);
    listOfIcons.forEach(function(icon, index){
        icon.classList.replace(oldClassNames[index], newClassNames[index]);
    }) 
}

shuffleCards(); // this activates the shuffle once the page loads.  it will eventually be tied to a start button

/*
 * Timer function
*/

function timer(){
    if (seconds === 60){
        seconds = 0;
        minutes = minutes + 1;
    }
    if (seconds < 10 && minutes < 10) {
        totalTime = "0" + minutes + ":0" + seconds;
    }
    else if (seconds < 10 && minutes >= 10){
        totaTime = minutes + ":0" + seconds;
    }
    else if (minutes < 10) {
        totalTime = "0" + minutes + ":" + seconds;
    }
    else {
        totalTime = minutes + ":" + seconds;
    }   
    timerDisplay.innerHTML = totalTime;
    seconds = seconds + 1;
}

/*
 * When user clicks on a card, it's added to two different lists in this function.  One list for the card, and one list for the class name
 */

function addingToLists(card){
    if (!card.classList.contains('match')){ 
        openCardList.push(card);  
        classOfCards.push(card.querySelector('i').className);
        if (openCardList[0] === openCardList[1]){
            openCardList.pop();
            classOfCards.pop();
        }
    }
};

/*
 * This function is called if the user wins the game
 */

function gameWin(){
    clearInterval(timerVar);
    modalWin.classList.remove('display-none');
    modalTime.innerHTML = seconds + " seconds and " + minutes + " minutes."
}

/*
 * This function determines if the cards match, and if so, what classes are added to them
 */

function doCardsMatch(card){
    if (classOfCards[0] === classOfCards[1]){
        openCardList.forEach(function(item){
            item.classList.remove('show', 'open');
            item.classList.add('match');
            matchedCardsList.push(item);
        })
        openCardList = [];
        classOfCards = [];
    }
    else cardsDontMatch(card);
    if (matchedCardsList.length === 16){
        console.log("win");
        gameWin();
    }
}

/*
 * This function is called if the cards don't match.  The 'open' and 'show' classes are removed after 2 seconds
 * to give the user time to study them
 */

function cardsDontMatch(card){
    setTimeout(function(){
        openCardList.forEach(function(item){
            item.classList.remove('open', 'show');
        })
        openCardList = [];
        classOfCards = [];
        },
        2000);
}

/*
 * This function simply increments the moves counter by whenever 2 cards are selected, regardless of whether they match or not
 */

function moveCounter(){
    movesTaken++;
    updateMovesDisplay(movesTaken);
    console.log(movesTaken);
    if (movesTaken >= 8){
        starRating(movesTaken);
    }
}

/*
 * This function displays to the user how many moves they have taken
 */

function updateMovesDisplay(movesTaken){
    movesDisplay.forEach(function(eachMovesDisplay){   
        eachMovesDisplay.textContent = movesTaken;
    })
}

/*
 * This function updates the "star" rating depending on how many moves the user has taken.  It also puts them back if user resets
 */

 function starRating(movesTaken){
    if (movesTaken === 0){ 
        stars.forEach(function(star){
            star.lastElementChild.style.visibility = "visible"; // puts stars back if user resets
            star.firstElementChild.style.visibility = "visible";
        })
    }
    if (movesTaken === 9){
        stars.forEach(function(star){
            star.lastElementChild.style.visibility = "hidden"; // removes a star if user has less than perfect game
        })
    }
    if (movesTaken > 16){
        stars.forEach(function(star){
            star.firstElementChild.style.visibility = "hidden"; // removes another star if user exceeds 16 moves
        })
    }
}

/*
 * This forEach loop sets up an event listener for each of the cards
 */

cards.forEach(function(card){   
    card.addEventListener('click', function(event){
        addingToLists(card);  // adding clicked cards to arrays
        if (openCardList.length <= 2){
            this.classList.add('open', 'show');
            if (openCardList.length === 2){
                moveCounter();
                doCardsMatch(card);
            }
        }
    })
})

/*
 *  Event listener for when the user clicks on the reset button
 */ 

resetButton.forEach(function(reset){
    reset.addEventListener('click', function(event){        
        totalTime = 0;
        seconds = 0;
        minutes = 0;
        clearInterval(timerVar);
        timerVar = setInterval(timer, 1000);
        modalWindow.forEach(function(window){
            window.classList.add('display-none');
        })        
        matchedCardsList = [];
        movesTaken = 0;
        updateMovesDisplay(movesTaken);
        starRating(movesTaken);
        console.log("reset");
        cards.forEach(function(card){
            if (card.classList.contains('match') || card.classList.contains('open')){
                card.classList.remove('match', 'open', 'show');
            };
        })
        shuffleCards();
    })
})
