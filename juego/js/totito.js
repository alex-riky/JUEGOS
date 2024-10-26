// 1. Declaración de elementos del DOM
// Selecciona todas las celdas del tablero
const cells = document.querySelectorAll('[data-cell]');
// Elemento que muestra el estado del juego
const gameStatus = document.getElementById('game-status');
// Botón para reiniciar el juego y regresar al menú principal
const restartButton = document.getElementById('restart-btn');
// Botón para finalizar la partida actual
const endButton = document.getElementById('end-btn');
// Botón para iniciar la partida
const startButton = document.getElementById('start-btn');
// Formulario para ingresar los nombres de los jugadores
const playerForm = document.getElementById('player-form');
// Tablero del juego
const gameBoard = document.getElementById('game-board');
// Marcador de puntaje
const scoreboard = document.getElementById('scoreboard');
// Elementos que muestran los nombres de los jugadores
const playerXNameDisplay = document.getElementById('playerX-name');
const playerONameDisplay = document.getElementById('playerO-name');
// Elementos que muestran los puntajes de los jugadores
const playerXScoreDisplay = document.getElementById('playerX-score');
const playerOScoreDisplay = document.getElementById('playerO-score');
// Elemento que contiene los botones de control del juego
const buttonsDiv = document.getElementById('buttons');

// 2. Definición de variables del juego
// Clases que representan los símbolos 'X' y 'O'
const X_CLASS = 'x';
const O_CLASS = 'o';
// Combinaciones ganadoras en el tablero
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let oTurn;  // Indica si es el turno de 'O'
let playerXName = '';  // Nombre del jugador 'X'
let playerOName = '';  // Nombre del jugador 'O'
let playerXScore = 0;  // Puntuación del jugador 'X'
let playerOScore = 0;  // Puntuación del jugador 'O'
let playerXTurnNext = true;  // Indica si el jugador 'X' comenzará la próxima partida
let totalGames = 0;  // Total de partidas jugadas

// 3. Eventos y lógica de inicio/reinicio de juego
// Evento que inicia el juego cuando se hace clic en el botón de inicio
startButton.addEventListener('click', () => {
    playerXName = document.getElementById('player1').value || 'Jugador X';
    playerOName = document.getElementById('player2').value || 'Jugador O';
    
    playerXNameDisplay.textContent = playerXName;
    playerONameDisplay.textContent = playerOName;

    playerForm.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    scoreboard.classList.remove('hidden');
    buttonsDiv.classList.remove('hidden');

    startGame();
});

// Evento que reinicia el juego y redirige al menú principal
restartButton.addEventListener('click', function() {
    window.location.href = 'index.html';  // Redirigir al menú principal
});

// Evento que termina la partida actual y reinicia el juego
endButton.addEventListener('click', () => { 
    gameStatus.textContent = `Partida terminada. ${playerXName} ${playerXScore} - ${playerOName} ${playerOScore}`;
    resetGameBoard();
    gameBoard.classList.add('hidden');
    scoreboard.classList.add('hidden');
    playerForm.classList.remove('hidden');
    document.getElementById('player1').value = '';
    document.getElementById('player2').value = '';
    playerXScore = 0;
    playerOScore = 0;
    playerXScoreDisplay.textContent = playerXScore;
    playerOScoreDisplay.textContent = playerOScore;
});


// Función que inicia el juego y limpia las celdas del tablero
function startGame() {
    // Inicia el juego, alternando el turno entre los jugadores X y O.
    oTurn = !playerXTurnNext;
    // Establece el turno inicial, si es el turno de X, se cambia a O, y viceversa, usa la variable 'playerXTurnNext' para definir si empieza X o O.
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS, O_CLASS, 'win');
        cell.innerHTML = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    gameStatus.textContent = `Turno de ${oTurn ? playerOName + ' (O)' : playerXName + ' (X)'}`;
    // Actualiza el texto en pantalla para mostrar el jugador al que le toca jugar. 
    // Si 'oTurn' es verdadero, muestra que es el turno de O; si es falso, muestra el turno de X.
}


// Maneja los clicks en las celdas del tablero
function handleClick(e) {
    const cell = e.target; 
    // Obtiene la celda clicada.  
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    // Define la clase actual (X u O) según el turno.
    const currentPlayerName = oTurn ? playerOName : playerXName;
    // Obtiene el nombre del jugador actual.
    placeMark(cell, currentClass);
    // Coloca la marca (X o O) en la celda clicada.
    if (checkWin(currentClass)) {
        // Verifica si el jugador actual ha ganado.
        drawWinningLine(currentClass);
        // Dibuja la línea de la combinación ganadora.
        setTimeout(() => endGame(false, currentPlayerName), 500);
        // Termina el juego después de 500 ms si alguien gana.
    } else if (isDraw()) {
        // Verifica si hay un empate.
        setTimeout(() => endGame(true), 500);
        // Termina el juego después de 500 ms si es empate.
    } else {
        swapTurns();
        // Cambia el turno al otro jugador.
        setBoardHoverClass();
        // Ajusta el hover según el nuevo turno.
        gameStatus.textContent = `Turno de ${oTurn ? playerOName + ' (O)' : playerXName + ' (X)'}`;
        // Actualiza el texto en la pantalla mostrando el jugador que tiene el turno.
        // Si es el turno de O, muestra "Turno de [Nombre del jugador O] (O)", 
        // de lo contrario, muestra "Turno de [Nombre del jugador X] (X)".

    }
}


// Termina el juego y muestra el resultado
function endGame(draw, winner = '') {
    if (draw) {
        gameStatus.textContent = '¡Empate!';
        playerXTurnNext = !playerXTurnNext;
        setTimeout(startGame, 2000);
    } else {
        gameStatus.textContent = `${winner} ha ganado!`;
        alert(`¡Felicidades ${winner}, has ganado!`);
        updateScore(winner);
        playerXTurnNext = winner === playerXName;
        setTimeout(startGame, 2000);
    }
}

// 5. Otras funciones auxiliares
// Verifica si todas las celdas están llenas para determinar empate
function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

// Coloca una marca ('X' o 'O') en la celda
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.innerHTML = currentClass.toUpperCase();
}

// Alterna el turno entre jugadores
function swapTurns() {
    oTurn = !oTurn;
}

// Ajusta la clase de hover según el turno actual
function setBoardHoverClass() {
    gameBoard.classList.remove(X_CLASS, O_CLASS);
    gameBoard.classList.add(oTurn ? O_CLASS : X_CLASS);
}

// Verifica si un jugador ha ganado
function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

// Actualiza el puntaje del jugador ganador
function updateScore(winner) {
    if (winner === playerXName) {
        playerXScore++;
        playerXScoreDisplay.textContent = playerXScore;
    } else {
        playerOScore++;
        playerOScoreDisplay.textContent = playerOScore;
    }
}

// Dibuja una línea en las celdas ganadoras
function drawWinningLine(currentClass) {
    const winningCombination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });

    if (winningCombination) {
        winningCombination.forEach(index => {
            cells[index].classList.add('win');
        });
    }
}

// Reinicia el tablero del juego
function resetGameBoard() {
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS, O_CLASS, 'win');
        cell.innerHTML = '';
    });
    playerXTurnNext = true;
}
