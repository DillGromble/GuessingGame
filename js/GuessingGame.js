function generateWinningNumber () {
	return Math.floor(Math.random() * 100) + 1;
};



function shuffle (arr) {
	var cardsLeft = arr.length, temp;

	while (cardsLeft) {
		var i = Math.floor(Math.random() * cardsLeft--);

		temp = arr[cardsLeft];
		arr[cardsLeft] = arr[i];
		arr[i] = temp;
	}
	return arr;
};



function Game () {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
};



Game.prototype.difference = function () {

	if (!this.isLower()) {
		$('#tooHigh').show();
	}
	else {
		$('#tooLow').show();
	}

	return Math.abs(this.playersGuess - this.winningNumber);
};



Game.prototype.isLower = function () {
	return this.playersGuess < this.winningNumber;
};



Game.prototype.playersGuessSubmission = function (guess) {
	if (guess > 100 || guess < 1 || isNaN(guess)) {
		$('h2').text('That is an invalid guess.');
		throw "That is an invalid guess.";
	}
	
	$('#tooHigh').hide();
	$('#tooLow').hide();
	
	this.playersGuess = guess;
	return this.checkGuess();
};



Game.prototype.checkGuess = function () {
	
	if (this.playersGuess === this.winningNumber) {
		$('h1').text('You Win!');
		$('h2').text('Press Reset for another!');
		return 'done'
	}
	else if (this.pastGuesses.includes(this.playersGuess)) {
		$('h1').text("You've already guessed that number!");
	};


	this.pastGuesses.push(this.playersGuess);
	var turnNumber = this.pastGuesses.length;

	$('#prevGuesses li:nth-child('+ turnNumber + ')').text(this.playersGuess).addClass('guessed');

	if (turnNumber >= 5) {
		$('h1').text('You Lose!');
		$('h2').text('Press Reset for another!');
		return 'done'
	}
	else if (turnNumber === 3) {
		$('#hint').prop('disabled', false);
		$('h1').text('Need a hint?');
	}
	
	var diff = this.difference();
	
	
	if (diff < 10) { $('h2').text("You're burning up!")}
	else if (diff < 25) { $('h2').text("You're lukewarm.")}
	else if (diff < 50) { $('h2').text("You're a bit chilly.")}
	else { $('h2').text("You're ice cold!")}
};



Game.prototype.provideHint = function () {

	return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);	
};



function newGame() {
	return new Game();
};





$(document).ready(function () {
	var game = newGame(),
		guess;


	function submitGuess () {
		guess = +$('#player-input').val();
		$('#player-input').val('')

		var done = game.playersGuessSubmission(guess);

		if (done === 'done') {
			$('#submit').prop('disabled', true);
			$('#hint').prop('disabled', true);
			$('#reset').animate({'height' : '75px', 
				'width' : '150px',
				'font-size' : '22px'}, 400);
		}
	};


	function resetGame() {
		$('h1').text("Guessing Game!");
		$('h2').text("Pick a number between 1-100");
		$('#submit').prop('disabled', false);
		$('#hint').prop('disabled', true);
		$('#tooHigh').hide();
		$('#tooLow').hide();
		$('.guess').text('-');
		$('.guess').removeClass('guessed');
		$('#reset').animate({'height' : '34px', 
				'width' : '105.63px',
				'font-size' : '14px'}, 400);
	};


	$('#submit').on('click', function () {
		submitGuess();
	});


	$('#player-input').keyup(function(e) {
		if (e.keyCode == 13) {submitGuess()}
	});

	$('#reset').on('click', function () {
		resetGame();
		game = newGame();
	});

	$('#hint').on('click', function () {
		var hint = game.provideHint();
		$('#subtitle').text(hint[0] + "  |  " + hint[1] + "  |  " + hint[2]);
		$('#title').text("Guessing Game!");
	});


});















