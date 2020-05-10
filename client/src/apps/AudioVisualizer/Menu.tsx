import React from 'react';
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Divider from '@material-ui/core/Divider';
import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@material-ui/icons/VolumeOffOutlined';

const Root = styled(Paper)`
  position: fixed;
  top: 70px;
  left: 15px;
  display: flex;
  flexWrap: wrap;
  background-color:  rgba(225,225,225,.15) !important;
`;


export type MenuPropType = {
  handleOpenAudio: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleVisChange: (event: React.MouseEvent<HTMLElement, MouseEvent>, value: any) => void;
  handleMuteToggle: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isMute: boolean;
  assetId: string;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  padding:5px;
  background-color: transparent !important;
  button {
    border: none;
  }
`;

const StyledDivider = styled(Divider)`
  height: auto !important;
`;

const Menu = ({ 
  handleOpenAudio, 
  handleVisChange, 
  handleMuteToggle,
  isMute,
  assetId, 
}: MenuPropType) => {

  return (
    <Root variant="outlined">

      <StyledToggleButtonGroup
        size='small'
        value={assetId}
        exclusive
        onChange={handleVisChange}
        aria-label="visualizer selector"
      >
        <ToggleButton value="wheel" aria-label="wheel">
          wheel
          </ToggleButton>
        <ToggleButton value="landscape" aria-label="landscape">
          landscape
          </ToggleButton>
      </StyledToggleButtonGroup>

      <StyledDivider orientation="vertical" />

      <StyledToggleButtonGroup
        size='small'
      >
        <ToggleButton
          onClick={handleMuteToggle}
        >
         { isMute && <VolumeOffOutlinedIcon />}
         { !isMute && <VolumeUpOutlinedIcon />}
        </ToggleButton>

        <ToggleButton
          onClick={handleOpenAudio}
        >
          <FolderOpenOutlinedIcon />
        </ToggleButton>

        

      </StyledToggleButtonGroup>
    </Root>
  )

}

export default Menu;