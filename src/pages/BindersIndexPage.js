import { useCallback, useEffect, useMemo, useState } from 'react';
import { ADD_BINDERS } from '../utils/constants';
import CreateBinderDialog from '../components/CreateBinderDialog';
import QuickAdd from '../components/QuickAdd';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useBinders from '../hooks/api/useBinders';
import PageHeader from '../components/PageHeader';
import PageLoading from '../components/PageLoading';
import Alert from '../components/Alert';
import List from '../components/List';
import NoDataMessage from '../components/NoDataMessage';
import BinderRow from '../components/BinderRow';
import WellInput from '../components/inputs/WellInput';
import useDialog from '../hooks/useDialog';

export default function BindersIndexPage() {
  useEffect(() => (document.title = 'Binders'));

  const [isOpen, showDialog, hideDialog] = useDialog();
  const [query, setQuery] = useState('');
  const currentMember = useSelector(selectCurrentMember);

  const { data: binders, isLoading, isError, isSuccess } = useBinders();

  const searchBinders = useCallback(() => {
    if (query.length > 1) {
      return binders?.filter(song =>
        song.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      return binders;
    }
  }, [query, binders]);

  const queriedBinders = useMemo(() => searchBinders(), [searchBinders]);

  return (
    <div className="mb-10">
      <PageHeader title="Binders" headerRightVisible={false} />
      {isLoading && <PageLoading />}
      {isError && (
        <Alert color="red">There was an issue retrieving your binders.</Alert>
      )}

      {isSuccess && (
        <List
          data={queriedBinders}
          ListEmpty={<NoDataMessage type={'binders'} />}
          renderItem={binder => <BinderRow binder={binder} key={binder.id} />}
          ListHeader={
            <>
              <div className="mb-2">{binders.length} total</div>
              <WellInput
                placeholder="Search your binders"
                value={query}
                onChange={setQuery}
                className="mb-4 lg:text-sm"
              />
            </>
          }
        />
      )}

      {currentMember.can(ADD_BINDERS) && (
        <>
          <CreateBinderDialog open={isOpen} onCloseDialog={hideDialog} />
          <QuickAdd onAdd={showDialog} />
        </>
      )}
    </div>
  );
}
