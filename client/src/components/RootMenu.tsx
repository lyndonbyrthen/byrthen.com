import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import MenuOutlinedIcon from '@material-ui/icons/MenuOutlined';
import Menu from '@material-ui/core/Menu/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const FixedButton = styled(Paper)`
  position: fixed;
  top: 15px;
  left: 15px;

  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

const StyledMenu = styled(Menu)`
  .MuiMenu-paper {
      background-color: rgba(203, 239, 231, 0.85);
  }
`;

const RootMenu = (props:any) => {

    const history = useHistory();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, [setAnchorEl]);

    const handleClose = useCallback((event) => {
        setAnchorEl(null);
        const path = event.target.getAttribute('data-key');
        if (path === null) return;

        const location = {
            pathname: `/${path}`,
            state: { fromDashboard: true }
        };
        history.push(location);
        history.replace(location);
    }, [setAnchorEl, history]);

    return (
        <div>
            <FixedButton
                variant="outlined"
                onClick={handleMenuClick}>
                <MenuOutlinedIcon />
            </FixedButton>

            <StyledMenu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem data-key='audiovisualizer' onClick={handleClose}>Audio visualizer</MenuItem>
                <MenuItem data-key='' onClick={handleClose}>Another app</MenuItem>
                <MenuItem data-key='' onClick={handleClose}>Another app</MenuItem>
            </StyledMenu>
        </div>
    );

}

export default RootMenu;
