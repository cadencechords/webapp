import React, { useState } from 'react';
import {
  useFormatPresets,
  useSetDefaultFormat,
} from '../hooks/api/formatPresets.hooks';
import PageLoading from './PageLoading';
import Alert from './Alert';
import NoDataMessage from './NoDataMessage';
import FormatPreview from './FormatPreview';
import Button from './Button';
import { EDIT_TEAM } from '../utils/constants';
import type { CurrentMember } from '../store/authSlice';
import type { FormatPreset } from '../types';

type FormatPresetsProps = {
  /** The team's default preset, if it has one. */
  defaultFormatPreset?: FormatPreset | null;
  currentMember: CurrentMember;
};

export default function FormatPresets({
  defaultFormatPreset,
  currentMember,
}: FormatPresetsProps) {
  const [selectedFormatPreset, setSelectedFormatPreset] = useState<
    FormatPreset | null | undefined
  >(defaultFormatPreset);
  const { data: formatPresets, error } = useFormatPresets();
  const { run: setDefaultFormat, isLoading: isSaving } = useSetDefaultFormat();
  const canEditTeam = currentMember.can(EDIT_TEAM);

  if (formatPresets) {
    return (
      <div className="w-full">
        <div className="text-lg font-semibold flex-between section-border">
          Format presets
          {selectedFormatPreset?.id !== defaultFormatPreset?.id && (
            <Button
              size="xs"
              loading={isSaving}
              onClick={() => setDefaultFormat(selectedFormatPreset)}
            >
              Save changes
            </Button>
          )}
        </div>
        {formatPresets.length === 0 ? (
          <NoDataMessage type="format presets" />
        ) : (
          <div className="flex gap-4 p-4 overflow-x-auto flex-nowrap">
            {formatPresets.map(formatPreset => (
              <FormatPreview
                key={formatPreset.id}
                format={formatPreset}
                onChange={setSelectedFormatPreset}
                selected={formatPreset.id === selectedFormatPreset?.id}
                disabled={!canEditTeam}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="red">
        There was an issue retrieving your format presets.
      </Alert>
    );
  }

  return <PageLoading />;
}
