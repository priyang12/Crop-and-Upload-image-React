import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import axios from 'axios';

const Corpimage = ({ img, name }) => {
  const [Editor, setEditor] = useState(null);
  const [image, setimage] = useState(null);
  const [file, setfile] = useState(null);
  const [DBimage, setDBimage] = useState(null);

  const setEditorRef = (editor) => {
    setEditor(editor);
  };
  //convet FILE form URL
  const DataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  //canvert the data Buffer Array into image
  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  const submit = (e) => {
    e.preventDefault();
    if (Editor) {
      const url = Editor.getImageScaledToCanvas().toDataURL();
      setimage(url);

      setfile(DataURLtoFile(url, name));
      console.log(file);
    }
  };
  const sendTOBackend = (e) => {
    e.preventDefault();
    if (file !== null) {
      const formData = new FormData();

      formData.append('file', file);
      //send  image to server
      axios.post('/upload', formData).then((res) => {
        // then get the as same image form database
        axios.get(`/upload/${res.data}`).then((file) => {
          //covert buffer into base64
          setDBimage(arrayBufferToBase64(file.data.img.data.data));
        });
      });
    } else {
      console.log('null no file');
    }
  };

  return (
    <div className='cropimage'>
      <div>
        <AvatarEditor
          ref={setEditorRef}
          image={img}
          width={250}
          height={250}
          border={50}
          color={[255, 255, 255, 0.6]}
          borderRadius={100}
          scale={1.2}
          rotate={0}
        />
        <br />
        <button onClick={submit}>submit</button>
      </div>
      {image && (
        <div className='croped'>
          <h1>Croped Image</h1>
          <img
            src={image}
            title={image.name}
            alt='Failed'
            style={{ borderRadius: '5rem' }}
          />
          <br />
          <button onClick={sendTOBackend}>send Backend</button>
        </div>
      )}
      {DBimage && (
        <div>
          <h1>Image from Databsae</h1>
          <img
            src={'data:image/jpeg;base64,' + DBimage}
            alt=''
            style={{ borderRadius: '5rem' }}
          />
        </div>
      )}
    </div>
  );
};

export default Corpimage;
