'use strict';
var React = require('react');
var PropTypes = React.PropTypes;
var Resizable = require('./Resizable');

// An example use of Resizable.
var ResizableBox = module.exports = React.createClass({
  displayName: 'ResizableBox',

  propTypes: {
    lockAspectRatio: PropTypes.bool,
    minConstraints: PropTypes.arrayOf(PropTypes.number),
    maxConstraints: PropTypes.arrayOf(PropTypes.number),
    height: PropTypes.number,
    width: PropTypes.number
  },

  getDefaultProps() {
    return {
      lockAspectRatio: false,
      handleSize: [20,20]
    };
  },

  getInitialState() {
    return {
      width: this.props.width,
      height: this.props.height,
      aspectRatio: this.props.width / this.props.height
    };
  },

  onResize(event, {element, size}) {
    var {width, height} = size;
    var widthChanged = width !== this.state.width, heightChanged = height !== this.state.height;
    if (!widthChanged && !heightChanged) return;

    if (this.props.lockAspectRatio) {
      [width, height] = this.preserveAspectRatio(width, height);
    }

    this.setState({width, height}, () => {
        if (this.props.onResize) {
            this.props.onResize(event, {element, size: {width, height}});
        }
    });
  },

  // If you do this, be careful of constraints
  preserveAspectRatio(width: number, height: number) {
    var [min, max] = [this.props.minConstraints, this.props.maxConstraints];

    height = width / this.state.aspectRatio;
    width = height * this.state.aspectRatio;

    if (min) {
      width = Math.max(min[0], width);
      height = Math.max(min[1], height);
    }
    if (max) {
      width = Math.min(max[0], width);
      height = Math.min(max[1], height);
    }
    return [width, height];
  },

  render() {
    // Basic wrapper around a Resizable instance.
    // If you use Resizable directly, you are responsible for updating the component
    // with a new width and height.
    var {handleSize, minConstraints, maxConstraints, ...props} = this.props;
    return (
      <Resizable
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
        handleSize={handleSize}
        width={this.state.width}
        height={this.state.height}
        onResizeStart={this.props.onResizeStart}
        onResize={this.onResize}
        onResizeStop={this.props.onResizeStop}
        draggableOpts={this.props.draggableOpts}
        >
        <div style={{width: this.state.width + 'px', height: this.state.height + 'px'}} {...props}>
          {this.props.children}
        </div>
      </Resizable>
    );
  }
});
