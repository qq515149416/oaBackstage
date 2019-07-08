import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { postFile } from "../tool/http";

const styles = theme => ({
    button: {
        margin: "0 5px"
    }
});

class UploadExcelComponent extends React.Component {
    getExcelTemplate = event => {
        const getExcel = this.props.getExcel || "/tz_admin/machine/excel_template";
       window.open(getExcel);
    }
    postExcel = event => {
        const postExcel = this.props.postExcel || "machine/handle_excel";
        this.file.click();
        this.file.onchange = function() {
            const formData = new FormData();
            formData.append("handle_excel",this.files[0])
            postFile(postExcel,formData).then(res => {
                if(res.data.code == 1) {
                    alert(res.data.msg);
                } else {
                    alert(res.data.msg);
                }
            });
        }
     }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Button className={classes.button} onClick={this.getExcelTemplate} variant="contained" color="primary">下载excel模板</Button>
                <Button className={classes.button} onClick={this.postExcel} variant="contained" color="primary">上传excel数据</Button>
                <input type="file" ref={(ref) => this.file = ref} accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{display: "none"}}/>
            </div>
        );
    }
}
UploadExcelComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    getExcel: PropTypes.string,
    postExcel: PropTypes.string
};

export default withStyles(styles)(UploadExcelComponent);
