import { IObjectWithKey } from "@fluentui/react/lib/Utilities";

export interface DetailsListItem {
  key: number;
  sampleTrackerNumber: string;
  platePositionNumber: string | null;
  binLocation: string;
};

export type DetailsListItems = DetailsListItem[];

export interface DetailsListColumn {
  key: string;
  name: string;
  fieldName: string;
  minWidth: number;
  maxWidth: number;
  isResizable: boolean;
};

export type DetailsListColumns = DetailsListColumn[];

export type FreeSeatsIds = string[];

export type UpdateDetailsListItem = (item: DetailsListItem, value: string) => DetailsListItem;

export interface Message {
  type: 'error' | 'warning' | null;
  text?: string;
};

export interface Props {
  allItems: DetailsListItems;
  columns: DetailsListColumns;
  seatsSchema: {};
  freeSeatsIds: FreeSeatsIds;
  updateItem: UpdateDetailsListItem;
  message: Message
};

export type SelectedItems = IObjectWithKey[];
