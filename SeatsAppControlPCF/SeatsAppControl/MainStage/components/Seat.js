import React from "react";
import { Circle } from "../react-konva";
import { SEAT_SIZE } from "../utils/layout";

function getColor(isSelected, isAutoBooked, isUnavailable) {
  if (isSelected) {
    return "green";
  } else if (isAutoBooked) {
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
  data: { name, size, status },
  onHover,
  onSelect,
  onDeselect,
  isSelected,
  isUnavailable
}) => {
  const isAutoBooked = status === "auto-booked";

  const handleMouseEnter = e => {
    e.target._clearCache();
    onHover(name, e.target.getAbsolutePosition());
    const container = e.target.getStage().container();
    if (isAutoBooked || isUnavailable) {
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
    if (isAutoBooked || isUnavailable) {
      return;
    }
    if (isSelected) {
      onDeselect(name);
    } else {
      onSelect(name);
    }
  };

  return (
    <Circle
      x={x}
      y={y}
      radius={size === 'small' ? SEAT_SIZE / 2 : SEAT_SIZE}
      fill={getColor(isSelected, isAutoBooked, isUnavailable)}
      strokeWidth={1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClickTap}
      onTap={handleClickTap}
    />
  );
};

export default Seat;
