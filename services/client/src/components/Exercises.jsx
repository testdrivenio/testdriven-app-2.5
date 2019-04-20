import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Exercise from './Exercise';

class Exercises extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentExercise: 0,
      exercises: [],
      editor: {
        value: '# Enter your code here.',
        button: { isDisabled: false, },
        showGrading: false,
        showCorrect: false,
        showIncorrect: false,
      },
      showButtons: {
        prev: false,
        next: false,
      },
    };
    this.onChange = this.onChange.bind(this);
    this.submitExercise = this.submitExercise.bind(this);
    this.updateScore = this.updateScore.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.nextExercise = this.nextExercise.bind(this);
    this.prevExercise = this.prevExercise.bind(this);
    this.resetEditor = this.resetEditor.bind(this);
  };
  componentDidMount() {
    this.getExercises();
  };
  getExercises() {
    return axios.get(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises`)
    .then((res) => {
      this.setState({
        exercises: res.data.data.exercises,
        currentExercise: 0,
      });
      this.renderButtons();
    })
    .catch((err) => { console.log(err); });
  };
  onChange(value) {
    const newState = this.state.editor;
    newState.value = value;
    this.setState(newState);
  };
  submitExercise(event, id) {
    event.preventDefault();
    const newState = this.state.editor;
    const exercise = this.state.exercises.filter(el => el.id === id)[0]
    newState.showGrading = true;
    newState.showCorrect = false;
    newState.showIncorrect = false;
    newState.button.isDisabled = true;
    this.setState(newState);
    const data = {
      answer: this.state.editor.value,
      test: exercise.test_code,
      solution: exercise.test_code_solution,
    };
    const url = process.env.REACT_APP_API_GATEWAY_URL;
    axios.post(url, data)
    .then((res) => {
      newState.showGrading = false
      newState.button.isDisabled = false
      if (res.data && !res.data.errorType) {
        newState.showCorrect = true
        this.updateScore(exercise.id, true)
      };
      if (!res.data || res.data.errorType) {
        newState.showIncorrect = true
        this.updateScore(exercise.id, false)
      };
      this.setState(newState);
    })
    .catch((err) => {
      newState.showGrading = false
      newState.button.isDisabled = false
      console.log(err);
      this.updateScore(exercise.id, false)
    })
  };
  updateScore(exerciseID, bool) {
    const options = {
      url: `${process.env.REACT_APP_SCORES_SERVICE_URL}/scores/${exerciseID}`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.authToken}`
      },
      data: {correct:bool}
    };
    return axios(options)
    .then((res) => { console.log(res); })
    .catch((error) => { console.log(error); });
  };
  renderButtons() {
    const index = this.state.currentExercise;
    let nextButton = false;
    let prevButton = false;
    if (typeof this.state.exercises[index + 1] !== 'undefined') {
      nextButton = true;
    }
    if (typeof this.state.exercises[index - 1] !== 'undefined') {
      prevButton = true;
    }
    this.setState({
      showButtons: {
        next: nextButton,
        prev: prevButton
      }
    });
  };
  nextExercise() {
    if (this.state.showButtons.next) {
      const currentExercise = this.state.currentExercise;
      this.setState({currentExercise: currentExercise + 1}, () => {
        this.resetEditor();
        this.renderButtons();
      });
    }
  };
  prevExercise() {
    if (this.state.showButtons.prev) {
      const currentExercise = this.state.currentExercise;
      this.setState({currentExercise: currentExercise - 1}, () => {
        this.resetEditor();
        this.renderButtons();
      });
    }
  };
  resetEditor() {
    const editor = {
      value: '# Enter your code here.',
      button: {
        isDisabled: false,
      },
      showGrading: false,
      showCorrect: false,
      showIncorrect: false,
    }
    this.setState({editor: editor});
  };
  render() {
    return (
      <div>
        <h1 className="title is-1">Exercises</h1>
        <hr/><br/>
        {!this.props.isAuthenticated &&
          <div className="notification is-warning">
            <span>Please log in to submit an exercise.</span>
          </div>
        }
        {this.state.exercises.length > 0 &&
          <Exercise
            exercise={this.state.exercises[this.state.currentExercise]}
            editor={this.state.editor}
            isAuthenticated={this.props.isAuthenticated}
            onChange={this.onChange}
            submitExercise={this.submitExercise}
          />
        }
        <div className="field is-grouped">
          { this.state.showButtons.prev &&
            <button
              className="button is-info"
              onClick={() => this.prevExercise()}
            >&lt; Prev</button>
          }
          &nbsp;
          { this.state.showButtons.next &&
            <button
              className="button is-info"
              onClick={() => this.nextExercise()}
            >Next &gt;</button>
          }
        </div>
      </div>
    )
  };
};

Exercises.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Exercises;
