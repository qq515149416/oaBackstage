import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import { get } from "../tool/http.js";
import Obtained from "../component/icon/obtained.jsx";

const columnData = [
    { id: 'user_name', numeric: true, disablePadding: false, label: '用户名' },
    { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
    { id: 'price', numeric: true, disablePadding: false, label: '价格' },
    { id: 'status', numeric: true, disablePadding: false, label: '使用状态' },
    { id: 'end_at', numeric: true, disablePadding: false, label: '过期时间' },
    { id: 'target_ip', numeric: true, disablePadding: false, label: '绑定IP' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作', extend: true, extendConfirm: {
        rule: {
            term: "status",
            execute: "申请下架",
            type: "equal"
          },
        title: "下架审核",
        content: "是否要通过此下架业务的申请",
        icon: <Obtained />,
        select: true,
        selectOptions: [
            {
                text: "拒绝下架",
                value: 1
            },
            {
                text: "确认下架",
                value: 3,
                default: true
            }
        ],
        ok: (data,param) => {
            return new Promise((resolve,reject) => {
                get("defenseip/remove/goExamine",{
                    business_id: data.id,
                    status: param,
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
    } }
];

const inputType = [

]

@inject("defenseipReviewsStores")
@observer
class DefenseipReviewList extends React.Component {
    componentDidMount() {
        this.props.defenseipReviewsStores.getData();
    }

    updata() {
        this.props.defenseipReviewsStores.getData();
    }

    render() {
        return (
          <ListTableComponent
            title="高防业务管理"
            operattext="高防IP相关业务"
            inputType={inputType}
            headTitlesData={columnData}
            data={this.props.defenseipReviewsStores.defenseipReviews}
            currentStores={this.props.defenseipReviewsStores}
            updata={this.updata.bind(this)}
            {...this.props}
          />
        );
      }
}

export default DefenseipReviewList;
