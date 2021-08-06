import * as React from 'react';

import { DetailsListItem, DetailsListColumn, UpdateDetailsListItem } from './types';

import { Announced } from '@fluentui/react/lib/Announced';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import {
  DetailsList, DetailsListLayoutMode,
  Selection,
  IColumn, IObjectWithKey
} from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { Text } from '@fluentui/react/lib/Text';

import MainStage from './MainStage';

const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px',
});

const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

interface DetailsListState {
  items: DetailsListItem[];
  selectedItems: IObjectWithKey[];
}

class SeatsDetailsList extends React.Component<{}, DetailsListState> {
  private _selection: Selection;
  private _allItems: DetailsListItem[];
  private _columns: IColumn[];
  private _updateItem: UpdateDetailsListItem;

  constructor(props: any) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectedItems: this._getSelectedItems() }),
    });
console.log('props.allItems :>> ', props.allItems);
    this._allItems = props.allItems;
    this._initColumns(props.columns);
    this._updateItem = props.updateItem;

    this.state = {
      items: this._allItems,
      selectedItems: this._getSelectedItems()
    };
  }

  public render(): JSX.Element {
    const { items, selectedItems } = this.state;
console.group('render');
console.log('items :>> ', items);
console.log('selectedItems :>> ', selectedItems);
console.groupEnd();
    return (
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%" }}>
          {/* <div className={exampleChildClass}>{selectedItems}</div>
          <Text>
            Note: While focusing a row, pressing enter or double clicking will execute onItemInvoked, which in this
            example will show an alert.
          </Text>
          <Announced message={selectedItems} /> */}
          <TextField
            className={exampleChildClass}
            label="Filter by name:"
            // onChange={this._onFilter}
            styles={textFieldStyles}
          />
          {/* <Announced message={`Number of items after filter applied: ${items.length}.`} /> */}
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
      {selectedItems.length ?
        <MainStage
          items={selectedItems}
          setField={this._setField}
        />
      : null}
      </div>
    );
  }

  private _getSelectedItems = () => this._selection.getSelection();

  // private _onFilter = (
  //   ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  //   text?: string | undefined
  // ): void => {
  //   this.setState({
  //     items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems,
  //   });
  // };

  private _initColumns = (columns: DetailsListColumn[]): void => {
    this._columns = columns.map(({ key, name, fieldName }) => ({
      key,
      name,
      fieldName,
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    }));
  }

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
}

export default SeatsDetailsList;
