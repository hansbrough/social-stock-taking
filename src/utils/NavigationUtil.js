// Naviagtion Utility methods

const workflow = {
  '/': 0,
  '/uploadFile': 1,
  '/takePicture': 1,
};

// determine direction of workflow navigation
export const getNavigationDirection = (location) => {
  const { pathname } = location;
  const { prevPath } = location.state;
  return (workflow[pathname] < workflow[prevPath]) ? 'back' : 'forward';
};
