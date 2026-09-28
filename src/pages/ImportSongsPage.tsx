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
    const logo = 'w-10 h-10 shrink-0 rounded-[12px]';
    // M3E: the sources as a segmented list of rows, each opening its import.
    return (
      <div className="max-w-2xl mx-auto font-plain">
        <PageHeader title="Import songs" headerRightVisible={false} />
        <p className="mb-4 text-body-medium text-on-surface-variant">
          Bring songs in from another app, another team or your own files.
        </p>
        <div className="list-segmented">
          <ImportSourceCard
            title="Planning Center Services"
            image={
              <img
                src="/services.png"
                width="40"
                height="40"
                alt=""
                className={logo}
              />
            }
            to="/import/planning-center"
          >
            Import songs from your church&apos;s Planning Center account.
          </ImportSourceCard>
          <ImportSourceCard
            title="OnSong"
            image={
              <img
                src="/onsong.webp"
                width="40"
                height="40"
                alt=""
                className={logo}
              />
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
                width="40"
                height="40"
                alt=""
                className={logo}
              />
            }
          >
            Import songs from other teams you&apos;re on in Mezzo
          </ImportSourceCard>
          <ImportSourceCard
            title="Files"
            to="/import/files"
            image={
              <span
                className={`${logo} flex-center bg-secondary-container text-on-secondary-container`}
              >
                <Icon name="description" className="w-6 h-6" />
              </span>
            }
          >
            Import PDF, Word or text files.
          </ImportSourceCard>
        </div>
      </div>
    );
  }
}
