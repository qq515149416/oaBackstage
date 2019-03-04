import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
const columnData = [
  { id: 'contactname', numeric: false, disablePadding: true, label: '姓名' },
  { id: 'qq', numeric: true, disablePadding: false, label: 'QQ' },
  { id: 'mobile', numeric: true, disablePadding: false, label: '手机' },
  { id: 'email', numeric: true, disablePadding: false, label: '邮箱' },
  { id: 'rank', numeric: true, disablePadding: false, label: '权重' },
  { id: 'site', numeric: true, disablePadding: false, label: '显示位置' },
  { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
  { id: 'updated_at', numeric: true, disablePadding: false, label: '更新时间' },
  { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
];
const inputType = [
  {
    field: "contactname",
    label: "姓名",
    type: "text"
  },
  {
    field: "qq",
    type: "text",
    label: "QQ"
  },
  {
    field: "mobile",
    type: "text",
    label: "手机"
  },
  {
    field: "email",
    type: "text",
    label: "邮箱"
  },
  {
    field: "rank",
    type: "text",
    label: "权重"
  },
  {
    field: "site",
    type: "select",
    label: "显示位置",
    defaultData: [
      {
        value: 1,
        text: "左侧"
      },
      {
        value: 2,
        text: "联系人页面"
      },
      {
        value: 3,
        text: "两侧均显示"
      }
    ],
    model: {
      selectCode: (data) => {
        switch(data) {
            case "左侧":
                return 1;
            case "联系人页面":
                return 2;
            case "两侧均显示":
                return 3;
        }
      }
    }
  }
];
@inject("usersLinkInfoStores")
@observer
class UsersLinkList extends React.Component {
  componentDidMount() {
    this.props.usersLinkInfoStores.getData();
  }
  addData = (param,callbrak) => {
    this.props.usersLinkInfoStores.addData(param).then((state) => {
          callbrak(state);
    });
  }
  delData = (selectedData,callbrak) => {
    const {usersLinkInfoStores} = this.props;
    let delIng = selectedData.map(item => usersLinkInfoStores.delData(item));
    callbrak(delIng);
  }
  changeData = (param,callbrak) => {
    const {usersLinkInfoStores} = this.props;
    usersLinkInfoStores.changeData(param).then((state) => {
      callbrak(state);
    });
  }
  render() {
    return (
      <ListTableComponent
        title="联系人信息"
        operattext="联系人信息"
        inputType={inputType}
        headTitlesData={columnData}
        data={this.props.usersLinkInfoStores.user}
        currentStores={this.props.usersLinkInfoStores}
        changeData={this.changeData.bind(this)}
        addData={this.addData.bind(this)}
        delData={this.delData.bind(this)}
      />
    );
  }
}
export default UsersLinkList;
