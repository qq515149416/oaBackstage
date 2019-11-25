import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default ({ open, title, description, handleClose }) => {
  return (
    <Dialog open={open} fullWidth={true} maxWidth="md" onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
        <DialogContentText>
            {description}
        </DialogContentText>
        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
        />
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} color="primary">
            取消
        </Button>
        <Button onClick={handleClose} color="primary">
            确定
        </Button>
        </DialogActions>
    </Dialog>
  );
}
