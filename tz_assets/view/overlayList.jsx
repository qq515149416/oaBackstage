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
    { id: 'name', numeric: true, disablePadding: false, label: '名称' },
    { id: 'description', numeric: true, disablePadding: false, label: '描述' },
    { id: 'machine_room_name', numeric: true, disablePadding: false, label: '地区' },
    { id: 'protection_value', numeric: true, disablePadding: false, label: '防御值' },
    { id: 'price', numeric: true, disablePadding: false, label: '价格' },
    { id: 'sell_status', numeric: true, disablePadding: false, label: '上架情况' },
    { id: 'validity_period', numeric: true, disablePadding: false, label: '生效时长' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
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
        type: "text",
        rule: {
            type: "add"
          }
    },
    {
        field: "validity_period",
        label: "生效时长",
        type: "text",
        rule: {
            type: "add"
          }
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
          },

        ],
        model: {
            selectCode: (data) => {
                switch(data) {
                case "下架中":
                    return 0;
                case "上架中":
                    return 1;
                default:
                    return 1;
                }
            }
        },
        rule: {
            type: "edit"
        },
        type: "switch"
      }
];

@inject(stores => ({
    overlaysStores: stores.overlaysStores,
    MachineRoomsStores: stores.MachineRoomsStores
}))
@observer
class OverlayList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: 50
        };
    }
    componentDidMount() {
        this.props.overlaysStores.getData({
            site: this.state.value
        });
        this.props.MachineRoomsStores.getData();
    }
    delData = (selectedData,callbrak) => {
        const {overlaysStores} = this.props;
        let delIng = selectedData.map(item => overlaysStores.delData(item));
        callbrak(delIng);
    }
    addData = (param,callbrak) => {
        this.props.overlaysStores.addData(param).then((state) => {
            callbrak(state);
        });
    }
    handleChange = (value) => {
        // columnData
        this.props.overlaysStores.getData({
            site: value
        });
        this.setState({ value });
        this.props.overlaysStores.site = value;
    }
    changeData = (param,callbrak) => {
        const {overlaysStores} = this.props;
        overlaysStores.changeData(param).then((state) => {
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
            <TabComponent onChange={this.handleChange} type={this.state.value} types={this.props.MachineRoomsStores.machineRooms.map(item => {
                return {
                    label: item.machine_room_name,
                    value: item.id
                }
            })}>
                <ListTableComponent
                    className={classes.listTableComponent}
                    inputType={inputType}
                    title="叠加包管理"
                    operattext="叠加包"
                    headTitlesData={columnData}
                    addData={this.addData.bind(this)}
                    changeData={this.changeData.bind(this)}
                    delData={this.delData.bind(this)}
                    data={this.props.overlaysStores.overlays}
                    currentStores={this.props.overlaysStores}
                />
            </TabComponent>

        );
    }
}
OverlayList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(OverlayList);
