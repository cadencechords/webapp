// Browser globals that come from script tags or vendor prefixes, not modules.
interface Window {
  /**
   * zxcvbn, from public/scripts/passwords.js. The password pages add that
   * script tag on mount and only call this while the user types a password.
   */
  zxcvbn: (password: string) => { score: number };
  /** Safari before 14.1 only has the prefixed constructor. */
  webkitAudioContext?: typeof AudioContext;
}
