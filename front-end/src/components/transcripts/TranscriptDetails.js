import {Component} from 'react';
import {Link} from 'react-router-dom';
import axiosInstance from '../axios';

class TranscriptDetails extends Component {
    constructor () {
        super();

        this.state = {
            video: undefined,
        }
    }

    componentDidMount () {
        axiosInstance.get(`/api/transcript/list/${this.props.match.params.id}`)
        .then(response => {
            const data = response.data;
            this.setState({
                ...this.state,
                video: data
            });
        });
    }

    render () {

        if (this.state.video === undefined) {
            return (
                <h2>loading...</h2>
            );
        }

        if (this.state.video === null) {
            return (
                <h2>in progress...</h2>
            );
        }

        return (
            <div className="flex flex-column">
                <Link to="/transcripts">&laquo; Back to transcripts</Link>
                <strong>file name: {this.state.video.filename}</strong>
                <strong>file size: {this.state.video.length} bytes</strong>
                <strong>uploaded at: {this.state.video.uploadDate}</strong>
                <a href={`/api/transcript/list/${this.state.video._id}/download/`}>Download transcript</a>
                {this.state.video.transcript.map((trans, index) => {
                    return (<div key={`transcript-item-inp-${index}`} className="transcript-item flex flex-column">
                        <label htmlFor={`inp-${index}`}>{Math.round(trans.seconds)} seconds</label>
                        <textarea id={`inp-${index}`} onChange={(e) => {
                            trans.speech = e.target.value;
                        }} defaultValue={trans.speech} />
                    </div>);
                })}
                <button className="btn" onClick={() => {
                    axiosInstance.post(`/api/transcript/list/${this.state.video._id}`, this.state.video.transcript)
                    .then(response => {
                        this.props.setVid(null);
                    });
                }}>SAVE</button>
            </div>
        );
    }
}

export default TranscriptDetails;