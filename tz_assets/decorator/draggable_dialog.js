import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import Button from '../component/dialog/actionButton/button.jsx';

function PaperComponent(props) {
    // return (
    //     <Draggable>
    //         <Paper {...props} />
    //     </Draggable>
    // );
    return (
        <Paper {...props} />
    );
}

export default (params = {}) => Component => class extends React.Component {
    state = {
        open: false
    }
    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }
    handleClickOpen = data => {
        this.setState({
            open: true
        });
        this.data = data;
    }
    handleClose = () => {
        this.setState({
            open: false
        });
    }
    handleShow = () => {
        this.children_ref.show(this.data);
    }
    handlePost = () => {
        this.children_ref.postForm(this.handleClose);
    }
    render() {
        const { title, type } = params;
        return (
            <Dialog
                onClose={this.handleClose}
                open={this.state.open}
                fullWidth
                maxWidth="xl"
                PaperComponent={PaperComponent}
                onEntered={this.handleShow}
                scroll="paper"
                disableBackdropClick
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent style={{paddingBottom: 0}}>
                    <DialogContentText style={{marginBottom: 0}}>
                        <Component {...this.props} getRef={ref => this.children_ref = ref} />
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
                            open={this.handleClose}
                        >
                            取消
                        </Button>
                        <Button 
                            title="确定" 
                            type="normal" 
                            buttonProps={{
                                color: "primary"
                            }} 
                            open={this.handlePost}
                        >
                            确定
                        </Button>
                    </DialogActions>
                ): null}
            </Dialog>
        )
    }
}