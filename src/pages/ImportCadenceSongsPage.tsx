import { useState } from 'react';
import Button, { buttonClasses } from '../components/Button';
import { pluralize } from '../utils/StringUtils';
import FadeIn from '../components/FadeIn';
import { Link } from 'react-router-dom';
import ImportCadenceSongsChooseTeamStep from '../components/ImportCadenceSongsChooseTeamStep';
import ImportCadenceSongsChooseSongsStep from '../components/ImportCadenceSongsChooseSongsStep';
import Icon from '../components/Icon';
import type { ImportableTeam, Song } from '../types';

export default function ImportCadenceSongsPage() {
  const [selectedTeam, setSelectedTeam] = useState<ImportableTeam | null>();
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  function handleToggleSong(isChecked: boolean, song: Song) {
    if (isChecked) {
      setSelectedSongs([...selectedSongs, song]);
    } else {
      setSelectedSongs(selectedSongs.filter(s => s !== song));
    }
  }

  function handleStartOver() {
    setSelectedSongs([]);
    setSelectedTeam(null);
    setCurrentStep(0);
  }

  function handleChooseTeam(team: ImportableTeam) {
    setSelectedTeam(team);
    setSelectedSongs([]);
  }

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <ImportCadenceSongsChooseTeamStep
        selectedTeam={selectedTeam}
        setSelectedTeam={handleChooseTeam}
        currentStep={currentStep}
        onGoToStep={setCurrentStep}
      />
      <ImportCadenceSongsChooseSongsStep
        selectedTeam={selectedTeam}
        selectedSongs={selectedSongs}
        currentStep={currentStep}
        onGoToStep={setCurrentStep}
        onToggleSong={handleToggleSong}
      />
      <ResultStep
        currentStep={currentStep}
        imported={selectedSongs.length}
        onStartOver={handleStartOver}
      />
    </div>
  );
}

type ResultStepProps = {
  currentStep: number;
  /** How many songs were imported. */
  imported: number;
  onStartOver: () => void;
};

function ResultStep({ currentStep, imported, onStartOver }: ResultStepProps) {
  if (currentStep !== 2) {
    return null;
  }

  // A card confirming the import, with a tonal Import more and a filled View
  // songs link.
  return (
    <FadeIn>
      <section className="flex flex-col items-center gap-2 px-6 py-10 text-center rounded-extra-large-increased bg-surface-container-low text-on-surface font-plain">
        <span className="mb-2 w-16 h-16 flex-center rounded-full bg-primary-container text-on-primary-container">
          <Icon name="check" className="w-8 h-8" />
        </span>
        <h1 className="text-headline-small-emphasized">Import successful!</h1>
        <p className="text-body-medium text-on-surface-variant">
          {imported} {pluralize('song', imported)}{' '}
          {imported === 1 ? 'is' : 'are'} in your library now.
        </p>
        <div className="flex flex-wrap justify-center w-full gap-2 mt-6">
          <Button variant="accent" color="gray" size="md" onClick={onStartOver}>
            Import more
          </Button>
          <Link
            to="/songs"
            className={buttonClasses({ size: 'md', className: 'flex-center' })}
          >
            View songs
          </Link>
        </div>
      </section>
    </FadeIn>
  );
}
