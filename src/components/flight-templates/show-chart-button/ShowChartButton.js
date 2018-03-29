import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _isEmpty from 'lodash.isempty';

import request from 'actions/request';
import redirect from 'actions/redirect';

class ShowChartByTemplates extends React.Component {
  buildButton() {
    if (_isEmpty(this.props.flightTemplates.chosenItems)) {
      return '';
    }

    return <span
      className="glyphicon glyphicon-picture"
      aria-hidden="true">
    </span>;
  }

  showChart() {
    if (this.props.flightTemplates.chosenItems.length === 1) {
      this.props.redirect('/chart/'
        + 'flight-id/'+ this.props.flightId + '/'
        + 'template-id/'+ this.props.flightTemplates.chosenItems[0].id + '/'
        + 'from-frame/'+ this.props.startFrame + '/'
        + 'to-frame/'+ this.props.endFrame
      );
    } else if (this.props.flightTemplates.chosenItems.length > 1) {
      let templateName = 'last';
      this.props.request(
        ['flightTemplate', 'merge'],
        'post',
        'TEMPLATES_MERGE',
        {
          flightId: this.props.flightId,
          resultTemplateName: templateName,
          templatesToMerge: JSON.stringify(this.props.flightTemplates.chosenItems)
        }
      ).then((resp) => {
        this.props.redirect('/chart/'
          + 'flight-id/'+ this.props.flightId + '/'
          + 'template-id/'+ resp.id + '/'
          + 'from-frame/'+ this.props.startFrame + '/'
          + 'to-frame/'+ this.props.endFrame
        );
      });
    }
  }

  render() {
    return <ul className="nav navbar-nav navbar-right">
      <li><a href="#" onClick={ this.showChart.bind(this) }>
        { this.buildButton() }
      </a></li>
    </ul>;
  }
}

function mapStateToProps(state) {
  return {
    flightTemplates: state.flightTemplates,
    startFrame: state.flight.selectedStartFrame,
    endFrame: state.flight.selectedEndFrame
  }
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(request, dispatch),
    redirect: bindActionCreators(redirect, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowChartByTemplates);
