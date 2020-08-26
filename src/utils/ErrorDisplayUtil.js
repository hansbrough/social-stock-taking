//= ==== Constants ===== //
import ErrorKeyConstants from '../constants/ErrorKeyConstants';

const errorTexts = {
  [ErrorKeyConstants.NO_CANDIDATES]: 'No matching plants found. Try again after editing the image text.'
}

export const getErrorText = (key) => {
  return errorTexts[key];
}
