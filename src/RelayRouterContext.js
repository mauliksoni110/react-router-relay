import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import QueryAggregator from './QueryAggregator';

export default class RelayRouterContext extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
  };

  static childContextTypes = {
    queryAggregator: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.queryAggregator = new QueryAggregator(props);
  }

  getChildContext() {
    return {
      queryAggregator: this.queryAggregator,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location === this.props.location) {
      return;
    }

    this.queryAggregator.updateQueryConfig(nextProps);
  }

  renderCallback = (renderArgs) => {
    this.queryAggregator.setRenderArgs(renderArgs);
    return this.props.children;
  };

  render() {
    const lastRoute = this.props.routes[this.props.routes.length - 1];
    const params = Object.values(this.props.params).join(',');
    const forceFetch = lastRoute.forceFetch && !global.__reactRouterRelayForceFetchRoutes[lastRoute.path + params];
    global.__reactRouterRelayForceFetchRoutes[lastRoute.path + params] = lastRoute.forceFetch && true;
    return (
      <Relay.Renderer
        {...this.props}
        Container={this.queryAggregator}
        render={this.renderCallback}
        queryConfig={this.queryAggregator.queryConfig}
        forceFetch={forceFetch}
      />
    );
  }
}
