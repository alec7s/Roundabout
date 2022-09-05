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
                //console.log('switch case defaulted');
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
        numHoles: null,
        names: null,
    }
    //set numPlayers, numHoles, and names properties of fields objects
    static setFields(id = null) {
        this.fields.numPlayers = document.getElementById('num-players');
        if(id !== null) this.fields.numHoles = document.getElementById(id);

        const names = Array.from(document.getElementsByClassName('name'));
        if(names !== null) this.fields.names = names;
    };

    // add or remove styling based on which holes button is clicked
    static styleSelectedHolesBtn(id) {
        Form.setFields(id);
        let btnIds = ['9-hole', '18-hole'];
        //change selected button style
        document.getElementById(id).classList.add('hole-btn-selected');
        //change unselected button style
        document.getElementById(btnIds.filter(btnId => btnId !== id)[0]).classList.remove('hole-btn-selected');
    }
    // get the number of holes for the round selected in the form
    static getNumHoles() {
        //return Number((!this.fields.btn9Hole.checked) ? this.fields.btn18Hole.value : this.fields.btn9Hole.value);
        return Number(this.fields.numHoles.value);
    }

    /*
        Create the text input fields for player names. The number of fields will match the number of selected players and will automatically update when the selected number of players changes.
    */
    static togglePlayerNameFields() {
        Form.setFields();
        //check if container for names fields already exists and remove it if it does to avoid duplication of fields
        let namesContainer = document.querySelector('#player-names');
        if(namesContainer !== null) namesContainer.remove();
    
        //select parent of namesContainer. Names container to be appended to parent.
        const rightColumn = document.querySelector('#right-column');

        //create parent container for names fields and append to parent div (rightColumn)
        namesContainer = document.createElement('div');
        namesContainer.setAttribute('id', 'player-names');
        rightColumn.appendChild(namesContainer);
    
        //create text label for names fields and append to parent (namesContainer)
        const nameFieldsLabel = document.createElement('p');
        nameFieldsLabel.textContent = 'Who\'s playing?';
        namesContainer.appendChild(nameFieldsLabel);
    
        for(let i = 0; i < Form.fields.numPlayers.value; i++) {
            //set the playerNum, id and name for each player
            const playerNum = i + 1;
            const id = `player-${playerNum}-name`;
            const name = `Player ${playerNum} name`;
    
            // create name field container and add styling
            const fieldContainer = document.createElement('div');
            fieldContainer.classList.add('name-field');
    
            // create individual field labels for each player #
            const nameLabel = document.createElement('label');
            nameLabel.textContent = `Player ${playerNum}`;
            setAttributes([nameLabel], ['for', 'name'], [id, name]);
    
            // create text input fields for each player
            const nameField = document.createElement('input');
            //add validation and other attributes to input field
            setAttributes([nameField], ['type', 'id', 'name', 'required'], ['text', id, name, '']);
            nameField.required = true;
            nameField.maxLength = '10';
            nameField.minLength = '1';
            nameField.classList.add('name');
    
            //append label, field, and container to parent
            fieldContainer.appendChild(nameLabel);
            fieldContainer.appendChild(nameField);
            namesContainer.appendChild(fieldContainer);
        };
    }

    static inputIsValid() {

        Form.setFields();

        if(Form.fields.numHoles === null) {
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
            //select form elements to disable:
            getElementsBy(
                {type: 'class', name: 'name'},
                {type: 'id', name: 'num-players'},
                {type: 'id', name: '9-hole'},
                {type: 'id', name: '18-hole'},
                {type: 'value', name: 'Start', parentElement: 'input'}
            ), 
            // modify elements attribute:
            ['disabled'], 
            // change attribute value:
            ['true']
        );
            //modify btn color to appear disabled
            document.getElementById('start-btn').setAttribute('style', 'background-color: #D22779');
    }

    //  Use user input from form to initialize Round and scorecard classes
    static initNewRound() {

        //console.log(Form.fields.numHoles.value);
        let players = [];
        
        //initialize new player classes for each player entered in form and add each to players array
        Form.fields.names.forEach((name, i) => {
            let player = new Player(name.value, i + 1, Form.getNumHoles());
            players.push(player);
        });
        //initialize new round and scorecard classes using form values and players array
        currentRound = new Round(Form.getNumHoles(), Form.fields.numPlayers.value, players);
        scorecard = new Scorecard(currentRound.players[0].name, currentRound.players[0].scores[0], 1);
        //shift view to scorecard
        window.location.hash = '#scorecard-header';
    }

    static processEvent(value, id = null) {
        switch(value){
            case 'Holes':
                Form.styleSelectedHolesBtn(id);
                break;
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

    createScoreTable(dialog) {
        //create score table that lists scores for each player and hole
        const table = document.createElement('table');
        table.setAttribute('style', 'color: #612897');
        const tbody = document.createElement('tbody'); 

        //create hole number headers
        tbody.scoreLabels = tbody.insertRow();
        for(let i = 0; i <= currentRound.numHoles; i++) {
            const cell = tbody.scoreLabels.insertCell();
            cell.classList.add('card-label');
            if(i !== 0) cell.textContent = i;
        }

        //add player names
        currentRound.players.forEach(player => {
            const playerRow = tbody.insertRow();
            const playerName = playerRow.insertCell();
            playerName.classList.add('card-label');
            playerName.textContent = player.name;

            //add scores for each player
            player.scores.forEach(score => {
                const holeScore = playerRow.insertCell();
                holeScore.textContent = score;
            })
        });
        table.appendChild(tbody);
        dialog.appendChild(table);
    }

    openScoreTableDialog() {
        const dialog = document.createElement('dialog');

        //dialog attributes:
        dialog.classList.add('dialog');

        //dialog body:
        this.createScoreTable(dialog);

        //close btn:
        dialog.closeBtnContainer = document.createElement('div');
        dialog.closeBtnContainer.classList.add('close-btn-container');
        
        dialog.closeBtn = document.createElement('button');
        dialog.closeBtn.classList.add('gray-btn');
        dialog.closeBtn.setAttribute('type', 'button');
        dialog.closeBtn.addEventListener('click', ()=>{
            dialog.remove();
        });
        dialog.closeBtn.textContent = 'Close';

        dialog.closeBtnContainer.appendChild(dialog.closeBtn);
        dialog.appendChild(dialog.closeBtnContainer);
        document.getElementById('scorecard-header').appendChild(dialog);

        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            dialog.hidden = 'true';
        }   
        
    }

    setScore(action) {
        action === 'Add' ? 
        (
            //increase score if action is Add and score is less than 99
            this.score < 99 ? 
                this.score++ : 
                this.score
        ) : 
        (
            //decrease score if action is subtract and score is grerater than 0
            this.score > 0 ? 
                this.score-- :
                this.score = 0
        );

        //update player class inside round class to save score for player
        currentRound.players[this.playerIndex].scores[this.holeNum - 1] = this.score;
    }

    getLabels() {
        this.playerName = currentRound.players[this.playerIndex].name;

        this.score = currentRound.players[this.playerIndex].scores[this.holeNum - 1];
    }

    setLabels() {
        let scoreString = String(this.score).padStart(2,'0');

        document.querySelector('#scorecard-header p').textContent = `Hole ${this.holeNum}`;
        document.querySelector('#player-name').innerHTML = this.playerName;
        document.querySelector('#score').textContent = scoreString;
    }

    getResults() {
        // get each player's final score by summing scores for each hole
        this.finalScores = currentRound.players.map(player => player.scores.reduce((previousScore, nextScore) => previousScore + nextScore)); 

        // create results object
        const results = {
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
        
        //set scoreIndexes of winning scores in results object
        this.finalScores.forEach((score, index) => {if(score === results.score) results.scoreIndexes.push(index)});

        //get winning names for each winning scoreIndex
        results.scoreIndexes.forEach(index => results.winningNames.push(currentRound.players[index].name));

        if(results.isTie()) {
            //if round result is a tie, then format names as list in string value
            results.winningNames.forEach(name => results.winningNamesFormatted += `${name}\n`);
        } else {
            //if round is not a tie, then only include a single name in the string value
            results.winningNamesFormatted = results.winningNames[0];
        }

        return results;
    }

    next() {
        //create conditions object and set conditions properties
        const conditions = {
            /* isLastPlayer: function() {
                return this.playerIndex + 1 === currentRound.players.length;
            },
            isNotLastHole: function() {
                return this.holeNum + 1 <= currentRound.numHoles;
            },
            isLastHole: function() {
                return this.holeNum === currentRound.numHoles;
            } */
        };
        function setConditions (playerIndex, holeNum) {
            conditions.isLastPlayer = playerIndex + 1 === currentRound.players.length;
            conditions.isNotLastHole = holeNum + 1 <= currentRound.numHoles;
            conditions.isLastHole = holeNum === currentRound.numHoles;
        }
        
        setConditions(this.playerIndex, this.holeNum);
        //increase hole number and restart player scoring if currently on last player and NOT on last hole
        if(conditions.isLastPlayer && conditions.isNotLastHole) {
            this.playerIndex = 0;
            this.holeNum++;
        //go to next player if this is not the last hole and not the last player
        } else if(!conditions.isLastPlayer) {
            this.playerIndex++;
        }

        setConditions(this.playerIndex, this.holeNum);
        //make finish button visible if last player and last hole
        if(conditions.isLastHole && conditions.isLastPlayer) {
            document.getElementById('finish-btn').style.visibility = 'visible';
        }
    }

    previous() {
        document.getElementById('finish-btn').style.visibility = 'hidden';
        const conditions = {
            isFirstPlayer: this.playerIndex === 0,
            isFirstHole: this.holeNum === 1,
        }

        if(conditions.isFirstPlayer && !conditions.isFirstHole) {
            this.playerIndex = currentRound.players.length - 1;
            this.holeNum--;
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

    processEvent(value, id) {
        switch(value){
            case 'Add':
                this.setScore('Add', id);
                break;
            case 'Subtract':
                this.setScore('Subtract', id);
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
            case 'Card':
                this.openScoreTableDialog();
                break;
            default: 
                break;
        }
        this.getLabels();
        this.setLabels();
    }
}