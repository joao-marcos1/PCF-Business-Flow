import React from 'react';

import { DetailsListItems, DetailsListColumns } from './types';

import {
  DetailsList,
  DetailsListLayoutMode,
  DetailsRow,
  IDetailsListProps,
  IDetailsRowProps,
  IDetailsRowStyles,
  Selection
} from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { getTheme } from '@fluentui/react/lib/Styling';

const theme = getTheme();

interface SeatsDetailsListProps {
  items: DetailsListItems;
  columns: DetailsListColumns;
  selection: Selection;
  sectionName?: string;
}

const SeatsDetailsList = ({
  items,
  columns,
  selection,
  sectionName
}: SeatsDetailsListProps) => {
  const handleRenderRow: IDetailsListProps['onRenderRow'] = (props?: IDetailsRowProps) => {
    const customStyles: Partial<IDetailsRowStyles> = {};

    if (props) {
      if (props.item.section !== null && props.item.section === sectionName) {
        customStyles.root = { backgroundColor: theme.palette.themeLight };
      }
      if (props.item.section !== null && props.item.section !== sectionName) {
        customStyles.root = { backgroundColor: theme.semanticColors.errorBackground };
      }

      return <DetailsRow { ...props as IDetailsRowProps } styles={customStyles} />;
    }

    return null;
  }

  return (
    <div style={{ width: "50%" }}>
      <MarqueeSelection selection={selection}>
        <DetailsList
          items={items}
          columns={columns}
          setKey="set"
          onRenderRow={handleRenderRow}
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
};

export default SeatsDetailsList;
