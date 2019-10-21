import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";

import AddOrder from "../component/dialog/addOrder.jsx";

const columnData = [
    { id: 'ip', numeric: true, disablePadding: true, label: 'IP地址' },
    { id: 'vlan', numeric: true, disablePadding: false, label: 'vlan' },
    {
      id: 'ip_company',
      numeric: true,
      disablePadding: false,
      label: '所属运营商'
    },
    { id: 'ip_status', numeric: true, disablePadding: false, label: '使用状态' },
    { id: 'ip_lock', numeric: true, disablePadding: false, label: '锁定状态' },
    { id: 'ip_note', numeric: true, disablePadding: false ,label: '备注信息' },
    {
      id: 'ip_comproomname',
      numeric: true,
      disablePadding: false,
      label: '所属机房'
    },
    // { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    // { id: 'updated_at', numeric: true, disablePadding: false, label: '更新时间' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作', extend: true, extendElement: (data) => {
        return (
            <AddOrder {...data} nameParam="ip" />
        )
} }
];
const inputType = [
  {
    field: "ip",
    label: "IP地址",
    type: "text",
    rule: {
      term: "edit",
      execute: "disabled",
      type: "edit"
    }
  },
  {
    field: "ip_start",
    label: "IP起始段",
    type: "text",
    rule: {
      type: "add"
    },
    helperText: "如果只要添加一个ip只写IP起始段即可"
  },
  {
    field: "ip_end",
    label: "IP结束段",
    type: "text",
    rule: {
      type: "add"
    }
  },
  {
    field: "vlan",
    label: "vlan",
    type: "text"
  },
  {
    field: "ip_company",
    radioData: [
      {
        checked: true,
        value: "0",
        label: "电信"
      },
      {
        checked: false,
        value: "1",
        label: "移动"
      },
      {
        checked: false,
        value: "2",
        label: "联通"
      },
      {
        checked: false,
        value: "3",
        label: "BGP"
      }
    ],
    model: {
      selectCode: (data) => {
        switch(data) {
          case "电信公司":
              return 0;
          case "移动公司":
              return 1;
          case "联通公司":
              return 2;
          case "BGP":
              return 3;
        }
      }
    },
    type: "switch"
  },
  {
    field: "ip_status",
    radioData: [
      {
        checked: true,
        value: "0",
        label: "未使用"
      },
      {
        checked: false,
        value: "1",
        label: "使用中"
      }
    ],
    model: {
      selectCode: (data) => {
        switch(data) {
          case "未使用":
              return 0;
          case "使用中":
              return 1;
        }
      }
    },
    type: "switch"
  },
  {
    field: "ip_lock",
    radioData: [
      {
        checked: true,
        value: "0",
        label: "未锁定"
      },
      {
        checked: false,
        value: "1",
        label: "锁定"
      }
    ],
    model: {
      selectCode: (data) => {
        switch(data) {
          case "未锁定":
              return 0;
          case "锁定":
              return 1;
        }
      }
    },
    type: "switch"
  },
  {
    field: "ip_note",
    label: "备注信息",
    type: "text"
  },
  {
    field: "ip_comproom",
    label: "所属机房",
    type: "select",
    defaultData: []
  }
];

const filterType = [
  {
    field: "ip_company",
    label: "所属运营商",
    options: [
      {
        view: "电信公司"
      },
      {
        view: "移动公司"
      },
      {
        view: "联通公司"
      },
      {
        view: "BGP"
      }
    ],
    type: "select"
  },
  {
    field: "ip_status",
    label: "使用状态",
    options: [
      {
        view: "未使用"
      },
      {
        view: "使用中"
      }
    ],
    type: "select"
  },
  {
    field: "ip_lock",
    label: "锁定状态",
    options: [
      {
        view: "未锁定"
      },
      {
        view: "锁定"
      }
    ],
    type: "select"
  },
  {
    field: "created_at",
    label: "创建时间",
    type: "date"
  }
];
@inject("ipsStores")
@observer
class IpList extends React.Component {
  componentDidMount() {
    this.props.ipsStores.getData();
  }
  addData = (param,callbrak) => {
    // console.log(param);
    this.props.ipsStores.addData(param).then((state) => {
      callbrak(state);
    });
  }
  delData = (selectedData,callbrak) => {
    const {ipsStores} = this.props;
    let delIng = selectedData.map(item => ipsStores.delData(item));
    callbrak(delIng);
  }
  changeData = (param,callbrak) => {
    const {ipsStores} = this.props;
    ipsStores.changeData(param).then((state) => {
      callbrak(state);
    });
  }
  filterData = (param) => {
    const {ipsStores} = this.props;
    ipsStores.filterData(param);
  }
  render() {
    inputType[inputType.findIndex(item => item.field=="ip_comproom")].defaultData = this.props.ipsStores.comprooms.map(item => {
      return {
        value: item.roomid,
        text: item.machine_room_name
      }
    });
    return (
      <ListTableComponent
        title="ip资源库"
        operattext="ip资源"
        inputType={inputType}
        filterType={filterType}
        headTitlesData={columnData}
        data={this.props.ipsStores.ips}
        currentStores={this.props.ipsStores}
        addData={this.addData.bind(this)}
        delData={this.delData.bind(this)}
        changeData={this.changeData.bind(this)}
        filterData={this.filterData.bind(this)}
      />
    );
  }
}
export default IpList;
