import { useHistory } from 'react-router-dom';
import { ADD_SONGS } from '../utils/constants';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import PageHeader from '../components/PageHeader';
import ImportSourceCard from '../components/ImportSourceCard';
import Icon from '../components/Icon';

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
            Import songs from your church&apos;s Planning Center account.
          </ImportSourceCard>
          <ImportSourceCard
            title="OnSong"
            image={
              <img src="/onsong.webp" width="48" height="48" alt="OnSong" />
            }
            to="/import/onsong"
          >
            Upload your OnSong library and choose which songs you&apos;d like to
            import.
          </ImportSourceCard>
          <ImportSourceCard
            title="Mezzo"
            to="/import/cadence"
            image={
              <img
                src="/apple-touch-icon.png"
                width="48"
                height="48"
                alt="Mezzo"
                className="shadow-xs rounded-xl"
              />
            }
          >
            Import songs from other teams you&apos;re on in Mezzo
          </ImportSourceCard>
          <ImportSourceCard
            title="File"
            to="/import/files"
            image={
              <div className="self-start w-12 h-12 bg-white shadow-xs rounded-xl flex-center">
                <Icon name="description" className="w-6 h-6 text-blue-600" />
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
