import { showAlert } from './alerts';

// type= 'password' || 'data
export const updateSettings = async (data, type) => {
  // when sending formData with fetch(), no contenet-type or JSON.stringify
  const url =
    type === 'password'
      ? `/api/v1/users/updateMyPassword`
      : `/api/v1/users/updateMe`;
  const options = {
    method: 'PATCH',
    body: data,
  };

  try {
    const res = await fetch(url, options);
    // const data = await res.json();

    if (res.ok) {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
    if (!res.ok)
      throw new Error(
        'There was a problem updating your information.  Try again later!'
      );
  } catch (error) {
    console.log(error);
    showAlert('error', error.message);
  }
};
