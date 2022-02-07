import React, { useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Message from './Message/Message';

const Messages = ({ messages, name }) => {
  const scroll = useRef(null);

  useEffect(() => {
	  scroll.current.scrollToBottom();
  }, [messages]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', paddingTop: 10}}>
		<Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
                            renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                            renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
                            renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                            renderView={props => <div {...props} className="view"/>}
                            autoHide autoHideTimeout={1000} 
                            autoHideDuration={200} ref={scroll}>
			{messages.map((message, i) => <Message key={i} message={message} name={name}/>)}
		</Scrollbars>
    </div>
  )
};

export default Messages;