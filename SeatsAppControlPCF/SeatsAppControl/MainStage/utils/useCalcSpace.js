import { useState, useEffect, useRef } from 'react';

const useCalcSpace = (width, height) => {
  const ref = useRef(null);
console.group("useCalcSpace")
console.log(`width`, width)
console.log(`height`, height)
console.groupEnd()
  const [size, setSize] = useState({ width, height });
console.log(`size`, size)
console.groupEnd()

  // calculate available space for drawing
  useEffect(() => {
console.group("useCalcSpace useEffect")
    const newSize = {
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight
    };
console.log(`size`, size)
console.log(`newSize`, newSize)
    if (newSize.width !== size.width || newSize.height !== size.height) {
      setSize(newSize);
    }
  });

  return [size, ref];
};

export default useCalcSpace;
