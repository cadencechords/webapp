import { useEffect, useState } from "react";

import { ADD_BINDERS } from "../utils/constants";
import BinderApi from "../api/BinderApi";
import BindersList from "../components/BindersList";
import Button from "../components/Button";
import CreateBinderDialog from "../components/CreateBinderDialog";
import FadeIn from "../components/FadeIn";
import MobileHeader from "../components/MobileHeader";
import NoDataMessage from "../components/NoDataMessage";
import PageTitle from "../components/PageTitle";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import QuickAdd from "../components/QuickAdd";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function BindersIndexPage() {
  useEffect(() => (document.title = "Binders"));
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [binders, setBinders] = useState([]);

  const currentMember = useSelector(selectCurrentMember);

  useEffect(() => {
    let result = BinderApi.getAll();
    setBinders(result.data);
  }, []);

  let content = null;
  if (binders.length === 0) {
    content = (
      <NoDataMessage>
        You don't have any binders yet. Click the add button to get started.
      </NoDataMessage>
    );
  } else {
    content = (
      <FadeIn className="mb-10">
        <BindersList binders={binders} />
      </FadeIn>
    );
  }

  const handleBinderCreated = (newBinder) => {
    setBinders([...binders, newBinder]);
  };

  return (
    <>
      <div className="hidden sm:block">
        <PageTitle title="Binders" />
      </div>
      <div className="h-14 mb-4 sm:hidden">
        <MobileHeader
          title="Binders"
          className="shadow-inner"
          onAdd={() => setShowCreateDialog(true)}
          canAdd={currentMember.can(ADD_BINDERS)}
        />
      </div>

      {content}

      {currentMember.can(ADD_BINDERS) && (
        <>
          <CreateBinderDialog
            open={showCreateDialog}
            onCloseDialog={() => setShowCreateDialog(false)}
            onCreated={handleBinderCreated}
          />
          <Button
            variant="open"
            className="bg-white dark:bg-dark-gray-700 fixed bottom-12 left-0 rounded-none flex-center sm:hidden h-12"
            full
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -5px 17px 0px" }}
            onClick={() => setShowCreateDialog(true)}
            color="blue"
          >
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Add new binder
          </Button>
          <div className="hidden sm:block">
            <QuickAdd onAdd={() => setShowCreateDialog(true)} />
          </div>
        </>
      )}
    </>
  );
}
