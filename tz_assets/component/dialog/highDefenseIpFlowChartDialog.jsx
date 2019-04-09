import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import FlowChartIcon from '../icon/flowChart.jsx'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import HighDefenseIpFlowChart from '../chart/highDefenseIpFlowChart.jsx'

import { get } from '../../tool/http'
import Button from '@material-ui/core/Button'

const styles = (theme) => ({
    iconButton: {
        ...theme.tableIconButton
    }

})

class HighDefenseIpFlowChartDialog extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            open: false,
            data: []
        }
    }

    handleOpen = () => {
        this.setState({
            open: true
        })
    }
    handleClose = () => {
        this.setState({
            open: false,
            data: []
        })
    }
    handleEntered = () => {
        get('defenseip/remove/getStatistics', {
            timestamp: Date.parse(new Date()) / 1000,
            ip: this.props.ip || ''
        }).then(res => {
            if (res.data.code === 1) {
                if (res.data.data && res.data.data.length > 0) {
                    let dateMap = new Map()
                    let dateSet = new Set()
                    res.data.data.forEach((item, index, arr) => {
                        let date = new Date(item.time * 1000)
                        let dateString = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes()
                        if (dateMap.has(dateString)) {
                            let maxUpstreamBandwidthUp = Math.max(item['upstream_bandwidth_up'], dateMap.get(dateString)['upstream_bandwidth_up'])
                            let maxBandwidthDown = Math.max(item['bandwidth_down'], dateMap.get(dateString)['bandwidth_down'])
                            item['upstream_bandwidth_up'] = maxUpstreamBandwidthUp
                            item['bandwidth_down'] = maxBandwidthDown
                        }
                        dateMap.set(dateString, item)
                    })
                    for (let value of dateMap.values()) {
                        dateSet.add(value)
                    }
                    this.setState({
                        data: dateSet
                    })
                } else {
                    this.setState({
                        data: []
                    })
                }
            } else {
                window.alert(res.data.msg)
                this.setState({
                    data: []
                })
            }
        }).catch(error => {
            this.setState({
                data: []
            })
        })
    }

    render () {
        const { classes } = this.props
        return [
            <Tooltip title="高防IP流量图">
                <IconButton className={classes.iconButton} onClick={this.handleOpen} aria-label="flowChart">
                    <FlowChartIcon/>
                </IconButton>
            </Tooltip>,
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="chart-dialog-title"
                maxWidth="lg"
                fullWidth
                onEntered={this.handleEntered}
            >
                <DialogTitle id="chart-dialog-title">高防IP流量图</DialogTitle>
                <DialogContent>
                    <div style={{
                        height: '350px'
                    }}>
                        {
                            this.state.open ? <HighDefenseIpFlowChart {...this.props} chartData={this.state.data}/> : ''
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        ]
    }
}

HighDefenseIpFlowChartDialog.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(HighDefenseIpFlowChartDialog)
