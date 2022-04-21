//declare player class

//player colors: crimson, orangered, forestgreen

let numPlayers;
let currentRound;
const playersArray = [];
const colors = ['DC143C', 'FF4500', 'DAA520', '228B22', '0000CD'];

const Player = class {
    constructor(name, number) {
        this.name = name;
        this.number = number;
        
    }
    get color() {
        return colors[this.number - 1];
    };
}

const Round = class {
    constructor(numHoles, numPlayers, players){
        this.numHoles = numHoles;
        this.numPlayers = numPlayers;
        this.players = players;
    }
}

const populateScorecard = function(currentRound){
    //update name field
    document.getElementById('player-name').textContent = currentRound.players[0].name;
    console.log(currentRound.players[0].name);
    //update hole number
}

const startNewRound = function(){

    if(validateForm() === true){
        //get field values
        const numHoles = document.querySelector('input[name="num-holes"]:checked').value;
        const numPlayers = document.getElementById('num-players').value;
        const players = [];

        const nameFields = document.querySelectorAll('input.name');
        for(let i = 0; i < nameFields.length; i++){
            players.push(new Player(nameFields[i].value, i + 1));
        } 

        //create Round class with field values
        currentRound = new Round(numHoles, numPlayers, players);

        populateScorecard(currentRound);
    }
}

const togglePlayerNameFields = function(){

    //retrieve number of players
    numPlayers = document.getElementById('num-players').value;

    //create a player name field for the number of players specified
    let namesContainer = document.querySelector('#player-names');

    //ensure nothing is duplicated
    if(namesContainer !== null){
        namesContainer.remove();
    }

    namesContainer = document.createElement('div');
    namesContainer.setAttribute('id', 'player-names');
    const rightColumn = document.querySelector('#right-column');
    rightColumn.appendChild(namesContainer);

    const nameFieldsLabel = document.createElement('p');
    nameFieldsLabel.textContent = 'Who\'s playing?';
    namesContainer.appendChild(nameFieldsLabel);
    

    for(let i = 0; i < numPlayers; i++){
        let playerNum = i + 1;
        let id = `player-${playerNum}-name`;
        let name = `Player ${playerNum} name`;

        //create field container
        const fieldContainer = document.createElement('div');
        fieldContainer.classList.add('name-field');

        //create labels
        let nameLabel = document.createElement('label');
        nameLabel.textContent = `Player ${playerNum}:`
        nameLabel.setAttribute('for', id);
        nameLabel.setAttribute('name', name);
        //nameLabel.classList.add('name');

        //create fields
        let nameField = document.createElement('input');
        nameField.required = true;
        nameField.setAttribute('type', 'text');
        nameField.setAttribute('id', id);
        nameField.setAttribute('name', name);
        nameField.setAttribute('required', '');
        nameField.setAttribute('minlength', '1');
        nameField.setAttribute('maxlength', '35');
        nameField.setAttribute('pattern', '[a-zA-Z]');
        nameField.classList.add('name');

        fieldContainer.appendChild(nameLabel);
        fieldContainer.appendChild(nameField);
        namesContainer.appendChild(fieldContainer);
    };
}

const validateForm = function () {

    //num-holes
    if(!document.getElementById('9-hole').checked && !document.getElementById('18-hole').checked){
        alert('Please select the number of holes.');
        return false;
    }
    
    //num-players
    if(numPlayersValue = document.getElementById('num-players').value === '--'){
        alert('Please select the number of players.')
        return false;
    }

    //names
    let nameFields = Array.from(document.getElementsByClassName('name'));
    nameFields.forEach(nameField => {
        if(nameField.checkValidity() === false) {
            alert('Enter a valid name.');
            return false;
        }
    });

    return true;
}