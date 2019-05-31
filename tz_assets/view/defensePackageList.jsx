import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import { routerConfig } from "../config/common/config.js";
import TabComponent from "../component/tabComponent.jsx";

const styles = theme => ({
    listTableComponent: {
        marginTop: 0,
        borderRadius: "0 0 4px 4px",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    }
});
const columnData = [
    { id: 'name', numeric: true, disablePadding: false, label: '套餐名字' },
    { id: 'description', numeric: true, disablePadding: false, label: '套餐描述' },
    { id: 'site', numeric: true, disablePadding: false, label: '地区' },
    { id: 'protection_value', numeric: true, disablePadding: false, label: '防御值' },
    { id: 'price', numeric: true, disablePadding: false, label: '价格' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作', extend: true, extendUrl: [
        {
            title: "相关业务",
            link: routerConfig.baseUrl+"/defenseBusines",
            param: ["id"]
        }
      ] }
];

const inputType = [
    {
        field: "name",
        label: "套餐名字",
        type: "text"
    },
    {
        field: "description",
        label: "套餐描述",
        type: "text"
    },
    {
        field: "site",
        label: "地区",
        type: "select",
        rule: {
            type: "add"
          }
    },
    {
        field: "protection_value",
        label: "防御值",
        type: "text",
        rule: {
            type: "add"
          }
    },
    {
        field: "price",
        label: "价格",
        type: "text"
    },
    {
        field: "sell_status",
        radioData: [
          {
            checked: false,
            value: "0",
            label: "下架"
          },
          {
            checked: true,
            value: "1",
            label: "上架"
          }
        ],
        model: {
            selectCode: (data) => {
                switch(data) {
                case "下架":
                    return 0;
                case "上架":
                    return 1;
                default:
                    return 1;
                }
            }
        },
        type: "switch"
      }
];

@inject(stores => ({
    defensePackagesStores: stores.defensePackagesStores,
    MachineRoomsStores: stores.MachineRoomsStores
}))
@observer
class DefensePackageList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: 39
        };
    }
    componentDidMount() {
        // this.props.defensePackagesStores.getData({
        //     site: this.state.value
        // });
        this.props.MachineRoomsStores.getData((data) => {
            if(data.length) {
                this.setState({
                    value: data[data.length-1].id //第一个地区
                });
                this.props.defensePackagesStores.getData({
                    site_id: data[data.length-1].id
                }) // 根据地区获取业务数据
            }
        });
    }
    delData = (selectedData,callbrak) => {
        const {defensePackagesStores} = this.props;
        let delIng = selectedData.map(item => defensePackagesStores.delData(item));
        callbrak(delIng);
    }
    addData = (param,callbrak) => {
        this.props.defensePackagesStores.addData(param).then((state) => {
            callbrak(state);
        });
    }
    handleChange = (value) => {
        // columnData
        this.props.defensePackagesStores.getData({
            site: value
        });
        this.setState({ value });
        this.props.defensePackagesStores.site = value;
    }
    changeData = (param,callbrak) => {
        const {defensePackagesStores} = this.props;
        defensePackagesStores.changeData(param).then((state) => {
          callbrak(state);
        });
    }
    render() {
        const {classes} = this.props;
        inputType[inputType.findIndex(item => item.field=="site")].defaultData = this.props.MachineRoomsStores.machineRooms.map(item => {
            return {
              value: item.id,
              text: item.machine_room_name
            }
          });
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={this.props.MachineRoomsStores.machineRooms.sort((a,b) => b.id - a.id).map(item => {
                return {
                    label: item.machine_room_name,
                    value: item.id
                }
            })}>
                <ListTableComponent
                    className={classes.listTableComponent}
                    inputType={inputType}
                    title="高防套餐管理"
                    operattext="高防套餐"
                    headTitlesData={columnData}
                    addData={this.addData.bind(this)}
                    changeData={this.changeData.bind(this)}
                    delData={this.delData.bind(this)}
                    data={this.props.defensePackagesStores.defensePackages}
                    currentStores={this.props.defensePackagesStores}
                />
            </TabComponent>

        );
    }
}
DefensePackageList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(DefensePackageList);
