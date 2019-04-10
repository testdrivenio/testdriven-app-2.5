import React from 'react';

const Message = (props) => {
  return (
    <div className={`notification is-${props.messageType}`}>
      <button className="delete" onClick={()=>{props.removeMessage()}}></button>
      <span>{props.messageName}</span>
    </div>
  )
};

export default Message;
