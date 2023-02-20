import React, { useEffect, useState, useRef } from "react";
import Cell from "../cell/Cell";
import "./board.css";

const matrixGlobal = [];
const boardSize = 15;
const initSnakePosition = [
  ...new Array(5)
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
let foddLocationGlobal = []
function Board() {
  const [matrix, setMatrix] = useState(matrixGlobal);
  const [snake, setSnake] = useState(initSnakePosition);
  const [foodLocation, setFoodLocation] = useState([]);
  const [toggleUpdateBoard, setToggleUpdateBoard] = useState(true)

  useEffect(() => {
    // useInterval(() => updateBoard(), 100)
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
      }  else if (e.code == "Space") {
        setToggleUpdateBoard(!!toggleUpdateBoard)
      } 
    });

    generateNewFood();

    setTimeout(() => updateBoard(), 200);
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
    console.log("food location updated", foodLocation, matrix)
  }, [foodLocation]);

  const generateNewFood = () => {
    const x = Math.floor(Math.random() * boardSize);
    const y = Math.floor(Math.random() * boardSize);

    if (matrix[x][y].isSnakeHere) {
      console.log("run again");
      generateNewFood();
    } else {
      console.log("new food", [x, y]);
      setFoodLocation([x, y]);
      foddLocationGlobal = [x, y]
    }
  };

  const clearBoard = () => {
    matrix.forEach((row) => {
      row.forEach((cell) => {
        cell.isSnakeHere = false;
      });
    });
  };

  const markSnake = () => {
    matrix.forEach((row, i) => {
      row.forEach((cell, j) => {
        snake.forEach((snakeCell) => {
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
      return console.log("You are out !");
    }

    console.log(foodLocation, foddLocationGlobal);
    if (
      newCell.coordinate.x == foddLocationGlobal[0] &&
      newCell.coordinate.y == foddLocationGlobal[1]
    ) {
      generateNewFood();
    } else {
      snake.pop();
    }

    snake.unshift(newCell);
  };

  const waitFor = (time) => {
    return new Promise((resolve, reeject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  };

  async function updateBoard() {
    while (toggleUpdateBoard) {
      clearBoard();
      moveSnake();
      markSnake();
      
      setSnake([...snake]);
      setMatrix([...matrix]);

      await waitFor(250);
    }
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
