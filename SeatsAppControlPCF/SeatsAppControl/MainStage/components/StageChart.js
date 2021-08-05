import React from 'react';
import { Stage, Layer } from '../react-konva';
import Section from './Section';
import SeatPopup from './SeatPopup';
import * as layout from '../utils/layout';
import filterData from '../utils/filterData';

const StageChart = ({ size, seats }) => {
  const stageRef = React.useRef(null);

  const [scale, setScale] = React.useState(1);
  const [scaleToFit, setScaleToFit] = React.useState(1);
  const [virtualWidth, setVirtualWidth] = React.useState(1000);
  const [virtualOffset, setVirtualOffset] = React.useState(0);

  const [selectedSeatsIds, setSelectedSeatsIds] = React.useState([]);

  const [popup, setPopup] = React.useState({ seat: null });

  // calculate initial scale
  React.useEffect(() => {
    if (!stageRef.current) {
      return;
    }

    const stage = stageRef.current;
    const clientRect = stage.getClientRect({ skipTransform: true });

    const scaleToFit = size.width / clientRect.width;
    setScale(scaleToFit);
    setScaleToFit(scaleToFit);
    setVirtualWidth(clientRect.width);
    setVirtualOffset(Math.abs(clientRect.x));
  }, [seats, size]);

  // toggle scale on double clicks or taps
  const toggleScale = React.useCallback(() => {
    if (scale === 1) {
      setScale(scaleToFit);
    } else {
      setScale(1);
    }
  }, [scale, scaleToFit]);

  let lastSectionPosition = 0;

  const handleHover = React.useCallback((seat, pos) => {
    setPopup({
      seat: seat,
      position: pos
    });
  }, []);

  const handleSelect = React.useCallback(
    seatId => {
console.log(`seatId`, seatId)
console.log(`selectedSeatsIds`, selectedSeatsIds)
      // const newIds = selectedSeatsIds.concat(filterData(selectedRows?.seats?.sections))
      const newIds = selectedSeatsIds.concat(seatId);

        // select index numbers of array based on number of rows selected form selectedRows
        // update array

      setSelectedSeatsIds(newIds);
      // console.log(newIds);
    },
    [selectedSeatsIds]
  );

  const handleDeselect = React.useCallback(
    seatId => {
      const ids = selectedSeatsIds.slice();
      ids.splice(ids.indexOf(seatId), 1);
      setSelectedSeatsIds(ids);
    },
    [selectedSeatsIds]
  );

  const maxSectionWidth = layout.getMaximimSectionWidth(seats.sections);

  return (
    <>
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        draggable
        dragBoundFunc={pos => {
          pos.x = Math.min(
            size.width / 2,
            Math.max(pos.x, -virtualWidth * scale + size.width / 2)
          );
          pos.y = Math.min(size.height / 2, Math.max(pos.y, -size.height / 2));
          return pos;
        }}
        onDblTap={toggleScale}
        onDblClick={toggleScale}
        scaleX={scale}
        scaleY={scale}
        x={virtualOffset}
      >
        <Layer>
          {seats.sections.map((section, index) => {
            const height = layout.getSectionHeight(section);
            const position = lastSectionPosition + layout.SECTIONS_MARGIN;
            lastSectionPosition = position + height;
            const width = layout.getSectionWidth(section);

            const offset = (maxSectionWidth - width) / 2;

            return (
              <Section
                x={offset}
                y={position}
                height={height}
                key={index}
                section={section}
                selectedSeatsIds={selectedSeatsIds}
                onHoverSeat={handleHover}
                onSelectSeat={handleSelect}
                onDeselectSeat={handleDeselect}
              />
            );
          })}
        </Layer>
      </Stage>
      {/* draw popup as html */}
      {popup.seat && (
        <SeatPopup
          position={popup.position}
          seatId={popup.seat}
          onClose={() => {
            setPopup({ seat: null });
          }}
        />
      )}
    </>
  );
};

export default StageChart;
