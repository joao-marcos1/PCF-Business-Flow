export type DetailsListItem = {
  key: number;
  sampleTrackerNumber: string;
  platePositionNumber: string | null;
  binLocation: string;
};

export type DetailsListColumn = {
  key: string;
  name: string;
  fieldName: string;
};

export type UpdateDetailsListItem = (item: DetailsListItem, value: string) => DetailsListItem;

export type Message = {
  type: 'error' | 'warning' | null;
  text?: string;
};
