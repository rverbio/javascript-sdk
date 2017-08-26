const storageKeys = {
  sessions: 'rverbio.sessions',
  sessionLogged: 'rverbio.sessions.logged',
};

const canUseStorage = typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function';

export default class Sessions {
  constructor() {
    this.state = {
      sessions: [],
    };

    const now = new Date();

    if (canUseStorage) {
      const savedSessions = localStorage.getItem(storageKeys.sessions);

      if (savedSessions) {
        this.state.sessions = JSON.parse(savedSessions);
      }

      if (!sessionStorage.getItem(storageKeys.sessionLogged)) {
        // set an upper limit to this history
        if (this.state.sessions.length > 20) {
          this.state.sessions.shift();
        }

        this.state.sessions.push(now.toISOString());

        sessionStorage.setItem(storageKeys.sessionLogged, 'done');
        localStorage.setItem(storageKeys.sessions, JSON.stringify(this.state.sessions));
      }
    } else {
      this.state.sessions.push(now.toISOString());
    }
  }

  get sessions() {
    return this.state.sessions;
  }

  reset() {
    this.state.sessions = [];

    if (canUseStorage) {
      localStorage.removeItem(storageKeys.sessions);
    }
  }
}
