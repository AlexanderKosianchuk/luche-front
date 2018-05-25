import React, { Component } from 'react';
import { connect } from 'react-redux';

import Menu from 'controls/menu/Menu';
import Toolbar from 'components/chart/toolbar/Toolbar';
import Workspace from 'components/chart/workspace/Workspace';

class Chart extends Component {
  render () {
    return (
      <div>
        <Menu/>
        <Toolbar flightId={ this.props.flightId } />
        <Workspace
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
