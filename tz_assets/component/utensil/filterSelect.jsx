import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
        <TextField
        InputProps={{
            inputRef: ref,
            classes: {
            root: classes.inputRoot,
            },
            ...InputProps,
        }}
        {...other}
        />
    );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion.name) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.name}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {suggestion.name}
        </MenuItem>
    );
}
renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string
};

const styles = theme => ({
    root: {
      flexGrow: 1,
      margin: "10px 0"
    },
    container: {
      flexGrow: 1,
      position: 'relative',
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
    },
    inputRoot: {
        flexWrap: 'wrap',
    }
  });

class FilterSelect extends React.Component {
    state = {
        inputValue: '',
        openSelect: false
    };
    componentDidMount() {
        if(this.props.value && !this.state.inputValue) {
            this.setState({
                inputValue: this.props.value
            });
        }
    }
    getSuggestions = inputValue => {
        const { suggestions } = this.props;
        console.log(suggestions);
        return suggestions.filter(suggestion => {
            const keep =
            (!inputValue || suggestion.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1);

            return keep;
        });
    }
    handleInputChange = event => {
        this.setState({
            inputValue: event.target.value
        });
    };
    handleChange = item => {
        const { suggestions, onChange } = this.props;
        if(suggestions.find(e => e.name===item)) {
            onChange && onChange(suggestions.find(e => e.name===item));
        }
        this.setState({
            inputValue: item,
            openSelect: false
        });
    };
    handleInputFocus = event => {
        this.setState({
            openSelect: true
        });
    }
    handleInputBlur = event => {
        this.setState({
            openSelect: false
        });
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Downshift
                    id="downshift-simple"
                    onChange={this.handleChange}
                    inputValue={this.state.inputValue}
                >
                    {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
                    <div className={classes.container}>
                        {renderInput({
                            fullWidth: true,
                            classes,
                            InputProps: getInputProps({
                                placeholder: this.props.placeholder,
                                onChange: this.handleInputChange,
                                onFocus: this.handleInputFocus,
                                onBlur: this.handleInputBlur
                            }),
                        })}
                        {(isOpen || this.state.openSelect) ? (
                            <Paper className={classes.paper} square>
                                {this.getSuggestions(inputValue).map((suggestion, index) =>
                                    renderSuggestion({
                                        suggestion,
                                        index,
                                        itemProps: getItemProps({ item: suggestion.name }),
                                        highlightedIndex,
                                        selectedItem,
                                    }),
                                )}
                            </Paper>
                        ) : null}
                    </div>
                    )}
                </Downshift>
            </div>
        );
    }
}
FilterSelect.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(FilterSelect);
