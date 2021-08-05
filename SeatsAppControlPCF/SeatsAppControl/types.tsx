export type DetailsListItem = {
  // key: number;
  sampleTrackerNumber: string;
  platePositionNumber: string | null;
  // zoneLocation: string;
  binLocation: string;
};

export type Column = {
  key: string;
  name: string;
  fieldName: string;
};

export type MappedItem = {
  binLocation: string;
};

export type MapSelectedItems = (item: any) => MappedItem;
