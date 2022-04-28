let numPlayers;
let currentRound;
let playersArray = [];

// models:
class Player {
    constructor(name, number) {
        this.name = name;
        this.number = number;
    }
}

class Round {
    constructor(numHoles, numPlayers, players) {
        this.numHoles = numHoles;
        this.numPlayers = numPlayers;
        this.players = players;
    }
}

function populateScorecard(currentRound) {
    // update name field
    document.getElementById('player-name').textContent = currentRound.players[0].name;
}

function isFormInputValid() {
    // get input fields from form
    const text_nameFields = Array.from(document.getElementsByClassName('name'));
    const dropdown_numPlayers = document.getElementById('num-players');
    const radio_9Hole = document.getElementById('9-hole');
    const radio_18Hole = document.getElementById('18-hole');
    
    if(!radio_9Hole.checked && !radio_18Hole.checked) {
        alert('Please select the number of holes.');
        return false;
    }
    
    if(dropdown_numPlayers.value === '--') {
        alert('Please select the number of players.')
        return false;
    }
    
    text_nameFields.forEach(nameField => {
        if(nameField.checkValidity() === false) {
            alert('Enter a valid name.');
            return false;
        }
    });

    // disable form
    radio_9Hole.setAttribute('disabled','true');
    radio_18Hole.setAttribute('disabled', 'true');
    dropdown_numPlayers.setAttribute('disabled', 'true');
    text_nameFields.forEach(nameField => nameField.setAttribute('disabled', 'true'));

    return true;
}

function startNewRound() {

    if(isFormInputValid()) {
        // get field values
        const nameFields = document.querySelectorAll('input.name');
        const numHoles = document.querySelector('input[name="num-holes"]:checked').value;
        const numPlayers = document.getElementById('num-players').value;
        let players = [];

        for(let i = 0; i < nameFields.length; i++) {
            players.push(new Player(nameFields[i].value, i + 1));
        } 

        // create Round class with field values
        currentRound = new Round(numHoles, numPlayers, players);

        populateScorecard(currentRound);
    }
}

function togglePlayerNameFields() {
    // create a player name field for the number of players specified
    let namesContainer = document.querySelector('#player-names');

    // retrieve number of players
    numPlayers = document.getElementById('num-players').value;

    // ensure nothing is duplicated
    if(namesContainer !== null) namesContainer.remove();

    const rightColumn = document.querySelector('#right-column');
    namesContainer = document.createElement('div');
    namesContainer.setAttribute('id', 'player-names');
    rightColumn.appendChild(namesContainer);

    const nameFieldsLabel = document.createElement('p');
    nameFieldsLabel.textContent = 'Who\'s playing?';
    namesContainer.appendChild(nameFieldsLabel);

    for(let i = 0; i < numPlayers; i++) {
        let playerNum = i + 1;
        let id = `player-${playerNum}-name`;
        let name = `Player ${playerNum} name`;

        // create field container
        const fieldContainer = document.createElement('div');
        fieldContainer.classList.add('name-field');

        // create labels
        let nameLabel = document.createElement('label');
        nameLabel.textContent = `Player ${playerNum}:`
        nameLabel.setAttribute('for', id);
        nameLabel.setAttribute('name', name);
        // nameLabel.classList.add('name');

        // create fields
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

