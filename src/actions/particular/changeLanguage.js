import { setLocale } from 'react-redux-i18n';

export default function changeLanguage(payload) {
  return function(dispatch) {
    dispatch({
      type: 'PUT_LANGUAGE_START'
    });

    fetch(REST_URL + 'users/userChangeLanguage/lang/' + payload.language,
      { credentials: "same-origin" }
    ).then(() => {
      dispatch(setLocale(payload.language));

      dispatch({
        type: 'PUT_LANGUAGE_COMPLETE',
        payload: {
          lang: payload.language
        }
      });

      location.reload();
    });
  }
};
