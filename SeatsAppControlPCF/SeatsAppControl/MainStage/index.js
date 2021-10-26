import React from 'react';
import StageChart from './components/StageChart';
import useCalcSpace from './utils/useCalcSpace';

const MainStage = ({
  schema,
  items,
  sectionName,
  state: {
    freeSeats: { names: freeSeatsNames },
    unavailableSeatsNames,
    selectedSeatsNames
  },
  selectSeats,
  deselectSeats
}) => {
  const [size, containerRef] = useCalcSpace(500, 500);
console.group("MainStage")
console.log(`schema`, schema)
console.log(`sectionName`, sectionName)
console.log(`freeSeatsNames`, freeSeatsNames)
console.log(`unavailableSeatsNames`, unavailableSeatsNames)
console.log(`selectedSeatsNames`, selectedSeatsNames)
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
        orientation='vertical'
        schema={schema}
        items={items}
        sectionName={sectionName}
        freeSeatsNames={freeSeatsNames}
        unavailableSeatsNames={unavailableSeatsNames}
        selectedSeatsNames={selectedSeatsNames}
        selectSeats={selectSeats}
        deselectSeats={deselectSeats}
      />
    </div>
  );
};

export default MainStage;
