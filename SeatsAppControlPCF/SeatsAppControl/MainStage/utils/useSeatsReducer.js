import { useReducer } from 'react';

const SET_SELECTED_ITEMS = 'SET_SELECTED_ITEMS';
const SELECT_SEATS = 'SELECT_SEATS';
const DESELECT_SEATS = 'DESELECT_SEATS';

const init = ({ allItems, freeSeatsIds }) => {
  const items = {};
  const preAssignedItemsKeys = [];
  const freeSeatsOrder = {};

  allItems.forEach(item => {
    items[item.key] = item;
    if (item.platePositionNumber !== null) {
      preAssignedItemsKeys.push(item.key);
    }
  });
  freeSeatsIds.forEach((id, index) => {
    freeSeatsOrder[id] = index;
  });

  return {
    items,
    selectedItemsKeys: [],
    preAssignedItemsKeys,
    freeSeats: {
      ids: freeSeatsIds,
      order: freeSeatsOrder
    },
    unavailableSeatsIds: [],
    selectedSeatsIds: []
  };
};

const seatsReducer = (state, { type, payload }) => {
  switch (type) {
    case SET_SELECTED_ITEMS: {
      const { items, preAssignedItemsKeys } = state;
      const selectedItemsKeys = [];
      const unavailableSeatsIds = [];
      const selectedSeatsIds = [];
console.group("SET_SELECTED_ITEMS")
console.log(`payload`, payload)
      payload.items.forEach(item => {
        const isNotPreAssigned = preAssignedItemsKeys.indexOf(item.key) === -1;
        const hasValue = item.platePositionNumber !== null;

        if (isNotPreAssigned) {
          selectedItemsKeys.push(item.key);
          if (hasValue) {
            selectedSeatsIds.push(item.platePositionNumber);
          }
        }
      });
console.log(`selectedItemsKeys`, selectedItemsKeys)
console.log(`selectedSeatsIds`, selectedSeatsIds)
      Object.values(items).forEach(item => {
        const hasValue = item.platePositionNumber !== null;
        const isNotPreAssigned = preAssignedItemsKeys.indexOf(item.key) === -1;
        const isNotSelected = selectedItemsKeys.indexOf(item.key) === -1;

        if (hasValue && isNotPreAssigned && isNotSelected) {
          unavailableSeatsIds.push(item.platePositionNumber);
        }
      });
console.log(`unavailableSeatsIds`, unavailableSeatsIds)
console.groupEnd()
      return {
        ...state,
        selectedItemsKeys,
        unavailableSeatsIds,
        selectedSeatsIds
      };
    }
    case SELECT_SEATS: {
console.group("SELECT_SEATS")
console.log(`payload`, payload)
      const {
        items,
        selectedItemsKeys,
        freeSeats: { ids: freeSeatsIds },
        selectedSeatsIds
      } = state;
      const freeSeatIdStart = freeSeatsIds.findIndex(seatId => seatId === payload.seatId);
      const reshapedFreeIds = freeSeatsIds.slice(freeSeatIdStart).concat(freeSeatsIds.slice(0, freeSeatIdStart));
      const newFreeSeatIds = freeSeatsIds.slice();
      const newSelectedSeatsIds = selectedSeatsIds.slice();
      let newItems = { ...items };

      selectedItemsKeys.forEach(selectedItemKey => {
        const item = newItems[selectedItemKey];
        const isEmpty = item.platePositionNumber === null;

        if (isEmpty && reshapedFreeIds.length) {
          const freeSeatId = reshapedFreeIds.shift();

          newFreeSeatIds.splice(newFreeSeatIds.indexOf(freeSeatId), 1);
          newSelectedSeatsIds.push(freeSeatId);

          newItems = {
            ...newItems,
            [selectedItemKey]: {
              ...newItems[selectedItemKey],
              platePositionNumber: freeSeatId
            }
          };
        }
      });
console.log(`newItems`, newItems)
console.log(`newFreeSeatIds`, newFreeSeatIds)
console.log(`newSelectedSeatsIds`, newSelectedSeatsIds)
console.groupEnd()
      return {
        ...state,
        items: newItems,
        freeSeats: {
          ...state.freeSeats,
          ids: newFreeSeatIds
        },
        selectedSeatsIds: newSelectedSeatsIds
      };
    }
    case DESELECT_SEATS: {
console.group("DESELECT_SEATS")
console.log(`payload`, payload)
      const { seatId } = payload;
      const {
        items,
        freeSeats: { ids: freeSeatsIds, order },
        selectedSeatsIds
      } = state;
      const item = Object.values(items).find(item => item.platePositionNumber === seatId);
      const newFreeSeatIds = freeSeatsIds.slice();
      const newSelectedSeatsIds = selectedSeatsIds.slice();

      newFreeSeatIds.push(seatId);
      newFreeSeatIds.sort((a, b) => order[a] - order[b]);
      newSelectedSeatsIds.splice(newSelectedSeatsIds.indexOf(seatId), 1);
console.log(`item`, item)
console.log(`newFreeSeatIds`, newFreeSeatIds)
console.log(`newSelectedSeatsIds`, newSelectedSeatsIds)
console.groupEnd()
      return {
        ...state,
        items: {
          ...items,
          [item.key]: {
            ...item,
            platePositionNumber: null
          }
        },
        freeSeats: {
          ...state.freeSeats,
          ids: newFreeSeatIds
        },
        selectedSeatsIds: newSelectedSeatsIds
      };
    }
    default:
      return state;
  }
};

const useSeatsReducer = (initialState) => {
  const [
    { items, unavailableSeatsIds, selectedSeatsIds },
    dispatch
  ] = useReducer(seatsReducer, initialState, init);

  const setSelectedItems = items => {
console.group("setSelectedItems action")
console.log(`items`, items)
console.groupEnd()
    dispatch({ type: SET_SELECTED_ITEMS, payload: { items } })
  };

  const selectSeats = seatId => {
console.group("selectSeats action")
console.log(`seatId`, seatId)
console.groupEnd()
    dispatch({ type: SELECT_SEATS, payload: { seatId } });
  };

  const deselectSeats = seatId => {
console.group("deselectSeats action")
console.log(`seatId`, seatId)
console.groupEnd()
    dispatch({ type: DESELECT_SEATS, payload: { seatId } });
  };

  return [
    {
      items: Object.values(items),
      unavailableSeatsIds,
      selectedSeatsIds
    },
    setSelectedItems,
    selectSeats,
    deselectSeats
  ];
};

export default useSeatsReducer;
