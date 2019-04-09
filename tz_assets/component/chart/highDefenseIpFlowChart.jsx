import React from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

class HighDefenseIpFlowChart extends React.Component {

    constructor (props) {
        super(props)
    }

    formateDate = value => value < 10 ? '0' + value : '' + value

    renderChart (data) {
        // 出流量，单位:(M)
        let outflow = []
        // 入流量，单位:(M)
        let inflow = []
        for (let x of data) {
            let date = new Date(x.time * 1000)
            inflow.push([date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + this.formateDate(date.getHours()) + ':' + this.formateDate(date.getMinutes()) + ':' + this.formateDate(date.getSeconds()), x.bandwidth_down.toFixed(3)])
        }
        for (let x of data) {
            let date = new Date(x.time * 1000)
            outflow.push([date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + this.formateDate(date.getHours()) + ':' + this.formateDate(date.getMinutes()) + ':' + this.formateDate(date.getSeconds()), x.upstream_bandwidth_up.toFixed(3)])
        }
        const option = {
            animation: false,
            title: {
                left: 'center',
                text: this.props.ip ? this.props.ip + ' —— 高防流量数据' : '高防流量数据',
                subtext: '上传流量和下载流量（单位为M）'
            },
            legend: {
                x: 'left',
                data: ['上传流量', '下载流量']
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'time',
                splitNumber: 20,
                axisPointer: {
                    snap: true,
                    lineStyle: {
                        color: '#004E52',
                        opacity: 0.5,
                        width: 2
                    },
                    label: {
                        show: true,
                        formatter: function (params) {
                            return echarts.format.formatTime('yyyy-MM-dd hh:mm:ss', params.value)
                        },
                        backgroundColor: '#004E52'
                    }
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    inside: true
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}\n'
                },
                z: 10
            },
            grid: {
                top: 110,
                left: 80,
                right: 60,
                height: 160
            },
            series: [
                {
                    name: '下载流量',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    showAllSymbol: false,
                    itemStyle: {
                        normal: {
                            color: '#8ec6ad'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#8ec6ad'
                            }, {
                                offset: 1,
                                color: '#ffe'
                            }])
                        }
                    },
                    data: inflow
                },
                {
                    name: '上传流量',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    showAllSymbol: false,
                    itemStyle: {
                        normal: {
                            color: '#d68262'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#d68262'
                            }, {
                                offset: 1,
                                color: '#ffe'
                            }])
                        }
                    },
                    data: outflow
                }
            ]
        }
        // 初始化
        let myChart = echarts.init(document.getElementById('dom'))
        // 绘制图表
        myChart.setOption(option, true)
    }

    componentDidMount () {
        this.renderChart(this.props.chartData)
    }

    componentWillReceiveProps (nextProps) {
        this.renderChart(nextProps.chartData)
    }

    render () {
        return (
            <div id="dom" style={{
                width: '90%',
                margin: '0 auto',
                height: '100%'
            }}></div>
        )
    }
}

export default HighDefenseIpFlowChart

