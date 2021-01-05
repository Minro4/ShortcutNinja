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
  <span>
    <SingleShortcutKeyListElement
      kbKeys={kbKeys1}
    ></SingleShortcutKeyListElement>
    {kbKeys2 && (
      <React.Fragment>
        {', '}
        <SingleShortcutKeyListElement
          kbKeys={kbKeys2}
        ></SingleShortcutKeyListElement>
      </React.Fragment>
    )}
  </span>
);

type SingleShortcutKeyListProps = {
  kbKeys: string[];
};

export const SingleShortcutKeyListElement = ({
  kbKeys,
}: SingleShortcutKeyListProps): ReactElement => {
  return (
    <span>
      {kbKeys.map((key, idx) => (
        <span key={idx}>
          <KeyElement kbKey={key}></KeyElement>
          {idx !== kbKeys.length - 1 && ' + '}
        </span>
      ))}
    </span>
  );
};

type KeyElementProps = {
  kbKey: string;
};

const KeyElement = ({ kbKey }: KeyElementProps) => <span>{kbKey}</span>;
