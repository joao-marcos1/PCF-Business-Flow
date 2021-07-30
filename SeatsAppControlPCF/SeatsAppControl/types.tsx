export type DetailsListItem = {
  // key: number;
  sampleTrackerNumber: string;
  platePositionNumber: string;
  zoneLocation: string;
  binLocation: string | null;
};

export type Column = {
  key: string;
  name: string;
  fieldName: string;
};
