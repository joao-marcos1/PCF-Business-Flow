import { useState, useEffect, useRef } from 'react';

const useCalcSpace = (width, height) => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width, height });

  // calculate available space for drawing
  useEffect(() => {
    const newSize = {
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight
    };

    if (newSize.width !== size.width || newSize.height !== size.height) {
      setSize(newSize);
    }
  });

  return [size, ref];
};

export default useCalcSpace;
