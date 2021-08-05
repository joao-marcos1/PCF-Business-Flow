import * as React from 'react';

import { DetailsListItem, Column, MappedItem, MapSelectedItems } from './types';

import { Announced } from '@fluentui/react/lib/Announced';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn } from '@fluentui/react/lib/DetailsList';
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
  selectedItems: MappedItem[];
  // invockedItem: string;
}

class SeatsDetailsList extends React.Component<{}, DetailsListState> {
  private _selection: Selection;
  private _allItems: DetailsListItem[];
  private _columns: IColumn[];
  private _mapSelectedItems: MapSelectedItems;

  constructor(props: any) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectedItems: this._getSelectedItems() }),
    });
console.log('props.allItems :>> ', props.allItems);
    // Populate with items for demos.
    this._allItems = props.allItems;
    this._initColumns(props.columns);
    this._mapSelectedItems = props.mapSelectedItems;

    this.state = {
      items: this._allItems,
      selectedItems: this._getSelectedItems(),
      // invockedItem: '',
    };
  }

  public render(): JSX.Element {
    const { items, selectedItems/*, invockedItem*/ } = this.state;

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
              // onItemInvoked={this._onItemInvoked}
            />
          </MarqueeSelection>
        </div>
      {selectedItems.length && <MainStage items={selectedItems} />}
      </div>
    );
  }

  private _getSelectedItems = (): MappedItem[] => this._selection.getSelection().map(this._mapSelectedItems);

  // private _onFilter = (
  //   ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  //   text?: string | undefined
  // ): void => {
  //   this.setState({
  //     items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems,
  //   });
  // };

  private _onItemInvoked = (item: DetailsListItem): void => {
    // console.log(`Item invoked: ${item.name}`);
    // this.setState({ invockedItem: item.sampleTrackerNumber });
  };

  private _initColumns = (columns: Column[]) => {
    this._columns = columns.map(({ key, name, fieldName }) => ({
      key,
      name,
      fieldName,
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    }));
  }
}

export default SeatsDetailsList;
