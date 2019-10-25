import React from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'


class AmountStatisticsChart extends React.Component {
    renderChart (data,props) {
        const seriesExpansion = {};
        const optionExpansion = {};
        if(props.title) {
            optionExpansion["title"] = {
                text: props.title,
                textAlign: "left"
            };
        }
        if(props.splitNumber) {
            optionExpansion["yAxis"] = {
                splitNumber: props.splitNumber
            };
        }
        if(props.showShadow) {
            seriesExpansion["areaStyle"] = {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(40, 167, 240, 1)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(40, 167, 240, 0)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            };
        }
        const option = {
            ...optionExpansion,
            tooltip: {
                trigger: "item",
                backgroundColor: "#0d91dd",
                formatter: "{c}",
                position: "top"
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item["time"])
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data.map(item => item["amount"]),
                type: 'line',
                ...seriesExpansion
            }]
        }
        // 初始化
        let myChart = echarts.init(document.getElementById(this.props.domId+"ChartDom"),"light");
        // 绘制图表
        myChart.setOption(option, true);
    }
    componentDidMount () {
        const chartData = this.props.chartData ? this.props.chartData : [];
        this.renderChart(chartData,{
            ...this.props
        });
    }
    componentWillReceiveProps (nextProps) {
        const chartData = nextProps.chartData ? nextProps.chartData : [];
        this.renderChart(chartData,{
            ...nextProps
        });
    }
    render () {
        return (<div style={{
            position: "relative",
            height: "324px"
        }}>
            <div id={this.props.domId+"ChartDom"} style={{
                width: '100%',
                height: '100%'
            }}></div>
            {this.props.children && this.props.children}
        </div>);
    }
}
export default AmountStatisticsChart;
