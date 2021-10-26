export const SEAT_SIZE = 10;
export const SEATS_DISTANCE = 15;
export const SUBSECTION_PADDING = 30;

export const SECTIONS_MARGIN = 10;
export const SECTION_TOP_PADDING = 40;

export const getSubsectionWidth = subsection => {
  const [placesX] = getSeatsPlaces(subsection.seats_by_rows);

  return placesX[placesX.length - 1] + SUBSECTION_PADDING * 2;
};

export const getSubsectionHeight = subsection => {
  const [, placesY] = getSeatsPlaces(subsection.seats_by_rows);

  return placesY.reduce((sum, place) => sum + place, 0) + SUBSECTION_PADDING * 2;
};

export const getSectionWidth = (section, orientation = 'horizontal') => {
  const subsectionsWidth = section.subsections.map(getSubsectionWidth);

  return (
    orientation === 'horizontal' ?
      subsectionsWidth.reduce((sum, width) => sum + width, 0)
    : Math.max(...subsectionsWidth)
  );
};

export const getSectionHeight = (section, orientation = 'horizontal') => {
  const subsectionsHeight = section.subsections.map(getSubsectionHeight);

  return (
    (
      orientation === 'horizontal' ?
        Math.max(...subsectionsHeight)
      : subsectionsHeight.reduce((sum, height) => sum + height, 0)
    )  + SECTION_TOP_PADDING
  );
};

export const getMaximumSectionWidth = (sections, orientation = 'horizontal') => {
  return Math.max(...sections.map(section => getSectionWidth(section, orientation)));
};

export const getSeatsPlaces = (rows) => {
  let placesX = [];
  let placesY = [];
  let placeX = 0;
  let placeY = 0;
  let prevSizeX = 'small';
  let prevSizeY = 'small';

  Object
    .keys(rows)
    .forEach((rowKey, rowIndex) => {
      rows[rowKey].forEach(({ size }, index) => {
        if (placesY[rowIndex] !== 'big') {
          placesY[rowIndex] = size;
        }
        if (placesX[index] !== 'big') {
          placesX[index] = size;
        }
      })
    });

  placesX = placesX.map(size => {
    if (size === 'small' && prevSizeX === 'small') {
      placeX += SEATS_DISTANCE;
    } else if (
      (size === 'big' && prevSizeX === 'small') ||
      (size === 'small' && prevSizeX === 'big')
    ) {
      placeX += SEAT_SIZE * 2;
    } else if (size === 'big' && prevSizeX === 'big') {
      placeX += SEAT_SIZE + SEATS_DISTANCE;
    }
    prevSizeX = size;

    return placeX;
  });
  placesY = placesY.map(size => {
    if (size === 'small' && prevSizeY === 'small') {
      placeY += SEATS_DISTANCE;
    } else if (
      (size === 'big' && prevSizeY === 'small') ||
      (size === 'small' && prevSizeY === 'big')
    ) {
      placeY += SEAT_SIZE * 2;
    } else if (size === 'big' && prevSizeY === 'big') {
      placeY += SEAT_SIZE + SEATS_DISTANCE;
    }
    prevSizeY = size;

    return placeY;
  });

  return [placesX, placesY];
};
