import {Link} from 'react-router-dom';
import './assets/css/style.css';

export default function Header (props) {
    return (
      <header className="flex text-center">
        <h1>{props.children}</h1>
        <div style={{
          flex: 1
        }}>
          <Link className="link" to="/">DASHBOARD</Link>
          <Link className="link" to="/upload">UPLOAD</Link>
          <Link className="link" to="/transcripts">TRANSCRIPTS</Link>
        </div>
      </header>
    )
}