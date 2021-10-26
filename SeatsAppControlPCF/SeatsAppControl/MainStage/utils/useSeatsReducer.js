import { useReducer } from 'react';

const SET_SECTION_NAME = 'SET_SECTION_NAME';
const SET_SELECTED_ITEMS = 'SET_SELECTED_ITEMS';
const SELECT_SEATS = 'SELECT_SEATS';
const DESELECT_SEATS = 'DESELECT_SEATS';
const RESET_DATA_TO_SAVE = 'RESET_DATA_TO_SAVE';

const getSectionFreeSeats = (freeSeatsNames) => {
  const freeSeatsOrder = {};

  [].concat(...Object.values(freeSeatsNames)).forEach((name, index) => {
    freeSeatsOrder[name] = index;
  });

  return {
    names: freeSeatsNames,
    order: freeSeatsOrder
  };
};

const getSubSectionFreeSeatsNames = (
  seatName,
  currentSubSectionId = null,
  freeSeatsNames
) => {
  let subSectionId;
  let currentFreeSeatsNames;
  let reshapedFreeNames;

  if (currentSubSectionId === null) {
    subSectionId = seatName.split('-')[0];
    currentFreeSeatsNames = freeSeatsNames[subSectionId];

    const freeSeatsNameStart = currentFreeSeatsNames.indexOf(seatName);

    reshapedFreeNames = currentFreeSeatsNames.slice(freeSeatsNameStart).concat(
      currentFreeSeatsNames.slice(0, freeSeatsNameStart)
    );
  } else {
    let keys = Object.keys(freeSeatsNames);
    const keysStart = keys.indexOf(currentSubSectionId);

    keys = keys.slice(keysStart).concat(keys.slice(0, keysStart));
    subSectionId = keys[keys.indexOf(currentSubSectionId) + 1];

    if (subSectionId > keys.length) {
      subSectionId = currentSubSectionId;
    }
    currentFreeSeatsNames = freeSeatsNames[subSectionId];
    reshapedFreeNames = currentFreeSeatsNames.slice();
  }

  return {
    currentSubSectionId: subSectionId,
    reshapedFreeNames,
    newFreeSeatsNames: {
      [subSectionId]: currentFreeSeatsNames.slice()
    }
  };
};

const getSelectedSeatsToSave = (seatsNames, schema, status) => {
  const result = {};

  seatsNames.forEach(name => {
    const [subSectionId, rowId] = name.split('-');
    const { id } = (
      schema
        .subsections.find(subsection => subsection.name === subSectionId)
        .seats_by_rows[rowId]
        .find(seat => seat.name === name)
    );

    result[id] = status;
  })

  return result;
};

const init = ({ allItems, seatsSchema, allChangeableSeatsNames }) => {
  const items = {};
  const sections = {};
  const preAssignedItemsKeys = [];
  const allSections = [];
console.group("useReducer init")
console.log(`allItems`, allItems)
console.log(`seatsSchema`, seatsSchema)
console.log(`allChangeableSeatsNames`, allChangeableSeatsNames)
console.groupEnd()
  allItems.forEach(item => {
    items[item.key] = item;
    if (item.platePositionNumber !== null) {
      // TODO handle sub section/trayId difference
      preAssignedItemsKeys.push(item.key);
    }
  });

  Object.keys(seatsSchema).forEach((sectionName, key) => {
    allSections.push({ key, text: sectionName });

    sections[sectionName] = {
      selectedItemsKeys: [],
      preAssignedItemsKeys,
      freeSeats: getSectionFreeSeats(allChangeableSeatsNames[sectionName]['free']),
      unavailableSeatsNames: allChangeableSeatsNames[sectionName]['booked'],
      selectedSeatsNames: []
    };
  });

  return {
    items,
    schema: seatsSchema,
    sections,
    sectionName: (
      allSections.length ?
        allSections[0].text
      : null
    ),
    allSections,
    dataToSave: {
      items: {},
      seats: {}
    }
  };
};

