import { Link, useHistory } from 'react-router-dom';

import { ADD_SONGS } from '../utils/constants';
import DocumentAddIcon from '@heroicons/react/outline/DocumentAddIcon';
import OnsongLogo from '../images/onsong.svg';
import PlanningCenterButton from '../components/buttons/PlanningCenterButton';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';

export default function SongImportSourcesIndexPage() {
  const currentMember = useSelector(selectCurrentMember);
  const router = useHistory();

  if (!currentMember.can(ADD_SONGS)) {
    router.push('/songs');
    return null;
  } else {
    return (
      <>
        <div className="py-4 text-2xl font-bold text-center">Import Songs</div>

        <div className="grid w-5/6 grid-cols-1 mx-auto md:w-2/3 xl:w-1/2 gap-y-4">
          <Link to="/import/onsong">
            <button
              style={{ backgroundColor: '#1a1a1c', height: '40px' }}
              className="w-full rounded-full shadow-md outline-none focus:outline-none flex-center"
            >
              <img src={OnsongLogo} style={{ height: '22px' }} alt="Onsong" />
            </button>
          </Link>
          <PlanningCenterButton />
          <Link to="/import/files">
            <button className="w-full p-2 font-semibold bg-white rounded-full shadow-md flex-center dark:bg-dark-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-dark-gray-700 dark:focus:bg-dark-gray-700">
              <DocumentAddIcon className="w-5 h-5 mr-2 text-blue-600" />
              Import Files (Word, PDF or text)
            </button>
          </Link>
        </div>
      </>
    );
  }
}
