import React from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'


class AmountStatisticsChart extends React.Component {
    renderChart (data) {
        const seriesExpansion = {};
        if(this.props.showShadow) {
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
            tooltip: {
                trigger: "item",
                backgroundColor: "#0d91dd",
                formatter: "{c}",
                position: "top"
            },
            xAxis: {
                type: 'category',
                data: ['2019-04', '2019-05', '2019-06', '2019-07', '2019-08', '2019-09', '2019-10']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data,
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
        this.renderChart(this.props.chartData)
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
