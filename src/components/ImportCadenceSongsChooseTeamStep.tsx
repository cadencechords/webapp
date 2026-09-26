import React from 'react';
import useImportableCadenceTeams from '../hooks/api/useImportableCadenceTeams';
import PageLoading from './PageLoading';
import PageTitle from './PageTitle';
import FadeIn from './FadeIn';
import Button from './Button';
import classNames from 'classnames';
import ProfilePicture from './ProfilePicture';
import NoDataMessage from './NoDataMessage';
import Icon from './Icon';
import type { ImportableTeam } from '../types';

type ImportCadenceSongsChooseTeamStepProps = {
  selectedTeam?: ImportableTeam | null;
  setSelectedTeam: (team: ImportableTeam) => void;
  currentStep: number;
  onGoToStep: (step: number) => void;
};

export default function ImportCadenceSongsChooseTeamStep({
  selectedTeam,
  setSelectedTeam,
  currentStep,
  onGoToStep,
}: ImportCadenceSongsChooseTeamStepProps) {
  const { isLoading: isLoadingTeams, data: teams } =
    useImportableCadenceTeams();

  if (currentStep !== 0) {
    return null;
  }

  return (
    <FadeIn>
      <PageTitle title="Which team would you like to import from?" />
      <div className="px-2 text-sm subtext">Step 1 of 2</div>
      {isLoadingTeams && <PageLoading />}
      {teams &&
        (teams.length === 0 ? (
          <NoDataMessage type="teams" />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 mt-4 mb-8 sm:grid-cols-2">
              {teams.map(team => (
                <TeamOption
                  selected={team === selectedTeam}
                  onChange={setSelectedTeam}
                  team={team}
                  key={team.id}
                />
              ))}
            </div>
            <div className="flex-center">
              <Button
                disabled={!selectedTeam}
                className="max-w-md gap-3 flex-center"
                onClick={() => onGoToStep(1)}
                size="medium"
                full={true}
              >
                Choose songs
                <Icon name="arrow_forward" className="w-5 h-5" />
              </Button>
            </div>
          </>
        ))}
    </FadeIn>
  );
}

type TeamOptionProps = {
  team: ImportableTeam;
  selected: boolean;
  onChange: (team: ImportableTeam) => void;
};

function TeamOption({ team, selected, onChange }: TeamOptionProps) {
  return (
    <label
      // React sets the attribute to the id as a string either way.
      id={String(team.id)}
      className={classNames(
        'interactive-card flex items-center relative h-20 ring-offset-0 gap-4 p-2 cursor-pointer rounded-xl',
        selected && 'ring-2 ring-blue-500 dark:ring-dark-blue'
      )}
    >
      <ProfilePicture url={team.image_url} size="xs" />
      {team.name}
      <input
        className="absolute w-0 h-0 opacity-0 cursor-pointer"
        type="radio"
        name="team"
        onChange={() => onChange(team)}
        checked={selected}
      />
      {selected && (
        <Icon
          name="check_circle"
          filled
          className="absolute w-5 h-5 text-blue-500 top-2 right-2 dark:text-dark-blue"
        />
      )}
    </label>
  );
}
