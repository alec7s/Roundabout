//declare player class

//player colors: crimson, orangered, forestgreen
const colors = ['DC143C', 'FF4500', 'DAA520', '228B22', '0000CD'];
let numPlayers;
const players = [];

class Player {
    Player(name, number, color){
        name = this.name;
        number = this.number;
        color = colors[number - 1];
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
        nameLabel.classList.add('name');

        //create fields
        let nameField = document.createElement('input');
        nameField.setAttribute('type', 'text');
        nameField.setAttribute('id', id);
        nameField.setAttribute('name', name);
        nameField.classList.add('name');

        fieldContainer.appendChild(nameLabel);
        fieldContainer.appendChild(nameField);
        namesContainer.appendChild(fieldContainer);
    };
}

//get player info from form
const getPlayers = function(){
    const names = document.querySelectorAll('input').getElementsByClassName('name');
    console.log(names);
    /* for(let i = 0; i < names.length; i++){
        players.push(Player())
    } */
}

//retrieve round object from form 