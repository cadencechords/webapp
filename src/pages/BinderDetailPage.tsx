import { useHistory, useLocation, useParams } from 'react-router';
import BinderColor from '../components/BinderColor';
import BinderOptionsPopover from '../components/BinderOptionsPopover';
import BinderSongsList from '../components/BinderSongsList';
import ColorDialog from '../components/ColorDialog';
import { EDIT_BINDERS } from '../utils/constants';
import EditableData from '../components/inputs/EditableData';
import PageTitle from '../components/PageTitle';
import UnsavedChangesBar from '../components/UnsavedChangesBar';
import { isEmpty } from '../utils/ObjectUtils';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useBinder from '../hooks/api/useBinder';
import useUpdates from '../hooks/useUpdates';
import PageLoading from '../components/PageLoading';
import useUpdateBinder from '../hooks/api/useUpdateBinder';
import Alert from '../components/Alert';
import useDialog from '../hooks/useDialog';
import type { Binder } from '../types';
import { useRecordRecentlyViewed } from '../hooks/useRecentlyViewed';

export default function BinderDetailPage() {
  const [isColorPickerOpen, showColorPicker, hideColorPicker] = useDialog();

  const router = useHistory();
  const { id } = useParams<{ id: string }>();
  // Whoever navigated here may pass the binder as the location state.
  const { state } = useLocation<Binder | undefined>();

  const {
    data: originalBinder,
    isLoading,
    isError,
  } = useBinder(id, { placeholderData: state });

  useRecordRecentlyViewed('folder', originalBinder);

  const {
    updates,
    updatedValue: binder,
    onChange,
    clearUpdates,
  } = useUpdates(originalBinder);

  // Non-null: kept as before, this throws if the membership hasn't loaded.
  const currentMember = useSelector(selectCurrentMember)!;

  const { isLoading: isSaving, run: updateBinder } = useUpdateBinder({
    onSuccess: () => {
      clearUpdates();
      router.replace(`/folders/${id}`, null);
    },
  });

  if (isLoading) {
    return <PageLoading />;
  }

  if (isError)
    return (
      <Alert>There was an issue loading this folder. Please try again.</Alert>
    );

  return (
    <div className="mb-10">
      {currentMember.can(EDIT_BINDERS) && !isEmpty(updates) && (
        <UnsavedChangesBar
          onSave={() => updateBinder({ id, updates })}
          isSaving={isSaving}
        />
      )}
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
            onChange={(editedColor: string | undefined) =>
              onChange('color', editedColor)
            }
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
          placeholder="Add a description for this folder"
          value={binder.description || ''}
          onChange={editedDescription =>
            onChange('description', editedDescription)
          }
          editable={currentMember.can(EDIT_BINDERS)}
        />
      </div>
      <BinderSongsList binder={binder} />
    </div>
  );
}
