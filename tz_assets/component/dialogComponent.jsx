import React from "react";
import PropTypes from 'prop-types';
import AllInput from "./dialog/allInput.jsx";
import Show from "./dialog/show.jsx";
class DialogComponent extends React.Component {
    render() {
        if(this.props.type=="input") {
            const {title,operattext,post,inputType,getRef} = this.props;
            return (
                <AllInput 
                    title={title}
                    operattext={operattext}
                    post={post}
                    inputType={inputType}
                    getRef={ref => getRef(ref)}
                    editData={this.props.editData || null}
                />
            );
        }
        if(this.props.type=="show") {
            return (
                <Show 
                    data = {this.props.data}
                    getRef={ref => this.props.getRef(ref)}
                />
            );
        }
    }
}
DialogComponent.propTypes = {
    type: PropTypes.string.isRequired
};
export default DialogComponent;