import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import {post} from "../tool/http.js";
import ResumeComponent from "../component/dialog/resumeComponent.jsx";
import ResumeIcon from "../component/icon/resume.jsx";
import Reset from "../component/icon/reset.jsx";

const columnData = [
    { id: 'id', numeric: true, disablePadding: false, label: 'ID' },
    { id: 'username', numeric: true, disablePadding: false, label: '用户名' },
    { id: 'name', numeric: true, disablePadding: false, label: '姓名' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    { id: 'updated_at', numeric: true, disablePadding: false, label: '更新时间' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作', extend: true,  extendConfirm: {
        title: "更改账号密码",
        content: "是否要更改此用户账号密码",
        icon: <Reset />,
        ok: (data) => {
            return new Promise((resolve,reject) => {
                post("hr/reset_pass",{
                    username: data.username,
                    id: data.id
                }).then((res) => {
                    if(res.data.code==1) {
                        alert(res.data.msg);
                        resolve(res.data);
                    } else {
                        alert(res.data.msg);
                        resolve(res.data);
                    }
                }).catch(reject);
            });
        }
    },extendElement: (data) => {
        return (
            <ResumeComponent buttonIcon={<ResumeIcon />} {...data} />
        );
    }
 }
];
const inputType = [
    {
        field: "username",
        label: "用户名",
        type: "text"
    },
    {
        field: "name",
        label: "姓名",
        type: "text"
    }
];

const filterType = [

];

@inject("usersStores")
@observer
class UserList extends React.Component {
    componentDidMount() {
        this.props.usersStores.getData();
    }
    addData = (param,callbrak) => {
        this.props.usersStores.addData(param).then((state) => {
          callbrak(state);
        });
    }
    filterData = (param) => {
        const {usersStores} = this.props;
        usersStores.filterData(param);
      }
    render() {
        return (
          <ListTableComponent
            title="员工管理"
            operattext="员工"
            inputType={inputType}
            filterType={filterType}
            headTitlesData={columnData}
            data={this.props.usersStores.users}
            currentStores={this.props.usersStores}
            addData={this.addData.bind(this)}
            filterData={this.filterData.bind(this)}
          />
        );
      }
}
export default UserList;
