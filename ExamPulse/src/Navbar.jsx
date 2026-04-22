import {NavLink} from 'react-router-dom';
import './App.css';

const Navbar = () => {
    return (
        <nav>
            <span className="nav-brand">ExamPulse RPG</span>
            <div className="nav-links">
                <NavLink to="/" className="nav-link">Home</NavLink>
                <NavLink to="/about" className="nav-link">About</NavLink>
                <NavLink to="/countdown" className="nav-link">Exam Countdown</NavLink>
                <NavLink to="/tasks" className="nav-link">Tasks</NavLink>
                <NavLink to="/rewards" className="nav-link">Rewards</NavLink>

            </div>
        </nav>
    );
};
export default Navbar;
