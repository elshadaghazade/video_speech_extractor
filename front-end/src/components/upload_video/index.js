import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import axiosInstance from '../axios';
import '../../App.css';

function UploadVideo (props) {
    let [selectedFiles, setSelectedFiles] = useState([]);
    let [progress, setProgress] = useState(0);
    let [vid, setVid] = useState(null);

    const submitHandler = () => {
        const form = new FormData();
        form.append('filename', selectedFiles[0]);
        axiosInstance.post('/api/transcript_generator/?fs=videos', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: data => {
                setProgress(Math.round(100 * data.loaded / data.total))
            }
        }).then(response => {
            setVid(response.data);
        })
    }

    if (vid) {
        return <Redirect to="/transcripts" />
    } else {
        return (
            <div className="flex flex-column">
                <input className="btn" onChange={(e) => {
                    setSelectedFiles(e.target.files);
                    setProgress(0);
                }} type="file" accept="video/mp4,.mp4,video/quicktime,.mov,video/x-msvideo,.avi" />
                {progress ? 
                    (<div>uploading {progress}%</div>) : 
                    (<button onClick={submitHandler}>UPLOAD {progress}%</button>)
                }
            </div>
        );
    }
}


export default UploadVideo;