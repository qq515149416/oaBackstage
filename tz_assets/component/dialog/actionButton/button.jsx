import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
})

const CustomIconButton = (props) => {
    const { title, open, children, classes, type, buttonProps } = props;
    const Component = (type && type === "normal") ? Button : IconButton;
    return (
        <Tooltip title={title}>
            <Component 
                className={(type && type === "normal") ? null : classes.iconButton} 
                {...buttonProps}
                onClick={open}
            >
                {children}
            </Component>
        </Tooltip>
    )
}

CustomIconButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomIconButton)