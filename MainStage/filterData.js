const filterData = data => {
  let rowArray = [];

  if (!data) {
    return rowArray;
  }

  data.forEach(section => {
    section.subsections.forEach(({ seats_by_rows }) => {
        Object.keys(seats_by_rows).forEach(key => {
            const seats = seats_by_rows[key];

            seats.forEach(seat => {
              if (seat.status === "free") {
                rowArray.push(seat.name);
              }
            });
        })
    })
  })

  return rowArray;
};

export default filterData;
