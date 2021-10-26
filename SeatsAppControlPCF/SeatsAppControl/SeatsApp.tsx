import React, { useState } from 'react';

import { Props, Message } from './types';

import useSeatsReducer from './MainStage/utils/useSeatsReducer';
import NotificationBar from './NotificationBar';
import SeatsDetailsList from './SeatsDetailsList';
import MainStage from './MainStage';

import { Stack } from '@fluentui/react/lib/Stack';
import { Overlay } from '@fluentui/react/lib/Overlay';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Selection } from '@fluentui/react/lib/DetailsList';
import { mergeStyles } from '@fluentui/react/lib/Styling';

const panelClass = mergeStyles({
  padding: '20px 20px 0'
});
const spinnerClass = mergeStyles({
  marginTop: '20vh'
});

const SeatsApp = ({
  allItems,
  columns,
  seatsSchema,
  allChangeableSeatsNames,
  message,
  saveData
}: Props) => {
console.group("SeatsApp params")
console.log('seatsSchema', seatsSchema)
  const [notification, setNotification] = useState<Message>(message);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [
    {
      items,
      schemaSection,
      stateSection,
      sectionName,
      allSections,
      dataToSave
    },
    setSectionName,
    setSelectedItems,
    selectSeats,
    deselectSeats,
    resetDataToSave
  ]: any = useSeatsReducer({ allItems, seatsSchema, allChangeableSeatsNames });
  const [sectionKey, setSectionKey] = useState(allSections[0]?.key);
console.log('items', items)
console.log('schemaSection', schemaSection)
console.log('stateSection', stateSection)
console.log('sectionName', sectionName)
console.log('dataToSave', dataToSave)
console.groupEnd()
  const [selection]: any = useState(new Selection({
    onSelectionChanged: () => setSelectedItems(selection.getSelection()),
  }));

  const onNotificationDismiss = () => {
    setNotification({ type: null });
  };
  const handleSectionChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
console.group('handleSectionChange');
console.log('option :>> ', option);
console.log('sectionKey :>> ', sectionKey);
console.groupEnd();
    if (option?.key !== sectionKey) {
      setSectionKey(option?.key);
      setSectionName(option?.text || null);
      setSelectedItems([]);
      selection.setAllSelected(false);
    }
  };

  const handleConfirmClick = async () => {
    setIsSaving(true);
    onNotificationDismiss();

    try {
      await saveData(dataToSave);
      resetDataToSave();
    } catch (error) {
      setNotification(error as Message);
    }

    setIsSaving(false);
  };

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
        <Stack
          horizontal
          horizontalAlign='space-between'
          className={panelClass}
        >
          <PrimaryButton
            text='Confirm'
            onClick={handleConfirmClick}
            disabled={(
              !Object.keys(dataToSave.items).length ||
              !Object.keys(dataToSave.seats).length
            )}
          />
          <Dropdown
            selectedKey={sectionKey}
            onChange={handleSectionChange}
            placeholder='Select a section'
            options={allSections}
            disabled={!sectionName}
          />
        </Stack>
      </div>
      <Stack horizontal>
        <SeatsDetailsList
          items={items}
          columns={columns}
          selection={selection}
          sectionName={sectionName}
        />
        {sectionName ?
          <MainStage
            schema={[schemaSection]}
            items={items}
            sectionName={sectionName}
            state={stateSection}
            selectSeats={selectSeats}
            deselectSeats={deselectSeats}
          />
        : null}
      </Stack>
      {isSaving && (
        <Overlay isDarkThemed={true}>
          <Spinner
            size={SpinnerSize.large}
            className={spinnerClass}
          />
        </Overlay>
      )}
    </Stack>
  );
};

export default SeatsApp;
