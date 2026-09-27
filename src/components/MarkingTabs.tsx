import React from 'react';
import { markingTabs } from '../utils/constants';
import { PrimaryTab, PrimaryTabs } from './tabs/PrimaryTabs';

// The marking categories; the Tab.Group around them tracks the selection.
export default function MarkingTabs() {
  return (
    <PrimaryTabs className="mb-4">
      {markingTabs.map(tab => (
        <PrimaryTab key={tab}>{tab}</PrimaryTab>
      ))}
    </PrimaryTabs>
  );
}
