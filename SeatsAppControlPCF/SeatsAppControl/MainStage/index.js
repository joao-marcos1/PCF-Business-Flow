import React from 'react';
import StageChart from './components/StageChart';
import useCalcSpace from './utils/useCalcSpace';

const MainStage = ({
  seatsSchema,
  items,
  unavailableSeatsIds,
  selectedSeatsIds,
  selectSeats,
  deselectSeats
}) => {
console.group("MainStage")
console.log(`items`, items)
  const [size, containerRef] = useCalcSpace(500, 500);
console.log(`size`, size)
console.groupEnd()
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
        unavailableSeatsIds={unavailableSeatsIds}
        selectedSeatsIds={selectedSeatsIds}
        selectSeats={selectSeats}
        deselectSeats={deselectSeats}
      />
    </div>
  );
};

export default MainStage;
