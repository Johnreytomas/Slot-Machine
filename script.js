const ICONS = [
    'apple', 'apricot', 'banana', 'big_win', 'cherry', 'grapes', 'lemon', 'lucky_seven', 'orange', 'pear', 'strawberry', 'watermelon',
];

/**
 * @type {number} The minimum spin time in seconds
 */
const BASE_SPINNING_DURATION = 2.7;

/**
 * @type {number} The additional duration to the base duration for each row (in seconds).
 * It makes the typical effect that the first reel ends, then the second, and so on...
 */
const COLUMN_SPINNING_DURATION = 0.3;

// Initialize score and tokens
let playerScore = 0;
let tokens = 0; // Initially, tokens are 0
let spinsRemaining = 0; // Tracks remaining spins

var cols;

window.addEventListener('DOMContentLoaded', function(event) {
    cols = document.querySelectorAll('.col');
    setInitialItems();
    updateScoreBoard();
});

function setInitialItems() {
    let baseItemAmount = 40;

    for (let i = 0; i < cols.length; ++i) {
        let col = cols[i];
        let amountOfItems = baseItemAmount + (i * 3);
        let elms = '';
        let firstThreeElms = '';

        for (let x = 0; x < amountOfItems; x++) {
            let icon = getRandomIcon();
            let item = '<div class="icon" data-item="' + icon + '"><img src="items/' + icon + '.png"></div>';
            elms += item;

            if (x < 3) firstThreeElms += item;
        }
        col.innerHTML = elms + firstThreeElms;
    }
}

function dropTokens() {
    let tokenInput = document.getElementById('token-input');
    let tokensToDrop = parseInt(tokenInput.value);

    if (tokensToDrop <= 0) {
        alert('Please enter a valid number of tokens.');
        return;
    }

    tokens += tokensToDrop; // Add tokens to player's total
    spinsRemaining = tokens; // Set the number of spins based on the tokens dropped
    updateScoreBoard();
}

function spin(elem) {
    if (spinsRemaining <= 0) {
        alert('You have no spins left! Drop tokens first.');
        return;
    }

    spinsRemaining--; // Decrement the number of spins remaining
    tokens--; // Deduct one token for each spin
    updateScoreBoard();

    let duration = BASE_SPINNING_DURATION + randomDuration();
    
    for (let col of cols) { 
        duration += COLUMN_SPINNING_DURATION + randomDuration();
        col.style.animationDuration = duration + "s";
    }

    elem.setAttribute('disabled', true);
    document.getElementById('container').classList.add('spinning');

    window.setTimeout(setResult, BASE_SPINNING_DURATION * 1000 / 2);

    window.setTimeout(function () {
        document.getElementById('container').classList.remove('spinning');
        elem.removeAttribute('disabled');
    }.bind(elem), duration * 1000);
}

function setResult() {
    let resultIcons = [];

    for (let col of cols) {
        let results = [
            getRandomIcon(),
            getRandomIcon(),
            getRandomIcon()
        ];

        let icons = col.querySelectorAll('.icon img');
        for (let x = 0; x < 3; x++) {
            icons[x].setAttribute('src', 'items/' + results[x] + '.png');
            icons[(icons.length - 3) + x].setAttribute('src', 'items/' + results[x] + '.png');
        }
        
        resultIcons.push(results);
    }

    // Calculate score based on results
    calculateScore(resultIcons);
    updateScoreBoard();
}

function calculateScore(resultIcons) {
    let win = false;
    let scoreIncrement = 0;

    // Check for matching icons across columns
    for (let i = 0; i < resultIcons[0].length; i++) {
        let iconSet = resultIcons.map(icons => icons[i]);
        if (iconSet.every(icon => icon === iconSet[0])) {
            win = true;
            scoreIncrement += 10; // Example score increment per match
        }
    }

    if (win) {
        playerScore += scoreIncrement;
    }
}

function updateScoreBoard() {
    document.getElementById('score').textContent = playerScore;
    // No need to display tokens as they are handled internally
}

function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

/**
 * @returns {number}
 */
function randomDuration() {
    return Math.floor(Math.random() * 10) / 100;
}
