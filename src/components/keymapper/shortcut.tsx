import { Box, Paper } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Shortcut, SingleShortcut } from '../../Connectors/Shortcut';

type ShortcutProps = {
  shortcut: Shortcut;
};

export const ShortcutElement = ({ shortcut }: ShortcutProps): ReactElement => {
  function mapScToKbList(sc: SingleShortcut): string[] {
    return (sc.orderedHoldedKeys() as string[]).concat(sc.key);
  }

  const kbKeys1 = mapScToKbList(shortcut.sc1);
  const kbKeys2 = shortcut.sc2 ? mapScToKbList(shortcut.sc2) : undefined;
  return (
    <ShortcutKeyListElement
      kbKeys1={kbKeys1}
      kbKeys2={kbKeys2}
    ></ShortcutKeyListElement>
  );
};

type KeyListElementProps = {
  kbKeys1: string[];
  kbKeys2?: string[];
};

export const ShortcutKeyListElement = ({
  kbKeys1,
  kbKeys2,
}: KeyListElementProps): ReactElement => (
  <Box component={Paper} display="inline-block" className="shortcut elevation10">
    <SingleShortcutKeyListElement
      kbKeys={kbKeys1}
    ></SingleShortcutKeyListElement>
    {kbKeys2 && kbKeys2.length !== 0 && (
      <React.Fragment>
        {', '}
        <SingleShortcutKeyListElement
          kbKeys={kbKeys2}
        ></SingleShortcutKeyListElement>
      </React.Fragment>
    )}
  </Box>
);

type SingleShortcutKeyListProps = {
  kbKeys: string[];
};

export const SingleShortcutKeyListElement = ({
  kbKeys,
}: SingleShortcutKeyListProps): ReactElement => {
  return (
    <Box display="inline">
      {kbKeys.map((key, idx) => (
        <span key={idx}>
          <KeyElement kbKey={key}></KeyElement>
          {idx !== kbKeys.length - 1 && ' + '}
        </span>
      ))}
    </Box>
  );
};

type KeyElementProps = {
  kbKey: string;
};

const KeyElement = ({ kbKey }: KeyElementProps) => (
  <Box display="inline" className="key-element">{capitalize(kbKey)}</Box>
);

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
