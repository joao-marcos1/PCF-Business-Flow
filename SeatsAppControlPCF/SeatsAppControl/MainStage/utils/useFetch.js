import { useState, useEffect } from "react";

import json from './seats-data.js';

const useFetch = url => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(json);
    // fetch(url)
    //   .then(res => res.json())
    //   .then(data => setData(data));
  }, [url]);

  return data;
};

export default useFetch;
