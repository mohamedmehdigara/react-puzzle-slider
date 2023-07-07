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

    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        const tile = {
          id: row * NUM_COLS + col,
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

  const handleTileClick = (tile) => {
    if (gameOver) return;

    const { row, col } = tile;
    const emptyTile = tiles.find((t) => t.id === NUM_ROWS * NUM_COLS - 1);

    if (isAdjacent(tile, emptyTile)) {
      const tempTiles = [...tiles];
      const tileIndex = tempTiles.indexOf(tile);
      const emptyTileIndex = tempTiles.indexOf(emptyTile);

      // Swap positions
      [tempTiles[tileIndex], tempTiles[emptyTileIndex]] = [
        tempTiles[emptyTileIndex],
        tempTiles[tileIndex],
      ];

      setTiles(tempTiles);
      setMoves((prevMoves) => prevMoves + 1);
      checkGameOver(tempTiles);
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
          backgroundImage: `url(${IMAGE_URL})`,
          backgroundPosition: `${-tile.x}px ${-tile.y}px`,
          width: `${400 / NUM_COLS}px`,
          height: `${400 / NUM_ROWS}px`,
          top: `${tile.y}px`,
          left: `${tile.x}px`,
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
