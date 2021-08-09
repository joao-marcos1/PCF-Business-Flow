import * as React from 'react';

import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { mergeStyles } from '@fluentui/react/lib/Styling';

const notificationBarClass = mergeStyles({
  width: 'fit-content',
  margin: '0 auto'
});

const NotificationBar = ({
  type,
  isMultiline,
  text,
  handleOnDismiss
}: {
  type: 'error' | 'warning',
  isMultiline: boolean,
  text: string,
  handleOnDismiss: () => void
}) => (
  <MessageBar
    messageBarType={MessageBarType[type]}
    isMultiline={isMultiline}
    onDismiss={handleOnDismiss}
    dismissButtonAriaLabel="Close"
    className={notificationBarClass}
  >
    {text}
  </MessageBar>
);

export default NotificationBar;
