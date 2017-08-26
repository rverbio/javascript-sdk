import { generateUUID } from './util';

const storageKeys = {
  id: 'rverbio.enduser.id',
  firstSeen: 'rverbio.enduser.firstseen',
  description: 'rverbio.enduser.description',
  email: 'rverbio.enduser.email',
  dirty: 'rverbio.enduser.dirty',
};

const canUseStorage = typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function';

if (!canUseStorage) {
  // eslint-disable-next-line no-console
  console.warn('local storage is not supported by this browser, you will not be able to correlate feedback across sessions or users');
}

export default class EndUser {
  constructor() {
    this.state = {};


    if (canUseStorage) {
      this.state.id = localStorage.getItem(storageKeys.id);
      this.state.firstSeen = localStorage.getItem(storageKeys.firstSeen);
      this.state.description = localStorage.getItem(storageKeys.description);
      this.state.email = localStorage.getItem(storageKeys.email);
    }

    if (!this.state.id) {
      this.state.id = generateUUID();
      this.state.firstSeen = new Date().toISOString();
      if (canUseStorage) {
        localStorage.setItem(storageKeys.id, this.state.id);
        localStorage.setItem(storageKeys.firstSeen, this.state.firstSeen);
        localStorage.setItem(storageKeys.dirty, 'true');
      }
    }
  }

  get id() {
    return this.state.id;
  }

  get firstSeen() {
    return this.state.firstSeen;
  }

  get description() {
    return this.state.description;
  }

  set description(value) {
    if (!value) {
      throw Error('A description is required');
    }

    if (this.state.description !== value) {
      this.state.description = value;

      if (canUseStorage) {
        localStorage.setItem(storageKeys.description, value);
      }

      localStorage.setItem(storageKeys.dirty, 'true');
    }
  }

  get email() {
    return this.state.email;
  }

  set email(value) {
    if (!value) {
      throw Error('An email is required');
    }

    if (this.state.email !== value) {
      this.state.email = value;

      if (canUseStorage) {
        localStorage.setItem(storageKeys.email, value);
      }

      localStorage.setItem(storageKeys.dirty, 'true');
    }
  }

  sync(api) {
    if (!canUseStorage || localStorage.getItem(storageKeys.dirty)) {
      return api.postUser({
        id: this.state.id,
        description: this.state.description,
        email: this.state.email,
        firstSeen: this.state.firstSeen,
      }).then(() => {
        // clear the flag
        if (canUseStorage) {
          localStorage.removeItem(storageKeys.dirty);
        }
      }).catch((error) => {
        // eslint-disable-next-line
        console.error(error);
      });
    }

    return new Promise((resolve) => { resolve(); });
  }
}
