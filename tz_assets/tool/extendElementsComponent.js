
import React from "react";
export default (components) => class extends React.Component {
    render() {
        return [
            ...components.map(ItemComponents => <ItemComponents {...this.props} />)
        ];
    }
}