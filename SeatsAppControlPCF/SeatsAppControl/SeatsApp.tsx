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
  allFreeSeatsIds,
  message
}: Props) => {
console.group('SeatApp');
console.log('allItems :>> ', allItems);
console.log('seatsSchema :>> ', seatsSchema);
console.log('allFreeSeatsIds :>> ', allFreeSeatsIds);

  const isSeatsSchema = Boolean(Object.keys(seatsSchema).length);
  const [notification, setNotification] = useState<Message>(message);
console.log('notification :>> ', notification);
  const [
    { items, freeSeatsIds, unavailableSeatsIds, selectedSeatsIds},
    setSelectedItems,
    selectSeats,
    deselectSeats
  ]: any = useSeatsReducer({ allItems, allFreeSeatsIds });
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
        {isSeatsSchema ?
          <MainStage
            seatsSchema={seatsSchema}
            items={items}
            freeSeatsIds={freeSeatsIds}
            unavailableSeatsIds={unavailableSeatsIds}
            selectedSeatsIds={selectedSeatsIds}
            selectSeats={selectSeats}
            deselectSeats={deselectSeats}
          />
        : null}
      </Stack>
    </Stack>
  );
}

export default SeatsApp;
