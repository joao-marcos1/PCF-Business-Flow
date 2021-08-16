import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Layer } from '../react-konva';
import Section from './Section';
import SeatPopup from './SeatPopup';
import * as layout from '../utils/layout';

const StageChart = ({
  size,
  seats,
  items,
  freeSeatsIds,
  unavailableSeatsIds,
  selectedSeatsIds,
  selectSeats,
  deselectSeats
}) => {
  const stageRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [scaleToFit, setScaleToFit] = useState(1);
  const [virtualWidth, setVirtualWidth] = useState(1000);
  const [virtualOffset, setVirtualOffset] = useState(0);
console.group("StageChart")
console.log(`items`, items)
console.log(`unavailableSeatsIds`, unavailableSeatsIds)
console.log(`selectedSeatsIds`, selectedSeatsIds)
console.groupEnd()
  const [popup, setPopup] = useState({ seat: null });
  // calculate initial scale
  useEffect(() => {
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
  }, [size]);

  // toggle scale on double clicks or taps
  const toggleScale = useCallback(() => {
    if (scale === 1) {
      setScale(scaleToFit);
    } else {
      setScale(1);
    }
  }, [scale, scaleToFit]);

  let lastSectionPosition = 0;

  const handleHover = useCallback((seat, pos) => {
    const item = items.find(item => item.platePositionNumber === seat);
console.group("handleHover")
console.log('item :>> ', item);
console.groupEnd()
    setPopup({
      seat: seat,
      position: pos,
      number: item && item.sampleTrackerNumber
    });
  }, [items]);

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
                unavailableSeatsIds={unavailableSeatsIds}
                onHoverSeat={handleHover}
                onSelectSeat={selectSeats}
                onDeselectSeat={deselectSeats}
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
          number={popup.number}
          isFree={freeSeatsIds.indexOf(popup.seat) !== -1}
          isSelected={selectedSeatsIds.indexOf(popup.seat) !== -1}
          onClose={() => {
            setPopup({ seat: null });
          }}
        />
      )}
    </>
  );
};

export default StageChart;
