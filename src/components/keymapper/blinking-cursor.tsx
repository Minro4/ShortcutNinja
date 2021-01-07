import React, { Component, ReactElement } from 'react'; // let's also import Component
import { Box } from '@material-ui/core';

type BlinkingCursorProps = {
  interval: number;
};

type BlinkingCursorState = {
  isOn: boolean;
};

export class BlinkingCursor extends Component<
  BlinkingCursorProps,
  BlinkingCursorState
> {
  private handler :NodeJS.Timer;

  public static defaultProps = {
    interval: 500,
  };

  constructor(props: BlinkingCursorProps) {
    super(props);

    this.state = {
      isOn: true,
    };
  }

  // Before the component mounts, we initialise our state
  componentWillMount(): void {
    this.handler = setInterval(() => {
      this.setState({
        ...this.state,
        isOn: !this.state.isOn,
      });
    }, this.props.interval);
  }

  componentWillUnmount(): void {
    clearInterval(this.handler)
  }

  render(): ReactElement {
    return (
      <Box component="span" className="blinking-cursor">
        {this.state.isOn && '|'}
      </Box>
    );
  }
}
