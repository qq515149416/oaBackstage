import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { componentConfig } from '../../config/component_config';
const { clientele } = componentConfig;

export default ({ menus }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [menuItem, setMenuItem] = React.useState({});

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleComponentOpen = name => () => {
    setMenuItem(Object.assign({},menuItem,{
        [name]: true
    }));
  }
  const handleComponentClose = name => {
    setMenuItem(Object.assign({},menuItem,{
        [name]: false
    }));
  }

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        更多
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
          {menus.map(item => (
              <MenuItem onClick={handleComponentOpen(item.component)}>{item.buttonName}</MenuItem>
          ))}
      </Menu>
        {
           menus.map(item => {
                const Component = clientele[item.component];
                return (
                    <Component open={menuItem[item.component]} handleClose={() => {
                        handleComponentClose(item.component);
                    }} {...item.props} />
                );
            })
        }
    </div>
  );
}
