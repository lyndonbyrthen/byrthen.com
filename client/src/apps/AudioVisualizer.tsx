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

const Canvas = styled.div`
  canvas {
    left: 0;
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
`;

const Hidden = styled.div`
  visibility: hidden;
`;

const AudioVisualizer = () => {

  const canvasRef = useRef(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const audio = useMemo(() => new Audio(), []);
  const vis = useMemo(() => new Visualizer(), []);

  const [isUserInteraction, setIsUserInteraction] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext>();
  const [assetId, setAssetId] = useState('wheel');
  const [audioSrc, setAudioSrc] = useState('');
  const [isMute, setIsMute] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const playAudio = useCallback(() => {
    (async function () {
      try {
        if (audioSrc) {
          await audio.play();
          setIsMute(false);
        }
      } catch (e) {
        setErrorMessage(String(e));
        setIsOpen(true);
      }
    })();
  }, [audioSrc]);

  //Only initiate AudioContext after user interaction, otherwise chrome throws an error.
  useEffect(()=>{
    if (isUserInteraction) {
      setAudioCtx(new AudioContext());
    }
  },[isUserInteraction]);

  //On canvasRef instantiation
  useEffect(() => {
    vis.parent = canvasRef.current;
  }, [canvasRef]);

  //On asset change
  useEffect(() => {
    if (assetId === 'wheel') {
      vis.asset = new WheelAsset();
      vis.pause(false);
    } else if (assetId === 'landscape') {
      vis.asset = new BarAsset();
      vis.pause(false);
    }
  }, [assetId]);

  //On audioSrc change
  useEffect(() => {
    if (!audioSrc) return;
    audio.src = audioSrc;
    playAudio();
  }, [audioSrc, playAudio]);

  //On audioCtx instantiation
  useEffect(() => {
    if (!audioCtx) return;
    const src = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 512;
    vis.setAnalyser(analyser);
  }, [audioCtx]);

  //Execuated once on mount
  useEffect(() => {
    // console.log('on mount')

    (async function () {
      const response = await fetch('./assets/recording.json');
      const recordedMap = await response.json();
      vis.setRecordedMap(recordedMap);
    })();

    const handleResize = () => {
      vis.kill();
      vis.create();
      vis.pause(false);
    };

    const handleAudioPause = () => {
      if (audio.paused) {
        setIsMute(true);
      }
    };

    window.addEventListener('resize', handleResize);
    audio.addEventListener('ended', handleAudioPause);

    return () => {
      // console.log('on unmount')
      vis.kill();
      audio.pause();
      window.removeEventListener('resize', handleResize);
      audio.removeEventListener('ended', handleAudioPause);
    };
  }, []);

  //On isMute change
  useEffect(() => {
    vis.isMute = isMute;
  }, [isMute]);

  const handleChangeAudio = useCallback(
    (event) => {
      const files = fileRef.current?.files;
      if (!files?.[0]) return;
      setAudioSrc(URL.createObjectURL(files[0]));
    },
    [fileRef]
  );

  const handleOpenAudio = useCallback(
    (event) => {
      setIsUserInteraction(true);
      fileRef.current?.click();
    },
    [fileRef]
  );

  const handleVisChange = useCallback(
    (event, value) => {
      const assetId = value;
      setAssetId(assetId);
    },
    [setAssetId]
  );

  const handleMuteToggle = useCallback(
    (event) => {

      setIsUserInteraction(true);

      if (!audioSrc) {
        setAudioSrc('/assets/Actraiser.mp3');
        return;
      }

      if (audio.paused) {
        playAudio();
      } else {
        audio.pause();
        setIsMute(true);
      }
    },
    [audioSrc, playAudio, setIsUserInteraction]
  );

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
  };

  return (
    <Stage>
      <Canvas ref={canvasRef} />
      <Menu
        handleOpenAudio={handleOpenAudio}
        handleVisChange={handleVisChange}
        handleMuteToggle={handleMuteToggle}
        assetId={assetId}
        isMute={isMute}
      />

      <Hidden>
        <input ref={fileRef} onChange={handleChangeAudio} type='file' />
      </Hidden>

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MuiAlert onClose={handleClose} severity='error'>
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </Stage>
  );
};

export default AudioVisualizer;
