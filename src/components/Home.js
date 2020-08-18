import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <>
      <h1>Social Stock Taking</h1>
      <p>Send the people out to take stock of the goods!</p>
      <p><Link to={{pathname: '/uploadFile', state: { prevPath: window.location.pathname }}}>Upload a local file</Link></p>
      <p><Link to={{pathname: '/takePicture', state: { prevPath: window.location.pathname }}}>Take a Picture and Upload</Link></p>
    </>
  );
};

export default Home;
