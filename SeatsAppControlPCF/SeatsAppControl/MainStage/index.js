import React from 'react';
import StageChart from './components/StageChart';
import useCalcSpace from './utils/useCalcSpace';

const MainStage = ({
  seatsSchema,
  freeSeatsIds,
  items,
  selectedItems,
  setField
}) => {
console.group("MainStage")
console.log(`items`, items)
console.log(`selectedItems`, selectedItems)
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
        freeSeatsIds={freeSeatsIds}
        items={items}
        selectedItems={selectedItems}
        setField={setField}
      />
    </div>
  );
};

export default MainStage;
