import React, { FC, ReactElement, useState } from 'react';
import { Link, Route, Router, Switch } from 'react-router-dom';
import { Connectors } from '../../Connectors';
import { IdeSelector } from '../ide-selector/ide-selector';

export async function ScanWizard(): Promise<ReactElement> {
  const scannedIdes = await Connectors.scan();
  const [ides] = useState(scannedIdes);
  return <div> </div>;
}
