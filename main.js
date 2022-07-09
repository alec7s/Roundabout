let currentRound = null;
let scorecard = null;

/*
getElementsBy function takes any number of attribute objects and returns the matching elements based off of the properties of the properties of the attributes objects' parameters. 

Properties of the attribute object include type, name, and parentElement. The Type property can either be id, class, or value. The Name property is the id, class, or value name (e.g., 'form-container'). The parentElement property is only required when attributeType is value.
*/
function getElementsBy(...attributes) {
    let elements = [];
    attributes.forEach(attributes => {
        let element;
        switch(attributes.type) {
            case 'id':
                element = document.getElementById(attributes.name);
                break;
            case 'class':
                let classElements = Array.from(document.getElementsByClassName(attributes.name));
                classElements.forEach(classElement => elements.push(classElement));
                break;
            case 'value':
                element = document.querySelector(`${attributes.parentElement}[value=${attributes.name}]`);
                break;
            default:
                console.log('switch case defaulted');
                break;
        }
        if(attributes.type !== 'class') elements.push(element);
    });
    return elements;
}

// applies element attributes/properties to elements at corresponding indexes
function setAttributes([...elements], [...attributes], [...properties]) {
    elements.forEach((element, index) => {
        (attributes.length === 1) ? element.setAttribute(attributes[0], properties[0]) : element.setAttribute(attributes[index], properties[index]);
    });
}

class Player {

    constructor(name, number, numHoles) {
        this.name = name;
        this.number = number;
        this.scores = new Array(numHoles).fill(0);
    }
}

class Round {

    constructor(numHoles, numPlayers, players) {
        this.numHoles = numHoles;
        this.numPlayers = numPlayers;
        this.players = players;
    }
}

class Form {

    static fields = {
        numPlayers: null,
        radio9Hole: null,
        radio18Hole: null,
        names: null,
    }

    static setFields() {
        this.fields.numPlayers = document.getElementById('num-players');
        this.fields.radio9Hole = document.getElementById('9-hole');
        this.fields.radio18Hole = document.getElementById('18-hole');

        const names = Array.from(document.getElementsByClassName('name'));
        if(names !== null) this.fields.names = names;
    };

    static getNumHoles() {
        return Number((!this.fields.radio9Hole.checked) ? this.fields.radio18Hole.value : this.fields.radio9Hole.value);
    }

/*
    Create the text input fields for player names. The number of fields will match the number of selected players and will automatically update when the selected number of players changes.
*/
    static togglePlayerNameFields() {
        Form.setFields();

        // create a player name field for the number of players specified
        let namesContainer = document.querySelector('#player-names');
    
        // ensure nothing is duplicated
        if(namesContainer !== null) namesContainer.remove();
    
        //TODO: consider adding new element object/function
        const rightColumn = document.querySelector('#right-column');
        namesContainer = document.createElement('div');
        namesContainer.setAttribute('id', 'player-names');
        rightColumn.appendChild(namesContainer);
    
        const nameFieldsLabel = document.createElement('p');
        nameFieldsLabel.textContent = 'Who\'s playing?';
        namesContainer.appendChild(nameFieldsLabel);
    
        for(let i = 0; i < Form.fields.numPlayers.value; i++) {
            let playerNum = i + 1;
            let id = `player-${playerNum}-name`;
            let name = `Player ${playerNum} name`;
    
            // create field container
            const fieldContainer = document.createElement('div');
            fieldContainer.classList.add('name-field');
    
            // create labels
            const nameLabel = document.createElement('label');
            nameLabel.textContent = `Player ${playerNum}:`
            setAttributes([nameLabel], ['for', 'name'], [id, name]);
    
            // create fields
            const nameField = document.createElement('input');
            nameField.required = true;
            setAttributes([nameField], ['type', 'id', 'name', 'required', 'minlength', 'maxlength', 'pattern'], ['text', id, name, '', '1', '35', '[a-zA-Z]']);
            nameField.classList.add('name');
    
            fieldContainer.appendChild(nameLabel);
            fieldContainer.appendChild(nameField);
            namesContainer.appendChild(fieldContainer);
        };
    }

    static inputIsValid() {

        Form.setFields();

        if(!Form.fields.radio9Hole.checked && !Form.fields.radio18Hole.checked) {
            alert('Please select the number of holes.');
            return false;
        }
        
        if(Form.fields.numPlayers.value === '--') {
            alert('Please select the number of players.')
            return false;
        }
        
        for(let i = 0; i < Form.fields.names.length; i++){
            if(Form.fields.names[i].checkValidity() === false) {
                alert('Enter a valid name.');
                return false;
            }
        }

        return true;
    }

//  Gray out form input to prevent changes to entries
    static disable() {
        setAttributes(
            getElementsBy(
                {type: 'class', name: 'name'},
                {type: 'id', name: 'num-players'},
                {type: 'id', name: '9-hole'},
                {type: 'id', name: '18-hole'},
                {type: 'value', name: 'Start', parentElement: 'input'}), 
                // modify elements attribute:
                ['disabled'], 
                // change attribute value:
                ['true']);
            document.getElementById('start-btn').setAttribute('background-color', '#808080');
    }

//  Use user input from form to initialize Round and scorecard classes
    static initNewRound() {
        let players = [];
        
        Form.fields.names.forEach((name, i) => {
            let player = new Player(Form.fields.names[i].value, i + 1, Form.getNumHoles());
            players.push(player);
        });
        
        currentRound = new Round(Form.getNumHoles(), Form.fields.numPlayers.value, players);
        scorecard = new Scorecard(currentRound.players[0].name, currentRound.players[0].scores[0], 1);
    }

