import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import TranscriptDetails from './TranscriptDetails';
import axiosInstance from '../axios';
import '../../App.css';
import './assets/css/style.css';

class Transcript extends Component {

    constructor() {
        super();
        this.state = {
            transcripts: [],
            vid: null
        }
    }

    loadTranscripts () {
        axiosInstance.get('/api/transcript/list')
        .then(response => {
            const data = response.data;
            this.setState({
                transcripts: data
            });

            axiosInstance.get('/api/transcript_generator/?fs=videos')
            .then(response => {
                const data = response.data;
                
                this.setState({
                    transcripts: this.state.transcripts.concat(data)
                });
            });
        });
    }

    componentWillUnmount () {
        clearInterval(this.interval);
    }

    componentDidMount () {
        this.loadTranscripts();

        this.interval = setInterval(() => this.loadTranscripts(), 5000);
    }

    render () {
        if (this.state.transcripts && this.state.transcripts.length) {
            return (
                <div className="flex flex-column">
                    {this.state.transcripts.map((transcript, index) => (
                        <Link to={`/transcripts/${transcript.video_id || transcript._id}`} key={`transcript-item-${index}`} className="btn">
                            <div>{transcript.filename}</div>
                            <div>{transcript.length} bytes</div>
                            {transcript.chunkSize ? (
                                <div>in progress...</div>
                            ) : null}
                        </Link>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="flex flex-column">
                    <h2>THERE IS NO TRANSCRIPT YET</h2>
                </div>
            )
        }
    }
}


export default Transcript;