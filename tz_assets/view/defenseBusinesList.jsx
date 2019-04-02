import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import { get, post } from "../tool/http.js";
import Obtained from "../component/icon/obtained.jsx";
import DefensePackageSelect from "../component/dialog/defensePackageSelect.jsx";
import DefenseBusinesRenewalFee from "../component/dialog/defenseBusinesRenewalFee.jsx";
import extendElementsComponent from "../tool/extendElementsComponent";
import SetIp from "../component/dialog/setIp.jsx";
import ExpansionComponent from "../component/expansionComponent.jsx";
import Enable from "../component/icon/enable.jsx";

const qs = require('qs');
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
    { id: 'user_name', numeric: true, disablePadding: false, label: '用户名' },
    { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
    { id: 'price', numeric: true, disablePadding: false, label: '价格' },
    { id: 'status', numeric: true, disablePadding: false, label: '使用状态' },
    { id: 'end_at', numeric: true, disablePadding: false, label: '过期时间' },
    { id: 'target_ip', numeric: true, disablePadding: false, label: '绑定IP' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作', extend: true, extendElement: (data,update) => {
        let Element = extendElementsComponent([
            // DefensePackageSelect,
            DefenseBusinesRenewalFee,
            SetIp
        ]);
        return (<Element
            {...data}
            update={update}
            postUrl="defenseip/order/renewByAdmin"
            nameParam="business_number"
            type="高防IP业务"
            />);
    }, extendConfirm: {
        rule: {
            term: "status",
            execute: "正在使用",
            type: "equal"
          },
        title: "下架申请",
        content: "是否要下架次业务",
        icon: <Obtained />,
        ok: (data) => {
            return new Promise((resolve,reject) => {
                get("defenseip/remove/subExamine",{
                    business_id: data.id,
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
/**
 * @var inputType 添加数据时对应字段的输入组件
 */
const inputType = [
    {
        field: "package_id",
        label: "选择套餐",
        type: "component",
        defaultData: [],
        Component: DefensePackageSelect,
        param: {
            buttonName: "套餐选择"
        }
    }
]
/**
 * 高防IP业务
 */
@inject(stores => ({
    defenseBusinessStores: stores.defenseBusinessStores,
    defensePackagesStores: stores.defensePackagesStores
}))
@observer
class DefenseBusinesList extends React.Component {
    componentDidMount() {
        this.props.defensePackagesStores.getData({
            site: "*"
        }); //获取高防ip套餐数据
        if(qs.parse(location.search.substr(1)).email && qs.parse(location.search.substr(1)).id) {
            this.props.defenseBusinessStores.getData({
                customer_id: qs.parse(location.search.substr(1)).id
            }); //根据客户获取业务数据
        } else {
            if(qs.parse(location.search.substr(1)).id) {
                this.props.defenseBusinessStores.getData({
                    package_id: qs.parse(location.search.substr(1)).id
                }); //根据套餐获取业务数据
            }
        }

    }
// 更新数据
    updata() {
        if(qs.parse(location.search.substr(1)).email && qs.parse(location.search.substr(1)).id) {
            this.props.defenseBusinessStores.getData({
                customer_id: qs.parse(location.search.substr(1)).id
            }); //根据客户获取业务数据
        } else {
            if(qs.parse(location.search.substr(1)).id) {
                this.props.defenseBusinessStores.getData({
                    package_id: qs.parse(location.search.substr(1)).id
                }); //根据套餐获取业务数据
            }
        }
    }
// 添加高防IP业务
    addData = (param,callbrak) => {
        this.props.defenseBusinessStores.addData(param).then((state) => {
            callbrak(state);
        });
    }
/**
 * 渲染方法
 * @class ListTableComponent 这个是渲染一个table组件
 */
    render() {
        inputType[inputType.findIndex(item => item.field=="package_id")].defaultData = this.props.defensePackagesStores.defensePackages.map(item => {
            return {
              value: item.id,
              text: item.name
            }
        });
        return (
          <ListTableComponent
            title="高防业务管理"
            operattext="高防IP相关业务"
            inputType={inputType}
            headTitlesData={columnData}
            data={this.props.defenseBusinessStores.defenseBusiness}
            currentStores={this.props.defenseBusinessStores}
            updata={this.updata.bind(this)}
            addData={this.addData.bind(this)}
          />
        );
      }
}

export default DefenseBusinesList;
