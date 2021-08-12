import { useState, useEffect } from 'react';

const useFilterItems = (allItems, itemsForFilter, callback) => {
  const [items, setItems] = useState(callback(allItems, itemsForFilter));

  useEffect(() => {
    setItems(callback(allItems, itemsForFilter));
  }, [allItems, itemsForFilter, callback]);

  return [items, setItems];
};

export default useFilterItems;