    static processEvent(value) {
        switch(value){
            case 'Names':
                Form.togglePlayerNameFields();
                break;
            case 'Start':
                if(Form.inputIsValid()) {
                    Form.disable();
                    Form.initNewRound();
                    scorecard.setLabels();
                    scorecard.enableScorecard();
                }
                break;
            default: 
                break;
        }
    }
}

class Scorecard {

    constructor(playerName, score, holeNum) {
        this.playerIndex = 0;
        this.playerName = playerName;
        this.holeNum = holeNum;
        this.score = score;
        this.setLabels();
    }

    enableScorecard() {
        document.getElementById('scorecard-container').style.visibility = 'visible';
    }

    setScore(action) {
        //update score
        action === 'Add' ? this.score++ : (this.score > 0 ? this.score-- : this.score = 0);

        //save score
        currentRound.players[this.playerIndex].scores[this.holeNum - 1] = this.score;
    }

    getLabels() {
        //name
        this.playerName = currentRound.players[this.playerIndex].name;

        //score
        this.score = currentRound.players[this.playerIndex].scores[this.holeNum - 1];
        console.log(`saved scores: ${currentRound.players[this.playerIndex].scores}`);
    }

    setLabels() {
        let scoreString = String(this.score).padStart(2,'0');

        document.querySelector('#scorecard-header p').textContent = `Hole ${this.holeNum}`;
        document.querySelector('#player-name').innerHTML = this.playerName;
        document.querySelector('#score').textContent = scoreString;
    }

    getResults() {
        // get each player's final score
        this.finalScores = currentRound.players.map(player => player.scores.reduce((previousScore, nextScore) => previousScore + nextScore)); 

        // get winning score
        let results = {
            score: this.finalScores.reduce(function(a, b) {
                return Math.min(a, b);
            }),
            scoreIndexes: [],
            winningNames: [],
            isTie: function() {
                return this.winningNames.length > 1
            },
            winningNamesFormatted: '',
        }
        
        //get score indexes results property
        this.finalScores.forEach((score, index) => {if(score === results.score) results.scoreIndexes.push(index)});

        //get winning names results property
        results.scoreIndexes.forEach(index => results.winningNames.push(currentRound.players[index].name));

        if(results.isTie()) {
            results.winningNames.forEach(name => results.winningNamesFormatted += `${name}\n`);
        } else {
            results.winningNamesFormatted = results.winningNames[0];
        }

        return results;
    }

    next() {
        let conditions = {
            isLastPlayer: this.playerIndex + 1 === currentRound.players.length,
            isNotLastHole: this.holeNum + 1 <= currentRound.numHoles,
        };
        //increase hole number and restart player scoring if currently on last player and NOT on last hole
        if(conditions.isLastPlayer && conditions.isNotLastHole) {
            this.playerIndex = 0;
            this.holeNum++;
        //go to next player if this is not the last hole and not the last player
        } else if(!conditions.isLastPlayer) {
            this.playerIndex++;
        }

        //make finish button visible if last player and last hole
        if(!conditions.isNotLastHole && conditions.isLastPlayer) {
            document.getElementsByClassName('finish-btn')[0].style.visibility = 'visible';
        }
    }

    previous() {
        let conditions = {
            isFirstPlayer: this.playerIndex === 0,
            isFirstHole: this.holeNum === 1,
        }

        if(conditions.isFirstPlayer && !conditions.isFirstHole) {
            this.playerIndex = currentRound.players.length - 1;
            this.holeNum--;
            document.getElementsByClassName('finish-btn')[0].style.visibility = 'hidden';
        } else if(!conditions.isFirstPlayer) {
            this.playerIndex--;
        }
    }

    displayWinner() {
        this.results = this.getResults();
        this.message = {

            names: this.results.winningNamesFormatted,
            text: (this.results.isTie()) ? 
            `The winners are:\n${this.results.winningNamesFormatted}...with scores of ${this.results.score}\n\nPlay again?` :
            `The winner is ${this.results.winningNamesFormatted} with a score of ${this.results.score}!\n\nPlay again?`,
        }

        return window.confirm(this.message.text);
    }

    processEvent(value) {
        switch(value){
            case 'Add':
                this.setScore('Add');
                break;
            case 'Subtract':
                this.setScore('Subtract');
                break;
            case 'Next':
                this.next();
                break;
            case 'Previous':
                this.previous();
                break;
            case 'Finish':
                if(this.displayWinner()) window.location.reload();
                break;
            default: 
                break;
        }
        this.getLabels();
        this.setLabels();
    }
}