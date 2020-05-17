import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import styled from 'styled-components';

const Stage = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  > * {
    width: 100%;
  }

`;

const Loading = () => {
  return (
    <Stage>
      <LinearProgress />
    </Stage>
  );
}

export default Loading;