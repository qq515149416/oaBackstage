import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject,observer } from "mobx-react";
const qs = require('qs');

const styles = theme => ({
    pStyle: {
    }
});

@inject("businessStores")
@observer 
class StatisticsShowComponent extends React.Component {
    render() {
        return (
            <div>
                <p>客户姓名：{qs.parse(location.search.substr(1)).email}</p>
                <p>资源单价：{this.props.businessStores.statistics.unitPrice}</p>
                <p>时长：{this.props.businessStores.statistics.length}个月</p>
                <p>业务类型：{this.props.businessStores.statistics.businessType}</p>
                <p>产品名称：{this.props.businessStores.statistics.productName}</p>
                <p>总金额：{this.props.businessStores.statistics.statisticsAmount}</p>
            </div>
        );
    }
}
StatisticsShowComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(StatisticsShowComponent);