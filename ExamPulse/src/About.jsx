import Navbar from './Navbar';
import './App.css';

function About() {
  return (
    <div className="about-page">
      <Navbar />
      <p>
        This app is an exam tracker with a built in gamified reward system. This
        system includes if you are ready for an exam based on the time you reviewed.
        The intensity level is still developed in this system, in a color system of:
      </p>

      <div className="color-legend">
        <p className="red-underline">Red being intense, </p>
        <p className="orange-underline">Orange being moderately difficult, </p>
        <p className="yellow-underline">Yellow being mostly ready but not that good, </p>
        <p className="green-underline">Green being Excellent and ready</p>
      </div>
      <p>
        This app includes a model of your character, that you can customize based
        on the rewards you completed during that time frame. ExamPulse RPG has an
        in-game currency that you get every task you do. <br/><br/>
      </p>

      <p>
        This is not only an exam tracker, this app allows students to study and do
        their hobby at the same time which is gaming, creating a fun learning
        environment and having a school-life balance.
      </p>
    </div>
  );
}

export default About;
