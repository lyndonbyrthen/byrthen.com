import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import Visualizer from './Visualizer';
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import WheelAsset from './VisualizerAsset/WheelAsset';
import BarAsset from './VisualizerAsset/BarAsset';
import Button from '@material-ui/core/Button';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import Menu from './Menu';

const Stage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  
  canvas {
    left: 0;
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

const Hidden = styled.div`
  visibility: hidden;
`;

const AudioVisualizer = () => {

  const stageRef = useRef(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const audio = useMemo(() => new Audio(), []);
  const audioCtx = useMemo(() => new AudioContext(), []);
  const vis = useMemo(() => new Visualizer(), []);

  const [assetId, setAssetId] = useState('wheel');
  const [audioSrc, setAudioSrc] = useState('/assets/Actraiser.mp3');
  const [isMute, setIsMute] = useState(true);

  useEffect(() => {
    vis.parent = stageRef.current;
    return () => {
      vis.kill();
      audio.pause();
    }
  }, [vis, audio, stageRef]);

  useEffect(() => {
    if (assetId === 'wheel') {
      vis.asset = new WheelAsset();
      vis.pause(false);
    } else if (assetId === 'landscape') {
      vis.asset = new BarAsset();
      vis.pause(false);
    }
  }, [vis, assetId]);

  useEffect(() => {
    if (!audioSrc) return;
      audio.src = audioSrc;
  }, [audioSrc, audio]);

  useEffect(() => {
    const src = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 512;
    vis.setAnalyser(analyser);
  }, [audio, vis, audioCtx]);

  useEffect(() => {
    (async function () {
      const response = await fetch('./assets/recording.json');
      const recordedMap = await response.json();
      vis.setRecordedMap(recordedMap);
    })();
  });

  useEffect(() => {
    const handleResize = () => {
      vis.kill();
      vis.create();
      vis.pause(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [vis]); 

  useEffect(()=>{
    (async function() {
      vis.isMute = isMute;
      if (isMute) {
        audio.pause();
      } else if (audioSrc) {
        await audio.play();
      }
    })();
  },[isMute, vis, audio, audioSrc]);

  const handleChangeAudio = useCallback((event) => {
    const files = fileRef.current?.files;
    if (!files?.[0]) return;
    setAudioSrc(URL.createObjectURL(files[0]));
    setIsMute(false);
  }, [fileRef]);

  const handleVisChange = useCallback((event, value) => {
    const assetId = value;
    setAssetId(assetId);
  }, [setAssetId]);

  const handleOpenAudio = useCallback((event) => {
    fileRef.current?.click();
  }, [fileRef]);

  const handleMuteToggle = useCallback((event) => {
    setIsMute(!isMute);
  }, [isMute, setIsMute]);

  return (
    <Stage ref={stageRef}>
      <Menu
        handleOpenAudio={handleOpenAudio}
        handleVisChange={handleVisChange}
        handleMuteToggle={handleMuteToggle}
        assetId={assetId}
        isMute={isMute}
      />
     
      <Hidden>
        <input ref={fileRef} onChange={handleChangeAudio} type="file" />
      </Hidden>

    </Stage>
  )

}

export default AudioVisualizer;