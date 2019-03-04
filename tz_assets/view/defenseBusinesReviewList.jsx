import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import { get } from "../tool/http.js";
import Approval from "../component/icon/approval.jsx";

const columnData = [
    { id: 'business_number', numeric: true, disablePadding: false, label: '业务号' },
    // { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
    { id: 'price', numeric: true, disablePadding: false, label: '价格' },
    { id: 'status', numeric: true, disablePadding: false, label: '使用状态' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    // { id: 'target_ip', numeric: true, disablePadding: false, label: '绑定IP' }
    { id: 'operat', numeric: true, disablePadding: false, label: '操作', extend: true, extendConfirm: {
        rule: {
            term: "status",
            execute: "待审核",
            type: "equal"
          },
        title: "下架审核",
        content: "是否要通过此下架业务的申请",
        icon: <Approval />,
        select: true,
        selectOptions: [
            {
                text: "通过",
                value: 1,
                default: true
            },
            {
                text: "不通过",
                value: 0
            }
        ],
        ok: (data,param) => {
            return new Promise((resolve,reject) => {
                get("defenseip/order/upExamineDefenseIp",{
                    business_id: data.id,
                    res: param,
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

];

@inject("defenseBusinesReviewsStores")
@observer
class DefenseBusinesReviewList extends React.Component {
    componentDidMount() {
        this.props.defenseBusinesReviewsStores.getData();
    }

    updata() {
        this.props.defenseBusinesReviewsStores.getData();
    }

    render() {
        return (
          <ListTableComponent
            title="高防业务上架审核管理"
            operattext="高防IP相关业务"
            inputType={inputType}
            headTitlesData={columnData}
            data={this.props.defenseBusinesReviewsStores.defenseBusinesReviews}
            currentStores={this.props.defenseBusinesReviewsStores}
            updata={this.updata.bind(this)}
          />
        );
      }
}

export default DefenseBusinesReviewList;
