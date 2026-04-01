
let cards = [];
let message = "";
let messageEl = document.getElementById("message_el");
let sumEl = document.getElementById("sum-el");
let cardEl = document.querySelector("#card-el");
let hasBlackJack = false;
let isAlive = false;
let player = {
    name: "Jameel Ur Rehman",
    chips : 145
}
let playerEl = document.querySelector("#player-el");
playerEl.textContent = player.name + ":$ " + player.chips;
function getRandomCard(){
   let randomNum = Math.floor(Math.random() * 13) + 1;
   if(randomNum > 10){
    return 10;
   }
   else if(randomNum === 1){
    return 11;
   }
   else{
    return randomNum;
   }
}
console.log(cards);

function startTheGame(){
    isAlive = true;
    let card1 = getRandomCard();
    let card2 = getRandomCard();
    cards = [card1, card2];
    sum = card1 + card2;
    renderTheGame();
}
function renderTheGame(){
    cardEl.textContent = "Cards: ";
    for(let i = 0; i < cards.length; i++){
        cardEl.textContent += cards[i] + " ";
    }
    if(sum <= 20){
        message = ("Do you want to draw new card");   
      
    }
    else if(sum === 21){
    message = ("You have got!");
    hasBlackJack = true;
  
}
else{
    message = ("You are out of the game!")
 
    isAlive = false;
}
 messageEl.textContent = message;
 sumEl.textContent ="Sum: " + sum;

}
function newCard(){
   if(sum < 21 && isAlive === true){
     let card3 = getRandomCard();
    sum += card3;
    cards.push(card3)
    renderTheGame();
   }
}