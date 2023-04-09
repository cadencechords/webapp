import { useHistory } from 'react-router-dom';
import { ADD_SONGS } from '../utils/constants';
import DocumentTextIcon from '@heroicons/react/outline/DocumentTextIcon';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import PageHeader from '../components/PageHeader';
import ImportSourceCard from '../components/ImportSourceCard';

export default function ImportSongsPage() {
  const currentMember = useSelector(selectCurrentMember);
  const router = useHistory();

  if (!currentMember || !currentMember.permissions) return null;

  if (!currentMember.can(ADD_SONGS)) {
    router.push('/songs');
    return null;
  } else {
    return (
      <div className="container max-w-5xl mx-auto">
        <PageHeader title="Import songs" headerRightVisible={false} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <ImportSourceCard
            title="Services"
            image={
              <img src="/services.png" width="48" height="48" alt="Services" />
            }
            to="/import/planning-center"
          >
            Import songs from your church's Planning Center account.
          </ImportSourceCard>
          <ImportSourceCard
            title="OnSong"
            image={
              <img src="/onsong.webp" width="48" height="48" alt="OnSong" />
            }
            to="/import/onsong"
          >
            Upload your OnSong library and choose which songs you'd like to
            import.
          </ImportSourceCard>
          <ImportSourceCard
            title="Cadence"
            to="/import/cadence"
            image={
              <img
                src="/apple-touch-icon.png"
                width="48"
                height="48"
                alt="Cadence"
                className="shadow-sm rounded-xl"
              />
            }
          >
            Import songs from other teams you're on in Cadence
          </ImportSourceCard>
          <ImportSourceCard
            title="File"
            to="/import/files"
            image={
              <div className="self-start w-12 h-12 bg-white shadow-sm rounded-xl flex-center">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
            }
          >
            Import PDF, Word or text files.
          </ImportSourceCard>
        </div>
      </div>
    );
  }
}
