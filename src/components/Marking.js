import React from 'react';

export default function Marking({ marking }) {
  return (
    <div
      className="absolute"
      style={{
        paddingLeft: '30px',
        paddingRight: '30px',
        paddingTop: '15px',
        paddingBottom: '15px',
      }}
    >
      <div
        className="text-center"
        style={{ fontSize: '60px', paddingLeft: '10px', paddingRight: '10px' }}
      >
        {marking.content}
      </div>
    </div>
  );
}
