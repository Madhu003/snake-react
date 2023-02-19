import React, { useEffect, useState } from "react";
import Cell from "../cell/Cell";
import "./board.css";

const matrixGlobal = [];
const boardSize = 25;
const initSnakePosition = [
  ...new Array(15)
    .fill("")
    .map((_, index) => ({ coordinate: { x: 0, y: index } })),
];

for (let i = 0; i < boardSize; i++) {
  let row = [];
  for (let j = 0; j < boardSize; j++) {
    row.push({ coordinate: { x: i, y: j } });
  }
  matrixGlobal.push(row);
}

let snakeDirection = 2;
let intervalId = null;

function Board() {
  const [matrix, setMatrix] = useState(matrixGlobal);
  const [snake, setSnake] = useState(initSnakePosition);
  const [foodLocation, setFoodLocation] = useState([]);

  useEffect(() => {
    updateBoard();

    document.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.code == "ArrowUp" && snakeDirection % 2 == 0) {
        snakeDirection = 1;
      } else if (e.code == "ArrowRight" && snakeDirection % 2 != 0) {
        snakeDirection = 2;
      } else if (e.code == "ArrowDown" && snakeDirection % 2 == 0) {
        snakeDirection = 3;
      } else if (e.code == "ArrowLeft" && snakeDirection % 2 != 0) {
        snakeDirection = 4;
      }
    });

    generateNewFood();
  }, []);

  useEffect(() => {
    matrix.forEach((row) => {
      row.forEach((cell) => {
        cell.isFoodHere =
          cell.coordinate.x == foodLocation[0] &&
          cell.coordinate.y == foodLocation[1];
      });

      row = [...row];
    });

    setMatrix(JSON.parse(JSON.stringify(matrix)));
  }, [foodLocation]);

  const generateNewFood = () => {
    const x = Math.floor(Math.random() * boardSize);
    const y = Math.floor(Math.random() * boardSize);

    if (matrix[x][y].isSnakeHere) {
      console.log("run again");
      generateNewFood();
    } else {
      console.log([x, y]);
      setFoodLocation([x, y]);
    }
  };

  const clearBoard = () => {
    matrix.forEach((row) => {
      row.forEach((cell) => {
        cell.isSnakeHere = false;
      });
    });
  };

  const markSnake = (updatedSnake) => {
    matrix.forEach((row, i) => {
      row.forEach((cell, j) => {
        updatedSnake.forEach((snakeCell) => {
          if (snakeCell.coordinate.x == i && snakeCell.coordinate.y == j)
            cell.isSnakeHere = true;
        });
      });
    });
  };

  const moveSnake = () => {
    let newCell = null;
    // 1 - top, 2 - right, 3 - down, 4 - left
    if (snakeDirection == 1) {
      newCell = {
        coordinate: { x: snake[0].coordinate.x - 1, y: snake[0].coordinate.y },
      };
    } else if (snakeDirection == 2) {
      newCell = {
        coordinate: { x: snake[0].coordinate.x, y: snake[0].coordinate.y + 1 },
      };
    } else if (snakeDirection == 3) {
      newCell = {
        coordinate: { x: snake[0].coordinate.x + 1, y: snake[0].coordinate.y },
      };
    } else {
      newCell = {
        coordinate: { x: snake[0].coordinate.x, y: snake[0].coordinate.y - 1 },
      };
    }

    if (
      newCell.coordinate.x > boardSize ||
      newCell.coordinate.x < 0 ||
      newCell.coordinate.y < 0 ||
      newCell.coordinate.y > boardSize ||
      matrix[newCell.coordinate.x][newCell.coordinate.y].isSnakeHere
    ) {
      clearInterval(intervalId);
      return alert("You are out !");
    }

    console.log(foodLocation);
    if (
      newCell.coordinate.x == foodLocation[0] &&
      newCell.coordinate.y == foodLocation[1]
    ) {
      debugger;
      generateNewFood();
    } else {
      snake.pop();
    }

    snake.unshift(newCell);

    return snake;
  };

  function updateBoard() {
    intervalId = setInterval(function () {
      clearBoard();
      const updatedSnake = moveSnake();
      markSnake(updatedSnake);

      setSnake([...updatedSnake]);
      setMatrix(JSON.parse(JSON.stringify(matrix)));
    }, 100);
  }

  return (
    <div>
      {JSON.stringify(foodLocation)}
      <table>
        <tbody>
          {matrix.map((row) => (
            <tr>
              {row.map((cell) => (
                <td>
                  <Cell cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Board;
