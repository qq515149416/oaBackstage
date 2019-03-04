import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CommunicationIcon from "../icon/communication.jsx";
import Tooltip from '@material-ui/core/Tooltip';

const styles = (theme) => ({
      iconButton: {
          ...theme.tableIconButton
      }
});


  class Communication extends React.Component {

    render() {
      const { classes, extendComponent } = this.props;
      return (
        <Tooltip title="问题沟通">
            <IconButton className={classes.iconButton} onClick={() => {extendComponent.handleClickOpen(this.props)}} aria-label="communication">
                <CommunicationIcon />
            </IconButton>
        </Tooltip>
      );
    }
  }

  Communication.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(Communication);
