import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import TabComponent from "../component/tabComponent.jsx";
import ChecksComponent from "../component/checksComponent.jsx";

const styles = theme => ({
    listTableComponent: {
        marginTop: 0,
        borderRadius: "0 0 4px 4px",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    }
});

let columnData = [
    { id: 'id', numeric: true, disablePadding: false, label: 'ID' },
    { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
    { id: 'site', numeric: true, disablePadding: false, label: '地区' },
    { id: 'protection_value', numeric: true, disablePadding: false, label: '防御值' },
    { id: 'status', numeric: true, disablePadding: false, label: '使用状态' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
];

const inputType = [
    // {
    //     field: "site",
    //     label: "地区",
    //     type: "select",
    //     defaultData: [{
    //         value: 1,
    //         text: "西安"
    //     }],
    //     model: {
    //         selectCode: (data) => {
    //           switch(data) {
    //             case "西安":
    //                 return 1;
    //           }
    //         }
    //     }
    // },
    {
        field: "protection_value",
        label: "防御值",
        type: "text"
    },
    {
        field: "ip_id",
        label: "",
        type: "component",
        Component: ChecksComponent
    }
];
@inject(stores => ({
    defenseipsStores: stores.defenseipsStores,
    MachineRoomsStores: stores.MachineRoomsStores
}))
@observer
class DefenseipList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }
    componentDidMount() {
        this.props.defenseipsStores.getData({
            status: this.state.value,
            site: "*"
        });
        // this.props.MachineRoomsStores.getData();
    }
    delData = (selectedData,callbrak) => {
        const {defenseipsStores} = this.props;
        let delIng = selectedData.map(item => defenseipsStores.delData(item));
        callbrak(delIng);
    }
    addData = (param,callbrak) => {
        this.props.defenseipsStores.addData(param).then((state) => {
            callbrak(state);
        });
    }
    changeData = (param,callbrak) => {
        const {defenseipsStores} = this.props;
        defenseipsStores.changeData(param).then((state) => {
          callbrak(state);
        });
    }
    handleChange = (value) => {
        if(value == 1) {
            columnData = [
                { id: 'id', numeric: true, disablePadding: false, label: 'ID' },
                { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
                { id: 'site', numeric: true, disablePadding: false, label: '地区' },
                { id: 'protection_value', numeric: true, disablePadding: false, label: '防御值' },
                { id: 'user', numeric: true, disablePadding: false, label: '客户账号' },
                { id: 'nickname', numeric: true, disablePadding: false, label: '客户昵称' },
                { id: 'target_ip', numeric: true, disablePadding: false, label: '目标ip' },
                { id: 'status', numeric: true, disablePadding: false, label: '使用状态' },
                { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
            ];
        } else {
            columnData = [
                { id: 'id', numeric: true, disablePadding: false, label: 'ID' },
                { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
                { id: 'site', numeric: true, disablePadding: false, label: '地区' },
                { id: 'protection_value', numeric: true, disablePadding: false, label: '防御值' },
                { id: 'status', numeric: true, disablePadding: false, label: '使用状态' },
                { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
            ];
        }
        this.props.defenseipsStores.getData({
            status: value,
            site: "*"
        });
        this.setState({ value });
    }
    render() {
        const { classes } = this.props;
        // inputType[inputType.findIndex(item => item.field=="site")].defaultData = this.props.MachineRoomsStores.machineRooms.map(item => {
        //     return {
        //       value: item.id,
        //       text: item.machine_room_name
        //     }
        //   });
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
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
                    inputType={inputType}
                    title="高防IP管理"
                    operattext="高防IP"
                    headTitlesData={columnData}
                    addData={this.addData.bind(this)}
                    changeData={this.changeData.bind(this)}
                    delData={this.delData.bind(this)}
                    data={this.props.defenseipsStores.defenseips}
                    currentStores={this.props.defenseipsStores}
                />
          </TabComponent>
        );
      }
}
DefenseipList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(DefenseipList);
