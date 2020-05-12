import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import Button from '../component/dialog/actionButton/button.jsx';
import icons from "../component/icon/index.jsx";

function DialogDecorator(props) {
    const [open, setOpen] = React.useState(false);

    const { title, buttonType, type, action, buttonIcon, children } = props;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handlePost = () => {
        // setOpen(false);
        action() && action().postForm && action().postForm(setOpen);
    };

    const handleShow = () => {
        action() && action().show && action().show();
    };

    const IconButton = icons[buttonIcon];

    return [
        buttonType === "normal" ? (
            <Button title={title} type="normal" buttonProps={{
                variant: "contained",
                color: "primary"
            }} open={handleClickOpen}>
                {title}
            </Button>
        ) : (
            <Button title={title} open={handleClickOpen}>
                <IconButton />
            </Button>
        ),
        <Dialog 
            onClose={handleClose} 
            open={open}
            fullWidth
            maxWidth="xl"
            onEntered={handleShow}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent style={{paddingBottom: 0}}>
                <DialogContentText style={{marginBottom: 0}}>
                    {children}
                </DialogContentText>
            </DialogContent>
            {type === "action" ? (
                 <DialogActions>
                    <Button 
                        title="取消" 
                        type="normal" 
                        buttonProps={{
                            color: "primary"
                        }} 
                        open={handleClose}
                    >
                        取消
                    </Button>
                    <Button 
                        title="确定" 
                        type="normal" 
                        buttonProps={{
                            color: "primary"
                        }} 
                        open={handlePost}
                    >
                        确定
                    </Button>
                </DialogActions>
            ): null}
        </Dialog>
    ]
}

export default (params = {}) => Component => class extends React.Component {
    getAction = () => this.content
    render() {
        const { title, buttonType, type, icon } = params;

        return (
            <DialogDecorator title={title} buttonType={buttonType} type={type} buttonIcon={icon} action={this.getAction}>
                <Component {...this.props} getRef={(ref) => this.content = ref}  />
            </DialogDecorator>
        )
    }
}
