import StyledDialog from "./StyledDialog";
import { usePDF } from "@react-pdf/renderer";
import { toPdf } from "../utils/PdfUtils";
import { useEffect, useState } from "react";
import Button from "./Button";
import FontsListBox from "./FontsListBox";
import FontSizesListBox from "./FontSizesListBox";
import Checkbox from "./Checkbox";

export default function PrintSongDialog({
  song: initialSong,
  open,
  onCloseDialog,
}) {
  const [song, setSong] = useState({ ...initialSong });
  const [showChords, setShowChords] = useState(true);
  const [instance, updateInstance] = usePDF({
    document: toPdf(song, showChords),
  });

  useEffect(() => {
    updateInstance(song, showChords);
  }, [song, showChords, updateInstance]);

  const handleCloseDialog = () => {
    onCloseDialog();
  };

  useEffect(() => {
    setSong(initialSong);
  }, [initialSong]);

  function handleChange(field, value) {
    setSong({ ...song, format: { ...song.format, [field]: value } });
  }

  return (
    <StyledDialog
      open={open}
      onCloseDialog={handleCloseDialog}
      size="5xl"
      title="Printing"
    >
      <div className="mb-4 grid grid-cols-8 gap-8">
        <div className="col-span-8 md:col-span-2">
          <div className="flex-between mb-2">
            <span className="w-28">Font: </span>
            <FontsListBox
              selectedFont={song.format.font}
              onChange={(newValue) => handleChange("font", newValue)}
            />
          </div>
          <div className="flex-between mb-6">
            <span className="w-28">Font size: </span>
            <FontSizesListBox
              selectedFontSize={song.format.font_size}
              onChange={(newValue) => handleChange("font_size", newValue)}
            />
          </div>
          <div className="flex-between pt-6 mb-4 border-t dark:border-dark-gray-600 ">
            <span className="w-28">Show chords:</span>
            <Checkbox checked={showChords} onChange={setShowChords} />
          </div>
          <div className="flex-between mb-4">
            <span className="w-28">Bold chords:</span>
            <Checkbox
              checked={song.format.bold_chords}
              onChange={(newValue) => handleChange("bold_chords", newValue)}
            />
          </div>
          <div className="flex-between pb-4 border-b dark:border-dark-gray-600">
            <span className="w-28">Italic chords:</span>
            <Checkbox
              checked={song.format.italic_chords}
              onChange={(newValue) => handleChange("italic_chords", newValue)}
            />
          </div>
          <a href={instance.url} download={`${song.name}.pdf`}>
            <Button full className="mt-4">
              Download
            </Button>
          </a>
        </div>
        <div className="col-span-8 md:col-span-6">
          <embed
            src={`${instance.url}#scrollbar=0`}
            width="700px"
            height="600px"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="open" color="blue" onClick={handleCloseDialog}>
          Cancel
        </Button>
      </div>
    </StyledDialog>
  );
}
