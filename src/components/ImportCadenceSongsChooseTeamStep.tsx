import useImportableCadenceTeams from '../hooks/api/useImportableCadenceTeams';
import PageLoading from './PageLoading';
import ImportStepHeader from './ImportStepHeader';
import { LIST_ITEM, LIST_ITEM_INTERACTIVE } from './lists/listItem';
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
  // `data` is [] until the teams load, so the list waits for isSuccess.
  const {
    isLoading: isLoadingTeams,
    isSuccess: hasTeams,
    data: teams,
  } = useImportableCadenceTeams();

  if (currentStep !== 0) {
    return null;
  }

  return (
    <FadeIn>
      <ImportStepHeader
        step="Step 1 of 2"
        title="Choose a team"
        subtitle="Import songs from another Mezzo team you're on."
      />
      {isLoadingTeams && <PageLoading />}
      {hasTeams &&
        (teams.length === 0 ? (
          <NoDataMessage type="teams" />
        ) : (
          <>
            <div role="radiogroup" className="mb-6 list-segmented">
              {teams.map(team => (
                <TeamOption
                  selected={team === selectedTeam}
                  onChange={setSelectedTeam}
                  team={team}
                  key={team.id}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                disabled={!selectedTeam}
                className="w-full gap-2 flex-center sm:w-auto"
                onClick={() => onGoToStep(1)}
                size="md"
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

/** A team as a selectable row: primary-container with a check when chosen.
    The radio stays in the DOM (hidden), so the row is a real radio. */
function TeamOption({ team, selected, onChange }: TeamOptionProps) {
  return (
    <label
      // React sets the attribute to the id as a string either way.
      id={String(team.id)}
      className={classNames(
        LIST_ITEM,
        LIST_ITEM_INTERACTIVE,
        'cursor-pointer has-focus-visible:outline-3 has-focus-visible:outline-solid has-focus-visible:outline-secondary has-focus-visible:-outline-offset-3',
        selected && 'bg-primary-container text-on-primary-container'
      )}
    >
      <input
        className="sr-only"
        type="radio"
        name="team"
        onChange={() => onChange(team)}
        checked={selected}
      />
      <ProfilePicture url={team.image_url} name={team.name} size="md" />
      <span className="flex-1 min-w-0 truncate">{team.name}</span>
      {selected && (
        <Icon name="check_circle" filled className="w-6 h-6 shrink-0" />
      )}
    </label>
  );
}
