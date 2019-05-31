import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from '../component/listTableComponent.jsx'
import { inject, observer } from 'mobx-react'
import { get, post } from '../tool/http.js'
import Obtained from '../component/icon/obtained.jsx'
import OverlaySelect from '../component/dialog/overlaySelect.jsx'
import DefenseBusinesRenewalFee from '../component/dialog/defenseBusinesRenewalFee.jsx'
import extendElementsComponent from '../tool/extendElementsComponent'
import SetIp from '../component/dialog/setIp.jsx'
import ExpansionComponent from '../component/expansionComponent.jsx'
import Enable from '../component/icon/enable.jsx'
import HighDefenseIpFlowChartDialog from '../component/dialog/highDefenseIpFlowChartDialog.jsx'
import TabComponent from "../component/tabComponent.jsx";

const qs = require('qs')

//组件样式
const styles = theme => ({
    listTableComponent: {
        marginTop: 0,
        borderRadius: "0 0 4px 4px",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    }
});

/**
 * @var columnData table渲染数据的字段的头部名称
 * @var columnData.operat 属性是table表格种对应的操作功能字段，分别有：
 * extendData、extendConfirm、extendElement、extendUrl方法
 * extendData属性是能够以点击的形式通过弹框显示多余数据
 * extendConfirm属性是一个提示框
 * extendElement属性能够渲染你自定义的组件
 * extendUrl属性能指定跳转链接
 */
const columnData = [
    { id: 'name', numeric: true, disablePadding: false, label: '名称' },
    // { id: 'description', numeric: true, disablePadding: false, label: '描述' },
    { id: 'machine_room_name', numeric: true, disablePadding: false, label: '机房' },
    { id: 'protection_value', numeric: true, disablePadding: false, label: '防御值' },
    // { id: 'price', numeric: true, disablePadding: false, label: '价格' },
    { id: 'status', numeric: true, disablePadding: false, label: '上架情况' },
    { id: 'validity_period', numeric: true, disablePadding: false, label: '生效时长' },
    // { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
];
/**
 * @var inputType 添加数据时对应字段的输入组件
 */
const inputType = [
    {
        field: 'overlay_id',
        label: '选择叠加包',
        type: 'component',
        defaultData: [],
        Component: OverlaySelect,
        param: {
            buttonName: '叠加包选择'
        }
    },
    {
        field: "buy_num",
        label: "数量",
        type: "text"
    },
    {
        field: "price",
        label: "价格",
        type: "text"
    }
]

/**
 * 高防IP业务
 */
@inject(stores => ({
    overlayBusinesssStores: stores.overlayBusinesssStores,
    overlaysStores: stores.overlaysStores
}))
@observer
class OverlayBusinessList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: "*"
        };
    }
    componentDidMount () {
        this.props.overlayBusinesssStores.getData({
            user_id: qs.parse(location.search.substr(1)).id,
            status: this.state.value
        }) //获取用户购买的叠加包数据
        this.props.overlaysStores.getData({
            site: "*",
            sell_status: 1
        });//获取叠加包数据
    }

    // 更新数据
    updata () {
        this.props.overlayBusinesssStores.getData({
            user_id: qs.parse(location.search.substr(1)).id,
            status: this.state.value
        }) //根据客户获取叠加包业务数据
    }

    // 添加叠加包业务
    addData = (param, callbrak) => {
        this.props.overlayBusinesssStores.addData(param).then((state) => {
            callbrak(state)
        })
    }

    // 切换状态
    handleChange = (value) => {
        this.props.overlayBusinesssStores.getData({
            user_id: qs.parse(location.search.substr(1)).id,
            status: value
        }) // 根据地区获取业务数据
        this.props.overlayBusinesssStores.type = this.state.value;
        this.setState({ value });
    }

    /**
     * 渲染方法
     * @class ListTableComponent 这个是渲染一个table组件
     */
    render () {
        const { classes } = this.props;
        inputType[inputType.findIndex(item => item.field == 'overlay_id')].defaultData = this.props.overlaysStores.overlays.map(item => {
            return {
                value: item.id,
                text: "名称："+item.name + "  |  机房：" + item.machine_room_name
             }
        });
        let WrapComponent = (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "全部",
                    value: "*"
                },
                {
                    label: "未使用",
                    value: 0
                },
                {
                    label: "使用中",
                    value: 1
                }
            ]}>
            <ListTableComponent
                className={classes.listTableComponent}
                title="叠加包业务管理"
                operattext="叠加包业务"
                inputType={inputType}
                headTitlesData={columnData}
                data={this.props.overlayBusinesssStores.overlayBusiness}
                currentStores={this.props.overlayBusinesssStores}
                updata={this.updata.bind(this)}
                addData={this.addData.bind(this)}
            />
            </TabComponent>
        );
        return WrapComponent;
    }
}
OverlayBusinessList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(OverlayBusinessList);
