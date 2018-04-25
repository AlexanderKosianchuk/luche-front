import React, { Component } from 'react';
import { connect } from 'react-redux';

import Menu from 'controls/menu/Menu';
import Toolbar from 'components/chart/toolbar/Toolbar';
import Workspace from 'components/chart/workspace/Workspace';

class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      threeDimIsShown: true
    };
  }

  toggleThreeDimIsShown() {
    this.setState({
      threeDimIsShown: !this.state.threeDimIsShown
    });
  }

  render () {
    return (
      <div>
        <Menu/>
        <Toolbar
          flightId={ this.props.flightId }
          threeDimIsShown={ this.state.threeDimIsShown }
          toggleThreeDimIsShown={ this.toggleThreeDimIsShown.bind(this) }
        />
        <Workspace
          threeDimIsShown={ this.state.threeDimIsShown }
          flightId={ this.props.flightId }
          templateId={ this.props.templateId }
          fromFrame={ this.props.fromFrame }
          toFrame={ this.props.toFrame }
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    flightId: parseInt(ownProps.match.params.flightId),
    templateId: parseInt(ownProps.match.params.templateId),
    fromFrame: parseInt(ownProps.match.params.fromFrame),
    toFrame: parseInt(ownProps.match.params.toFrame)
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
