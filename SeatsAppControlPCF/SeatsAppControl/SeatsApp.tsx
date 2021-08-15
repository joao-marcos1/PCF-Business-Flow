import React, { useState } from 'react';

import { Props, Message } from './types';

import useSeatsReducer from './MainStage/utils/useSeatsReducer';
import NotificationBar from './NotificationBar';
import SeatsDetailsList from './SeatsDetailsList';
import MainStage from './MainStage';

import { Stack } from '@fluentui/react/lib/Stack';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Selection } from '@fluentui/react/lib/DetailsList';
import { mergeStyles } from '@fluentui/react/lib/Styling';

const confirmButtonClass = mergeStyles({
  marginTop: '20px'
});

const SeatsApp = ({
  allItems,
  columns,
  seatsSchema,
  freeSeatsIds,
  message
}: Props) => {
console.group('SeatApp');
console.log('allItems :>> ', allItems);
console.log('seatsSchema :>> ', seatsSchema);
console.log('freeSeatsIds :>> ', freeSeatsIds);

  const [notification, setNotification] = useState<Message>(message);
console.log('notification :>> ', notification);
  const [
    { items, unavailableSeatsIds, selectedSeatsIds},
    setSelectedItems,
    selectSeats,
    deselectSeats
  ]: any = useSeatsReducer({ allItems, freeSeatsIds });
console.log('items :>> ', items);
console.log('unavailableSeatsIds :>> ', unavailableSeatsIds);
console.log('selectedSeatsIds :>> ', selectedSeatsIds);

  const selection: Selection = new Selection({
    onSelectionChanged: () => setSelectedItems(selection.getSelection()),
  });

  const onNotificationDismiss = () => {
    setNotification({ type: null });
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
          seatsSchema={seatsSchema}
          items={items}
          unavailableSeatsIds={unavailableSeatsIds}
          selectedSeatsIds={selectedSeatsIds}
          selectSeats={selectSeats}
          deselectSeats={deselectSeats}
        />
      </Stack>
    </Stack>
  );
}

export default SeatsApp;
