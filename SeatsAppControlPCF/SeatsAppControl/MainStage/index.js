import React from 'react';
import StageChart from './components/StageChart';
import useCalcSpace from './utils/useCalcSpace';

const MainStage = ({
  seatsSchema,
  items,
  freeSeatsIds,
  unavailableSeatsIds,
  selectedSeatsIds,
  selectSeats,
  deselectSeats
}) => {
  const [size, containerRef] = useCalcSpace(500, 500);

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "lightgrey",
        width: "50%",
        height: "100vh"
      }}
      ref={containerRef}
    >
      <StageChart
        size={size}
        seats={seatsSchema.seats}
        items={items}
        freeSeatsIds={freeSeatsIds}
        unavailableSeatsIds={unavailableSeatsIds}
        selectedSeatsIds={selectedSeatsIds}
        selectSeats={selectSeats}
        deselectSeats={deselectSeats}
      />
    </div>
  );
};

export default MainStage;
