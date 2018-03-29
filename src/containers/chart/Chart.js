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
          flightId={ parseInt(this.props.flightId) }
          templateId={ parseInt(this.props.templateId) }
          fromFrame={ parseInt(this.props.fromFrame) }
          toFrame={ parseInt(this.props.toFrame) }
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    flightId: ownProps.match.params.flightId,
    templateId: ownProps.match.params.templateId,
    fromFrame: ownProps.match.params.fromFrame,
    toFrame: ownProps.match.params.toFrame
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
