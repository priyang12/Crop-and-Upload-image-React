import { Fragment, useState } from 'react';

import './App.css';
import Corpimage from './corpimage';

const App = () => {
  const [File, setFile] = useState(null);

  const cropimage = (e) => {
    const file = e.target.files[0];

    setFile(file);
  };
  const onsubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Fragment>
      <div className='container'>
        <form onSubmit={onsubmit} method='post' encType='multipart/form-data'>
          <h1>Crop and Upload your file Using React-crop-Avatar</h1>
          <input type='file' id='photo' name='photo' onChange={cropimage} />
        </form>
        {File && (
          <div>
            <h1>Crop the Image</h1>
            <Corpimage img={File} name={File.name} />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default App;