const seatsReducer = (state, { type, payload }) => {
  switch (type) {
    case SET_SECTION_NAME: {
      return {
        ...state,
        sectionName: payload.sectionName
      };
    }
    case SET_SELECTED_ITEMS: {
      const { items, sectionName } = state;

      if (sectionName === null) {
        return state;
      }

      const { preAssignedItemsKeys } = state.sections[sectionName];

      const selectedItemsKeys = [];
      const unavailableSeatsNames = [];
      const selectedSeatsNames = [];

      payload.items.forEach(item => {
        const isNotPreAssigned = preAssignedItemsKeys.indexOf(item.key) === -1;
        const hasValue = item.platePositionNumber !== null;
        const isCurrentSection = item.section === sectionName;

        if (isNotPreAssigned) {
          selectedItemsKeys.push(item.key);
          if (hasValue && isCurrentSection) {
            selectedSeatsNames.push(item.platePositionNumber);
          }
        }
      });

      Object.values(items).forEach(item => {
        const hasValue = item.platePositionNumber !== null;
        const isNotPreAssigned = preAssignedItemsKeys.indexOf(item.key) === -1;
        const isNotSelected = selectedItemsKeys.indexOf(item.key) === -1;
        const isCurrentSection = item.section === sectionName;

        if (hasValue && isNotPreAssigned && isNotSelected && isCurrentSection) {
          unavailableSeatsNames.push(item.platePositionNumber);
        }
      });

      return {
        ...state,
        sections: {
          ...state.sections,
          [sectionName]: {
            ...state.sections[sectionName],
            selectedItemsKeys,
            unavailableSeatsNames,
            selectedSeatsNames
          }
        }
      };
    }
    case SELECT_SEATS: {
      const { items, sectionName, dataToSave } = state;
      const {
        selectedItemsKeys,
        freeSeats: { names: freeSeatsNames },
        selectedSeatsNames
      } = state.sections[sectionName];
      const { seatName } = payload;

      let {
        currentSubSectionId,
        reshapedFreeNames,
        newFreeSeatsNames
      } = getSubSectionFreeSeatsNames(seatName, null, freeSeatsNames);
      let isEndOfFreeSeats = false;

      const newSelectedSeatsNames = selectedSeatsNames.slice();
      let newItems = { ...items };
      let newItemsToSave = { ...dataToSave.items };

      selectedItemsKeys.forEach(selectedItemKey => {
        const item = newItems[selectedItemKey];
        const isEmpty = item.platePositionNumber === null;

        if (isEmpty && !isEndOfFreeSeats) {
          if (!reshapedFreeNames.length) {
            const nextFreeNames = getSubSectionFreeSeatsNames(
              seatName,
              currentSubSectionId,
              freeSeatsNames
            );

            if (nextFreeNames.currentSubSectionId === currentSubSectionId) {
              isEndOfFreeSeats = true;
              return;
            }

            currentSubSectionId = nextFreeNames.currentSubSectionId;
            reshapedFreeNames = nextFreeNames.reshapedFreeNames;
            newFreeSeatsNames = {
              ...newFreeSeatsNames,
              ...nextFreeNames.newFreeSeatsNames
            };
          }
          const freeSeatName = reshapedFreeNames.shift();

          newFreeSeatsNames[currentSubSectionId].splice(
            newFreeSeatsNames[currentSubSectionId].indexOf(freeSeatName),
            1
          );
          newSelectedSeatsNames.push(freeSeatName);

          newItems = {
            ...newItems,
            [selectedItemKey]: {
              ...newItems[selectedItemKey],
              platePositionNumber: freeSeatName,
              section: sectionName
            }
          };
          newItemsToSave = {
            ...newItemsToSave,
            [item.key]: freeSeatName
          };
        }
      });

      return {
        ...state,
        items: newItems,
        sections: {
          ...state.sections,
          [sectionName]: {
            ...state.sections[sectionName],
            freeSeats: {
              ...state.sections[sectionName].freeSeats,
              names: {
                ...state.sections[sectionName].freeSeats.names,
                ...newFreeSeatsNames
              }
            },
            selectedSeatsNames: newSelectedSeatsNames
          }
        },
        dataToSave: {
          ...dataToSave,
          items: {
            ...dataToSave.items,
            ...newItemsToSave
          },
          seats: {
            ...dataToSave.seats,
            ...getSelectedSeatsToSave(
              newSelectedSeatsNames,
              state.schema[sectionName],
              'booked'
            )
          }
        }
      };
    }
    case DESELECT_SEATS: {
      const { items, sectionName, dataToSave } = state;
      const {
        freeSeats: { names: freeSeatsNames, order },
        selectedSeatsNames
      } = state.sections[sectionName];
      const { seatName } = payload;
      const currentSubSectionId = seatName.split('-')[0];
      const currentFreeSeatsNames = freeSeatsNames[currentSubSectionId];

      const item = Object.values(items).find(
        item => item.platePositionNumber === seatName && item.section === sectionName
      );
      const newFreeSeatsNames = currentFreeSeatsNames.slice();
      const newSelectedSeatsNames = selectedSeatsNames.slice();

      newFreeSeatsNames.push(seatName);
      newFreeSeatsNames.sort((a, b) => order[a] - order[b]);
      newSelectedSeatsNames.splice(newSelectedSeatsNames.indexOf(seatName), 1);

      return {
        ...state,
        items: {
          ...items,
          [item.key]: {
            ...item,
            platePositionNumber: null,
            section: null
          }
        },
        sections: {
          ...state.sections,
          [sectionName]: {
            ...state.sections[sectionName],
            freeSeats: {
              ...state.sections[sectionName].freeSeats,
              names: {
                ...state.sections[sectionName].freeSeats.names,
                [currentSubSectionId]: newFreeSeatsNames
              }
            },
            selectedSeatsNames: newSelectedSeatsNames
          }
        },
        dataToSave: {
          ...dataToSave,
          items: {
            ...dataToSave.items,
            [item.key]: null
          },
          seats: {
            ...dataToSave.seats,
            ...getSelectedSeatsToSave(
              [seatName],
              state.schema[sectionName],
              'free'
            )
          }
        }
      };
    }
    case RESET_DATA_TO_SAVE: {
      return {
        ...state,
        dataToSave: {
          items: {},
          seats: {}
        }
      };
    }
    default:
      return state;
  }
};

