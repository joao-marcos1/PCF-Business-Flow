import React, { useEffect, useRef } from 'react';

const isClickedInside = (e, element) => {
  let node = e.target;
  while (node) {
    if (node === element) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

const Popup = ({
  position,
  seatName,
  number,
  isFree,
  isSelected,
  onClose
}) => {
  const containerRef = useRef(null);
  const clickLine = isFree ?
    'Click on the seat to select'
  : isSelected ?
    'Click on the seat to deselect'
  : 'Unavailable';

  useEffect(() => {
    const onClick = e => {
      if (!isClickedInside(e, containerRef.current)) {
        onClose();
      }
    };
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: position.y + 20 + "px",
        left: position.x + 20 + "px",
        padding: "10px",
        borderRadius: "3px",
        boxShadow: "0 0 5px grey",
        zIndex: 10,
        backgroundColor: "white"
      }}
    >
      <div>Seat {seatName}</div>
      {number ?
        <div>{number}</div>
      : null}
      <div>{clickLine}</div>
    </div>
  );
};

export default Popup;
