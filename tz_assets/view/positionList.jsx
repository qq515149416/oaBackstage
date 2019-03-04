import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";

const columnData = [
    { id: 'job_number', numeric: true, disablePadding: false, label: '职位编号' },
    { id: 'job_name', numeric: true, disablePadding: false, label: '职位名称' },
    { id: 'slug_name', numeric: true, disablePadding: false, label: '职位标志' },
    { id: 'depart', numeric: true, disablePadding: false, label: '所属部门' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    { id: 'updated_at', numeric: true, disablePadding: false, label: '更新时间' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
];

const inputType = [
    {
        field: "job_number",
        label: "职位编号",
        type: "text"
    },
    {
        field: "job_name",
        label: "职位名称",
        type: "text"
    },
    {
        field: "slug",
        label: "职位标志",
        type: "switch",
        radioData: [
            {
                checked: true,
                value: "1",
                label: "普通"
            },
            {
                checked: false,
                value: "2",
                label: "部门主管"
            },
            {
                checked: false,
                value: "3",
                label: "业务员"
            },
            {
                checked: false,
                value: "4",
                label: "机房人员"
            },
            {
                checked: false,
                value: "5",
                label: "财务人员"
            },
            {
                checked: false,
                value: "6",
                label: "信安人员"
            }
        ]
    },
    {
        field: "depart_id",
        label: "所属部门",
        type: "select",
        defaultData: [],
    }
];

@inject("positionsStores")
@observer
class PositionList extends React.Component {
    componentDidMount() {
        this.props.positionsStores.getDepartmentsData().then(state => {
            if(state) {
                this.props.positionsStores.getData();
            }
        });
    }
    addData = (param,callbrak) => {
        this.props.positionsStores.addData(param).then((state) => {
          callbrak(state);
        });
    }
    changeData = (param,callbrak) => {
        const {positionsStores} = this.props;
        positionsStores.changeData(param).then((state) => {
          callbrak(state);
        });
    }
    delData = (selectedData,callbrak) => {
        const {positionsStores} = this.props;
        let delIng = selectedData.map(item => positionsStores.delData(item));
        callbrak(delIng);
    }
    render() {
        inputType[inputType.findIndex(item => item.field=="depart_id")].defaultData = this.props.positionsStores.departments.map(item => {
            return {
              value: item.id,
              text: item.depart_name
            }
        });
        return (
          <ListTableComponent
            title="职位管理"
            operattext="职位"
            inputType={inputType}
            headTitlesData={columnData}
            data={this.props.positionsStores.positions}
            currentStores={this.props.positionsStores}
            addData={this.addData.bind(this)}
            changeData={this.changeData.bind(this)}
            delData={this.delData.bind(this)}
          />
        );
      }
}
export default PositionList;
