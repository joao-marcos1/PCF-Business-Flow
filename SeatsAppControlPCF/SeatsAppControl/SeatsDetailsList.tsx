import React from 'react';

import { DetailsListItems, DetailsListColumns } from './types';

import {
  DetailsList,
  DetailsListLayoutMode,
  Selection
} from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';

interface SeatsDetailsListProps {
  items: DetailsListItems;
  columns: DetailsListColumns;
  selection: Selection;
}

const SeatsDetailsList = ({
  items,
  columns,
  selection
}: SeatsDetailsListProps) => (
  <div style={{ width: "50%" }}>
    <MarqueeSelection selection={selection}>
      <DetailsList
        items={items}
        columns={columns}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selection={selection}
        selectionPreservedOnEmptyClick={true}
        ariaLabelForSelectionColumn="Toggle selection"
        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
        checkButtonAriaLabel="select row"
      />
    </MarqueeSelection>
  </div>
);

export default SeatsDetailsList;
