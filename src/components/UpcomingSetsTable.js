import FadeIn from "./FadeIn";
import NoDataMessage from "./NoDataMessage";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import { toShortDate } from "../utils/DateUtils";

export default function UpcomingSetsTable({ setlists, onClick }) {
  return (
    <>
      <FadeIn className="h-52 overflow-auto delay-75">
        <table className="w-full">
          <TableHead columns={["NAME", "SCHEDULED", "SONGS"]} />
          <tbody>
            {setlists?.length > 0 ? (
              setlists.map((setlist) => (
                <TableRow
                  key={setlist.id}
                  columns={[
                    setlist.name,
                    toShortDate(setlist.scheduled_date),
                    setlist.songs?.length,
                  ]}
                  onClick={() => onClick(setlist.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-4">
                  <NoDataMessage type="sets" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </FadeIn>
    </>
  );
}

UpcomingSetsTable.defaultProps = {
  setlists: [],
};
