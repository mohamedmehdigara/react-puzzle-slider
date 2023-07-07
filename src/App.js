import React, { useState, useEffect } from 'react';
import './App.css';

const NUM_ROWS = 3;
const NUM_COLS = 3;
const IMAGE_URL = process.env.PUBLIC_URL + '/tom-cat.png';

function App() {
  const [tiles, setTiles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    initializeTiles();
  }, []);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameOver]);

  const initializeTiles = () => {
    const tempTiles = [];
    const tileSize = 400 / NUM_ROWS;
    const tilePositions = Array.from({ length: NUM_ROWS * NUM_COLS }, (_, index) => index);

    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        const randomIndex = Math.floor(Math.random() * tilePositions.length);
        const positionIndex = tilePositions.splice(randomIndex, 1)[0];
        const tile = {
          id: positionIndex,
          row,
          col,
          x: col * tileSize,
          y: row * tileSize,
        };
        tempTiles.push(tile);
      }
    }

    setTiles(tempTiles);
    setGameOver(false);
    setMoves(0);
    setTimer(0);
  };

  const handleTileClick = (clickedTile) => {
    if (gameOver) return;

    const emptyTile = tiles.find((tile) => tile.id === NUM_ROWS * NUM_COLS - 1);

    if (isAdjacent(clickedTile, emptyTile)) {
      const updatedTiles = tiles.map((tile) => {
        if (tile.id === clickedTile.id) {
          return { ...tile, row: emptyTile.row, col: emptyTile.col };
        } else if (tile.id === emptyTile.id) {
          return { ...tile, row: clickedTile.row, col: clickedTile.col };
        } else {
          return tile;
        }
      });

      setTiles(updatedTiles);
      setMoves((prevMoves) => prevMoves + 1);
      checkGameOver(updatedTiles);
    }
  };

  const isAdjacent = (tile1, tile2) => {
    return (
      (tile1.row === tile2.row && Math.abs(tile1.col - tile2.col) === 1) ||
      (tile1.col === tile2.col && Math.abs(tile1.row - tile2.row) === 1)
    );
  };

  const checkGameOver = (tiles) => {
    const isGameOver = tiles.every((tile) => tile.id === tile.row * NUM_COLS + tile.col);
    setGameOver(isGameOver);
  };

  const renderTiles = () => {
    return tiles.map((tile) => (
      <div
        key={tile.id}
        className={`tile ${gameOver ? 'game-over' : ''}`}
        style={{
          background: `url(${IMAGE_URL}) no-repeat ${-tile.col * (400 / NUM_COLS)}px ${-tile.row * (400 / NUM_ROWS)}px`,
          backgroundSize: `${400}px ${400}px`,
          width: `${400 / NUM_COLS}px`,
          height: `${400 / NUM_ROWS}px`,
          top: `${tile.row * (400 / NUM_ROWS)}px`,
          left: `${tile.col * (400 / NUM_COLS)}px`,
        }}
        onClick={() => handleTileClick(tile)}
      />
    ));
  };
  
  return (
    <div className="App">
      <h1>Puzzle Slider Game</h1>
      <div className="game-info">
        <p>Moves: {moves}</p>
        <p>Time: {timer} seconds</p>
      </div>
      <div className="puzzle-container">{renderTiles()}</div>
      {gameOver && (
        <div className="game-over-message">
          <p>Congratulations! You solved the puzzle!</p>
          <button onClick={initializeTiles}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
