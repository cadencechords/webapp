import { ToastContainer } from 'react-toastify';

// react-toastify's container, as M3 snackbars: bottom-centered, without the
// progress bar (src/styles/snackbar.css does the rest). Timing, roles and the
// toast calls are toastify's.
export default function Snackbars() {
  return <ToastContainer position="bottom-center" hideProgressBar />;
}
