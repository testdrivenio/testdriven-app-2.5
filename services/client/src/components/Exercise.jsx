import React from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';
import 'brace/mode/python';
import 'brace/theme/solarized_dark';

const Exercise = (props) => {
  return (
    <div key={props.exercise.id}>
      <h5 className="title is-5">{props.exercise.body}</h5>
      <AceEditor
        mode="python"
        theme="solarized_dark"
        name={(props.exercise.id).toString()}
        fontSize={14}
        height={'175px'}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={props.editor.value}
        style={{
          marginBottom: '10px'
        }}
        editorProps={{
          $blockScrolling: Infinity
        }}
        onChange={props.onChange}
      />
      {props.isAuthenticated &&
        <div>
          <button
            className="button is-primary"
            onClick={(evt) => props.submitExercise(evt, props.exercise.id)}
            disabled={props.editor.button.isDisabled}
          >Run Code</button>
          {props.editor.showGrading &&
            <h5 className="title is-5">
              <span className="icon is-large">
                <i className="fas fa-spinner fa-pulse"></i>
              </span>
              <span className="grade-text">Grading...</span>
            </h5>
          }
          {props.editor.showCorrect &&
            <h5 className="title is-5">
              <span className="icon is-large">
                <i className="fas fa-check"></i>
              </span>
              <span className="grade-text">Correct!</span>
            </h5>
          }
          {props.editor.showIncorrect &&
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
  )
};

Exercise.propTypes = {
  exercise: PropTypes.shape({
    body: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    test_code: PropTypes.string.isRequired,
    test_code_solution: PropTypes.string.isRequired,
  }).isRequired,
  editor: PropTypes.shape({
    button: PropTypes.object.isRequired,
    showCorrect: PropTypes.bool.isRequired,
    showGrading: PropTypes.bool.isRequired,
    showIncorrect: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  submitExercise: PropTypes.func.isRequired,
};

export default Exercise;