const useSeatsReducer = (initialState) => {
  const [
    { items, schema, sections, sectionName, allSections, dataToSave },
    dispatch
  ] = useReducer(seatsReducer, initialState, init);
console.group("useSeatsReducer")
console.log('schema', schema)
console.log('sections', sections)
console.log('sectionName', sectionName)
console.log('dataToSave', dataToSave)
console.groupEnd()
  const setSectionName = sectionName => {
    dispatch({ type: SET_SECTION_NAME, payload: { sectionName } });
  };

  const setSelectedItems = items => {
    dispatch({ type: SET_SELECTED_ITEMS, payload: { items } });
  };

  const selectSeats = seatName => {
    dispatch({ type: SELECT_SEATS, payload: { seatName } });
  };

  const deselectSeats = seatName => {
    dispatch({ type: DESELECT_SEATS, payload: { seatName } });
  };

  const resetDataToSave = () => {
    dispatch({ type: RESET_DATA_TO_SAVE });
  };

  return [
    {
      items: Object.values(items),
      schemaSection: sectionName ? schema[sectionName] : null,
      stateSection: sectionName ? sections[sectionName] : null,
      sectionName,
      allSections,
      dataToSave
    },
    setSectionName,
    setSelectedItems,
    selectSeats,
    deselectSeats,
    resetDataToSave
  ];
};

export default useSeatsReducer;
