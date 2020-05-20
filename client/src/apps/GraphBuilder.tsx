import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import Snackbar from '@material-ui/core/Snackbar';
import Visualizer from './AudioVisualizer/components/Visualizer';
import WheelAsset from './AudioVisualizer/VisualizerAsset/WheelAsset';
import BarAsset from './AudioVisualizer/VisualizerAsset/BarAsset';
import Menu from './AudioVisualizer/components/Menu';
import { Paper } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Stage = styled(Paper)`
  position: absolute;
  width: 100%;
  height: 100%;
`;
const GraphBuilder = () => {
  return <Stage>Graph Builder</Stage>;
};

export default GraphBuilder;
