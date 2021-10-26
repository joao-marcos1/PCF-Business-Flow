import React from "react";
import { Group, Text } from "../react-konva";
import Seat from "./Seat";

import {
  SEATS_DISTANCE,
  SUBSECTION_PADDING,
  SEAT_SIZE,
  getSeatsPlaces
} from "../utils/layout";

export default ({
  width,
  x,
  y,
  data,
  onHoverSeat,
  onSelectSeat,
  onDeselectSeat,
  selectedSeatsNames,
  unavailableSeatsNames
}) => {
  const [placesX, placesY] = getSeatsPlaces(data.seats_by_rows);

  return (
    <Group x={x} y={y}>
      {Object.keys(data.seats_by_rows).map((rowKey, rowIndex) => {
        const row = data.seats_by_rows[rowKey];

        return (
          <React.Fragment key={rowKey}>
            {row.map((seat, seatIndex) => (
              <Seat
                key={seat.name}
                x={placesX[seatIndex] + SUBSECTION_PADDING}
                y={placesY[rowIndex] + SUBSECTION_PADDING}
                data={seat}
                onHover={onHoverSeat}
                onSelect={onSelectSeat}
                onDeselect={onDeselectSeat}
                isSelected={selectedSeatsNames.indexOf(seat.name) >= 0}
                isUnavailable={unavailableSeatsNames.indexOf(seat.name) >= 0}
              />
            ))}
            <Text
              text={rowKey}
              x={SUBSECTION_PADDING - SEATS_DISTANCE}
              y={placesY[rowIndex] + SUBSECTION_PADDING - SEAT_SIZE / 2}
              fontSize={SEAT_SIZE}
              key={"label-left" + rowKey}
            />
          </React.Fragment>
        );
      })}
      {data.seats_by_rows[1].map((_, seatIndex) => {
        return (
          <Text
            text={(seatIndex + 1).toString()}
            x={placesX[seatIndex] + SUBSECTION_PADDING - 50}
            width={100}
            y={
              placesY.reduce((sum, place) => sum + place, 0) + SUBSECTION_PADDING
            }
            key={"label-bottom" + seatIndex}
            align="center"
          />
        );
      })}
      <Text text={data.name} width={width} align="center" />
    </Group>
  );
};
