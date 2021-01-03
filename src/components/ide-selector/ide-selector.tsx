import React from 'react';
import { FunctionComponent } from 'react';
import { Ide } from '../../Connectors/Ide';

type IdeSelectorProps = {
  ides: Ide[];
};

// we can use children even though we haven't defined them in our CardProps
export const IdeSelector: FunctionComponent<IdeSelectorProps> = ({ ides }) => (
  <div>
    <h2>We detected the following IDEs, select the ides for which you want to use keymap-manager</h2>
  </div>
);
