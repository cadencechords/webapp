import Button from "../components/Button";
import DocumentAddIcon from "@heroicons/react/outline/DocumentAddIcon";
import OnsongLogo from "../images/onsong.svg";
import PlanningCenterButton from "../components/buttons/PlanningCenterButton";
import Alert from "../components/Alert";

export default function SongImportSourcesIndexPage() {
  return (
    <>
      <div className="font-bold text-2xl text-center py-4">Import Songs</div>

      <div className="grid grid-cols-1 w-5/6  md:w-2/3 xl:w-1/2 mx-auto gap-y-4">
        <Alert color="yellow" className="my-4">
          Importing is not available in the playground
        </Alert>
        <button
          disabled
          style={{ backgroundColor: "#1a1a1c", height: "40px" }}
          className="w-full focus:outline-none outline-none flex-center rounded-md shadow-md cursor-default"
        >
          <img src={OnsongLogo} style={{ height: "22px" }} alt="Onsong" />
        </button>
        <PlanningCenterButton />
        <Button
          full
          variant="outlined"
          className="shadow-md flex-center"
          color="black"
          disabled={true}
        >
          <DocumentAddIcon className="w-5 h-5 mr-2 text-blue-600" />
          Import Files (Word, PDF or text)
        </Button>
      </div>
    </>
  );
}
