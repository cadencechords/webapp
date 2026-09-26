import React, { useState } from 'react';
import Button from '../components/Button';
import PageTitle from '../components/PageTitle';
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
    <div className="container max-w-2xl mx-auto mt-10">
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
      <ResultStep currentStep={currentStep} onStartOver={handleStartOver} />
    </div>
  );
}

type ResultStepProps = {
  currentStep: number;
  onStartOver: () => void;
};

function ResultStep({ currentStep, onStartOver }: ResultStepProps) {
  if (currentStep !== 2) {
    return null;
  }

  return (
    <FadeIn>
      <div className="flex-center">
        <Icon name="check_circle" filled className="w-20 h-20 text-green-500" />
      </div>
      <PageTitle align="center" title="Import successful!" className="mb-4" />
      <div className="flex items-center justify-between gap-4">
        <Button variant="accent" full={true} onClick={onStartOver}>
          Import more
        </Button>
        <Link to="/songs" className="w-full">
          <Button full={true}>View songs</Button>
        </Link>
      </div>
    </FadeIn>
  );
}
