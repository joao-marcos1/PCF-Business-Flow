import * as React from 'react';

import {
  DetailsListItem,
  DetailsListColumn,
  UpdateDetailsListItem,
  Message
} from './types';
import NotificationBar from './NotificationBar';

import { Stack } from '@fluentui/react/lib/Stack';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import {
  DetailsList, DetailsListLayoutMode,
  Selection,
  IColumn, IObjectWithKey
} from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { mergeStyles } from '@fluentui/react/lib/Styling';

import MainStage from './MainStage';

const confirmButtonClass = mergeStyles({
  marginTop: '20px'
});

interface DetailsListState {
  items: DetailsListItem[];
  selectedItems: IObjectWithKey[];
  message: Message;
}

class SeatsDetailsList extends React.Component<{}, DetailsListState> {
  private _selection: Selection;
  private _columns: IColumn[];
  private _updateItem: UpdateDetailsListItem;

  constructor(props: any) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectedItems: this._getSelectedItems() }),
    });
console.log('props.allItems :>> ', props.allItems);
    this._columns = props.columns;
    this._updateItem = props.updateItem;

    this.state = {
      items: props.allItems,
      selectedItems: this._getSelectedItems(),
      message: props.message
    };
  }

  public render(): JSX.Element {
    const { items, selectedItems, message } = this.state;
console.group('render');
console.log('items :>> ', items);
console.log('selectedItems :>> ', selectedItems);
console.groupEnd();
    return (
      <Stack horizontal>
        <div style={{ width: "50%" }}>
          {message.type !== null && message.text &&
            <NotificationBar
              type={message.type}
              isMultiline={message.type === 'error'}
              text={message.text}
              handleOnDismiss={this._onWarningDismiss}
            />}
          <PrimaryButton
            text="Confirm"
            // onClick={_alertClicked}
            // allowDisabledFocus
            disabled={true}
            className={confirmButtonClass}
          />
          <MarqueeSelection selection={this._selection}>
            <DetailsList
              items={items}
              columns={this._columns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selection={this._selection}
              selectionPreservedOnEmptyClick={true}
              ariaLabelForSelectionColumn="Toggle selection"
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              checkButtonAriaLabel="select row"
            />
          </MarqueeSelection>
        </div>
        <MainStage
          items={items}
          selectedItems={selectedItems}
          setField={this._setField}
        />
      </Stack>
    );
  }

  private _getSelectedItems = () => this._selection.getSelection();

  private _setField = (key: number, value: string): void => this.setState(({ items, selectedItems }) => {
    const mapItem = (item: any) => {
      if (item.key === key) {
        return this._updateItem(item, value);
      }

      return item;
    };

    return {
      items: items.map(mapItem),
      selectedItems: selectedItems.map(mapItem)
    }
  });

  private _onWarningDismiss = () => {
    this.setState({ message: { type: null } });
  };
}

export default SeatsDetailsList;
