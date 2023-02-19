import React from "react";
import './cell.css'

export default function Cell({ cell }) {
    return (
      <div
        class={`cell ${cell.isSnakeHere ? "snake-here" : ""} ${
          cell.isFoodHere ? "food-here" : ""
        }`}
      >
        {cell.coordinate.x}, {cell.coordinate.y}
      </div>
    );
}