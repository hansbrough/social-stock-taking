// Naviagtion Utility methods

const workflow = {
  '/'               : 0,
  '/uploadFile'     : 1,
  '/takePicture'    : 1,
  '/cropPicture'    : 2,
  '/getPictureText' : 3,
  '/setPlace'       : 4,
  '/finish'         : 5,
  '/success'        : 6,
};

// determine direction of workflow navigation
export const getNavigationDirection = (location) => {
  console.log("getNavigationDirection location:",location);
  const { pathname } = location;
  let direction = 'back';
  if (location.state) {
    const { prevPath } = location.state;
    direction = (workflow[pathname] < workflow[prevPath]) ? 'back' : 'forward';
  }
  return direction;
};
