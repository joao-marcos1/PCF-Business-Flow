import React, { useState } from 'react';

import {
  Props,
  Message,
  SelectedItems,
  DetailsListItems
} from './types';
import NotificationBar from './NotificationBar';

import { Stack } from '@fluentui/react/lib/Stack';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Selection } from '@fluentui/react/lib/DetailsList';
import { mergeStyles } from '@fluentui/react/lib/Styling';

import MainStage from './MainStage';
import SeatsDetailsList from './SeatsDetailsList';

const confirmButtonClass = mergeStyles({
  marginTop: '20px'
});

const SeatsApp = ({
  allItems,
  columns,
  updateItem,
  message
}: Props) => {
console.group('SeatApp');
console.log('allItems :>> ', allItems);

  const [notification, setNotification] = useState<Message>(message);
console.log('notification :>> ', notification);
  const [items, setItems] = useState<DetailsListItems>(allItems);
console.log('items :>> ', items);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>([]);
console.log('selectedItems :>> ', selectedItems);

  const selection: Selection = new Selection({
    onSelectionChanged: () => setSelectedItems(selection.getSelection()),
  });

  const onNotificationDismiss = () => {
    setNotification({ type: null });
  };

  const setField = (key: number, value: string): void => {
    const mapItem = (item: any) => {
      if (item.key === key) {
        return updateItem(item, value);
      }

      return item;
    };

    setItems(items => items.map(mapItem));
    setSelectedItems(selectedItems => selectedItems.map(mapItem));
  };
console.groupEnd();
  return (
    <Stack horizontal={false}>
      <div style={{ width: "50%" }}>
        {notification.type !== null && notification.text &&
          <NotificationBar
            type={notification.type}
            isMultiline={notification.type === 'error'}
            text={notification.text}
            handleOnDismiss={onNotificationDismiss}
          />}
        <PrimaryButton
          text="Confirm"
          // onClick={_alertClicked}
          // allowDisabledFocus
          disabled={true}
          className={confirmButtonClass}
        />
      </div>
      <Stack horizontal>
        <SeatsDetailsList
          items={items}
          columns={columns}
          selection={selection}
        />
        <MainStage
          items={items}
          selectedItems={selectedItems}
          setField={setField}
        />
      </Stack>
    </Stack>
  );
}

export default SeatsApp;
