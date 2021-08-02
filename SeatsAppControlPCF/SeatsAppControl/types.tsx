export type DetailsListItem = {
  // key: number;
  sampleTrackerNumber: string;
  platePositionNumber: string | null;
  zoneLocation: string | null;
  binLocation: string | null;
};

export type Column = {
  key: string;
  name: string;
  fieldName: string;
};
