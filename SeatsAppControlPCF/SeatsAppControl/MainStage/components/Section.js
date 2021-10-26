import React, { memo, useRef, useEffect } from 'react';
import { Rect, Group, Text } from '../react-konva';
import SubSection from './SubSection';

import {
  SECTION_TOP_PADDING,
  getSectionWidth,
  getSectionHeight,
  getSubsectionWidth,
  getSubsectionHeight,
} from '../utils/layout';

export default memo(
  ({
    section,
    x,
    y,
    orientation,
    onHoverSeat,
    onSelectSeat,
    onDeselectSeat,
    selectedSeatsNames,
    unavailableSeatsNames
  }) => {
    const containerRef = useRef();

    // caching will boost rendering
    // we just need to recache on some changes
    useEffect(() => {
      containerRef.current.cache();
    }, [section, selectedSeatsNames]);

    const width = getSectionWidth(section, orientation);
    const height = getSectionHeight(section, orientation);
    let lastSubsectionDimension = (
      orientation === 'horizontal' ?
        0
      : SECTION_TOP_PADDING
    );

    return (
      <Group y={y} x={x} ref={containerRef}>
        <Rect
          width={width}
          height={height}
          fill="white"
          strokeWidth={1}
          stroke="lightgrey"
          cornerRadius={5}
        />
        {section.subsections.map((subsection, index) => {
          const subDimension = (
            orientation === 'horizontal' ?
              getSubsectionWidth(subsection)
            : getSubsectionHeight(subsection)
          );
          const pos = lastSubsectionDimension;

          lastSubsectionDimension += subDimension;

          let subX = pos;
          let subY = SECTION_TOP_PADDING;
          let subWidth = subDimension;
          let subHeight = height;

          if (orientation === 'vertical') {
            subX = 0;
            subY = pos;
            subWidth = width;
            subHeight = subDimension;
          }

          return (
            <SubSection
              x={subX}
              y={subY}
              key={index}
              data={subsection}
              width={subWidth}
              height={subHeight}
              onHoverSeat={onHoverSeat}
              onSelectSeat={onSelectSeat}
              onDeselectSeat={onDeselectSeat}
              selectedSeatsNames={selectedSeatsNames}
              unavailableSeatsNames={unavailableSeatsNames}
            />
          );
        })}
        <Text
          text={section.name}
          height={SECTION_TOP_PADDING}
          width={width}
          align="center"
          verticalAlign="middle"
          fontSize={20}
        />
      </Group>
    );
  }
);
