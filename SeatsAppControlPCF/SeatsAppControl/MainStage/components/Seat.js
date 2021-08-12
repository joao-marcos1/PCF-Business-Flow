import React from "react";
import { Circle } from "../react-konva";
import { SEAT_SIZE } from "../utils/layout";

function getColor(isSelected, isBooked, isUnavailable) {
  if (isSelected) {
    return "green";
  } else if (isBooked) {
    return "lightgrey";
  } else if (isUnavailable) {
    return "red";
  } else {
    return "#1b728d";
  }
}

const Seat = ({
  x,
  y,
  data,
  onHover,
  onSelect,
  onDeselect,
  isSelected,
  isUnavailable
}) => {
  const isBooked = data.status === "booked";

  const handleMouseEnter = e => {
    e.target._clearCache();
    onHover(data.name, e.target.getAbsolutePosition());
    const container = e.target.getStage().container();
    if (isBooked || isUnavailable) {
      container.style.cursor = "not-allowed";
    } else {
      container.style.cursor = "pointer";
    }
  };
  const handleMouseLeave = e => {
    onHover(null);
    const container = e.target.getStage().container();
    container.style.cursor = "";
  };
  const handleClickTap = _ => {
    if (isBooked || isUnavailable) {
      return;
    }
    if (isSelected) {
      onDeselect(data.name);
    } else {
      onSelect(data.name);
    }
  };

  return (
    <Circle
      x={x}
      y={y}
      radius={SEAT_SIZE / 2}
      fill={getColor(isSelected, isBooked, isUnavailable)}
      strokeWidth={1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClickTap}
      onTap={handleClickTap}
    />
  );
};

export default Seat;
