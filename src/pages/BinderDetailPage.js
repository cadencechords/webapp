import { useHistory, useLocation, useParams } from 'react-router';
import BinderColor from '../components/BinderColor';
import BinderOptionsPopover from '../components/BinderOptionsPopover';
import BinderSongsList from '../components/BinderSongsList';
import Button from '../components/Button';
import ColorDialog from '../components/ColorDialog';
import { EDIT_BINDERS } from '../utils/constants';
import EditableData from '../components/inputs/EditableData';
import PageTitle from '../components/PageTitle';
import { isEmpty } from '../utils/ObjectUtils';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useBinder from '../hooks/api/useBinder';
import useUpdates from '../hooks/useUpdates';
import PageLoading from '../components/PageLoading';
import useUpdateBinder from '../hooks/api/useUpdateBinder';
import Alert from '../components/Alert';
import useDialog from '../hooks/useDialog';

export default function BinderDetailPage() {
  const [isColorPickerOpen, showColorPicker, hideColorPicker] = useDialog();

  const router = useHistory();
  const { id } = useParams();
  const { state } = useLocation();

  const {
    data: originalBinder,
    isLoading,
    isError,
  } = useBinder(id, { placeholderData: state });

  const {
    updates,
    updatedValue: binder,
    onChange,
    clearUpdates,
  } = useUpdates(originalBinder);

  const currentMember = useSelector(selectCurrentMember);

  const { isLoading: isSaving, run: updateBinder } = useUpdateBinder({
    onSuccess: () => {
      clearUpdates();
      router.replace(`/binders/${id}`, null);
    },
  });

  if (isLoading) {
    return <PageLoading />;
  }

  if (isError)
    return (
      <Alert>There was an issue loading this binder. Please try again.</Alert>
    );

  return (
    <div className="mb-10">
      <div className="flex-center">
        <span className="mr-2 cursor-pointer">
          <BinderColor
            color={binder.color}
            onClick={showColorPicker}
            editable={currentMember.can(EDIT_BINDERS)}
          />
          <ColorDialog
            open={isColorPickerOpen}
            onCloseDialog={hideColorPicker}
            binderColor={binder.color}
            onChange={editedColor => onChange('color', editedColor)}
          />
        </span>
        <PageTitle
          title={binder.name}
          editable={currentMember.can(EDIT_BINDERS)}
          onChange={editedName => onChange('name', editedName)}
        />
        {currentMember.can(EDIT_BINDERS) && (
          <BinderOptionsPopover onChangeColorClick={showColorPicker} />
        )}
      </div>
      <div className="mb-6">
        <EditableData
          placeholder="Add a description for this binder"
          value={binder.description || ''}
          onChange={editedDescription =>
            onChange('description', editedDescription)
          }
          editable={currentMember.can(EDIT_BINDERS)}
        />
      </div>
      <BinderSongsList binder={binder} />

      {currentMember.can(EDIT_BINDERS) && !isEmpty(updates) && (
        <div className="fixed shadow-md bottom-8 right-8">
          <SaveButton
            onSave={() => updateBinder({ id, updates })}
            isSaving={isSaving}
          />
        </div>
      )}
    </div>
  );
}

function SaveButton({ isSaving, onSave }) {
  return (
    <>
      <Button
        className="fixed left-0 right-0 md:hidden bottom-14"
        style={{ borderRadius: 0 }}
        loading={isSaving}
        onClick={onSave}
      >
        Save Changes
      </Button>
      <Button
        className="fixed hidden w-36 bottom-8 right-8 md:inline-block whitespace-nowrap"
        loading={isSaving}
        onClick={onSave}
        size="sm"
      >
        Save Changes
      </Button>
    </>
  );
}
