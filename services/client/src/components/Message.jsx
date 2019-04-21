import React from 'react';
import PropTypes from 'prop-types';

const Message = (props) => {
  return (
    <div className={`notification is-${props.messageType}`}>
      <button className="delete" onClick={()=>{props.removeMessage()}}></button>
      <span>{props.messageName}</span>
    </div>
  )
};

Message.propTypes = {
  messageName: PropTypes.string,
  messageType: PropTypes.string,
  removeMessage: PropTypes.func.isRequired,
};

export default Message;
