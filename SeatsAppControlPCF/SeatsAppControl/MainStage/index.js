import React from 'react';
import StageChart from './components/StageChart';
import useFetch from './utils/useFetch';

const MainStage = ({ items, selectedItems, setField }) => {
  const seatsData = useFetch('./utils/seats-data.json');
  const containerRef = React.useRef(null);
console.group("MainStage")
console.log(`items`, items)
console.log(`selectedItems`, selectedItems)
console.groupEnd()
  const [size, setSize] = React.useState({
    width: 1000,
    height: 1000
  });

  // calculate available space for drawing
  React.useEffect(() => {
    const newSize = {
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight
    };
    if (newSize.width !== size.width || newSize.height !== size.height) {
      setSize(newSize);
    }
  });

  if (seatsData === null) {
    return <div ref={containerRef}>Loading...</div>;
  }

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
        seats={seatsData.seats}
        items={items}
        selectedItems={selectedItems}
        setField={setField}
      />
    </div>
  );
};

export default MainStage;
