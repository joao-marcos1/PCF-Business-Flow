interface DetailsListItem {
  key: number;
  sampleTrackerNumber: string;
  platePositionNumber: string | null;
};

export type DetailsListItems = DetailsListItem[];

interface DetailsListColumn {
  key: string;
  name: string;
  fieldName: string;
  minWidth: number;
  maxWidth: number;
  isResizable: boolean;
};

export type DetailsListColumns = DetailsListColumn[];

export interface Message {
  type: 'error' | 'warning' | null;
  text?: string;
};

export interface Props {
  allItems: DetailsListItems;
  columns: DetailsListColumns;
  seatsSchema: {};
  allFreeSeatsIds: string[];
  message: Message
};
