import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/python';
import 'brace/theme/solarized_dark';
import axios from 'axios';

class Exercises extends Component {
  constructor (props) {
    super(props);
    this.state = {
      exercises: [],
      editor: {
        value: '# Enter your code here.',
        button: { isDisabled: false, },
        showGrading: false,
        showCorrect: false,
        showIncorrect: false,
      },
    };
    this.onChange = this.onChange.bind(this);
    this.submitExercise = this.submitExercise.bind(this);
  };
  componentDidMount() {
    this.getExercises();
  };
  getExercises() {
    axios.get(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises`)
    .then((res) => { this.setState({ exercises: res.data.data.exercises }); })
    .catch((err) => { console.log(err); });
  };
  onChange(value) {
    const newState = this.state.editor;
    newState.value = value;
    this.setState(newState);
  };
  submitExercise(event) {
    event.preventDefault();
    const newState = this.state.editor;
    newState.showGrading = true;
    newState.showCorrect = false;
    newState.showIncorrect = false;
    newState.button.isDisabled = true;
    this.setState(newState);
    const data = { answer: this.state.editor.value };
    const url = process.env.REACT_APP_API_GATEWAY_URL;
    axios.post(url, data)
    .then((res) => {
      newState.showGrading = false
      newState.button.isDisabled = false
      if (res.data) { newState.showCorrect = true };
      if (!res.data) { newState.showIncorrect = true };
      this.setState(newState);
    })
    .catch((err) => {
      newState.showGrading = false
      newState.button.isDisabled = false
      console.log(err);
    });
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
          {this.state.exercises.length &&
            <div key={this.state.exercises[0].id}>
              <h5 className="title is-5">{this.state.exercises[0].body}</h5>
              <AceEditor
                mode="python"
                theme="solarized_dark"
                name={(this.state.exercises[0].id).toString()}
                onLoad={this.onLoad}
                fontSize={14}
                height={'175px'}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={this.state.editor.value}
                style={{
                  marginBottom: '10px'
                }}
                editorProps={{
                  $blockScrolling: Infinity
                }}
                onChange={this.onChange}
              />
              {this.props.isAuthenticated &&
                <div>
                  <button
                    className="button is-primary"
                    onClick={this.submitExercise}
                    disabled={this.state.editor.button.isDisabled}
                  >Run Code</button>
                  {this.state.editor.showGrading &&
                    <h5 className="title is-5">
                      <span className="icon is-large">
                        <i className="fas fa-spinner fa-pulse"></i>
                      </span>
                      <span className="grade-text">Grading...</span>
                    </h5>
                  }
                  {this.state.editor.showCorrect &&
                    <h5 className="title is-5">
                      <span className="icon is-large">
                        <i className="fas fa-check"></i>
                      </span>
                      <span className="grade-text">Correct!</span>
                    </h5>
                  }
                  {this.state.editor.showIncorrect &&
                    <h5 className="title is-5">
                      <span className="icon is-large">
                        <i className="fas fa-times"></i>
                      </span>
                      <span className="grade-text">Incorrect!</span>
                    </h5>
                  }
                </div>
              }
              <br/><br/>
            </div>
          }
      </div>
    )
  };
};

export default Exercises;
