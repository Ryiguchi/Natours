import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    // relative url will work because website and api are hosted on same server
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else throw new Error(data.message);
  } catch (error) {
    showAlert('error', error.message);
  }
};

export const logout = async () => {
  try {
    const res = await fetch('/api/v1/users/logout');
    const data = await res.json();

    if (res.ok) {
      showAlert('success', 'Logged out successfully!');
      // "true" forces reload from server and not just from browseer cache!
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else throw new Error(data.message);
  } catch (error) {
    showAlert('error', error.message ?? 'Error logging out');
  }
};
