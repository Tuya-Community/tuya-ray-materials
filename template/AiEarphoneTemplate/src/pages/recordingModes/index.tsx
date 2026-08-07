import React from 'react';
import RecordingModes from '@/components/RecordingModes';
import BenefitRestrictedDialog from '@/components/BenefitRestrictedDialog';

const RecordingModesPage = (props: any) => (
  <>
    <RecordingModes {...props} />
    <BenefitRestrictedDialog />
  </>
);

export default RecordingModesPage;
