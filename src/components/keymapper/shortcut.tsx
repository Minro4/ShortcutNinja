import React, { ReactElement } from "react";
import { Shortcut, SingleShortcut } from "../../Connectors/Shortcut";

type ShortcutProps = {
  shortcut: Shortcut;
};

export const ShortcutElement = ({ shortcut }: ShortcutProps): ReactElement => (
  <span>
    <SingleShortcutElement
      singleShortcut={shortcut.sc1}
    ></SingleShortcutElement>
    {shortcut.sc2 && (
      <SingleShortcutElement
        singleShortcut={shortcut.sc2}
      ></SingleShortcutElement>
    )}
  </span>
);

type SingleShortcutProps = {
  singleShortcut: SingleShortcut;
};

const SingleShortcutElement = ({
  singleShortcut,
}: SingleShortcutProps): ReactElement => {
  console.log(singleShortcut);
  const orderedHoldedKeys = singleShortcut.orderedHoldedKeys();
  return (
    <span>
      {orderedHoldedKeys.map((key, idx) => (
        <span key={idx}>
          <KeyElement kbKey={key}></KeyElement>
          {' + '}
        </span>
      ))}
      <KeyElement kbKey={singleShortcut.key}></KeyElement>
    </span>
  );
};

type KeyElementProps = {
  kbKey: string;
};

const KeyElement = ({ kbKey }: KeyElementProps) => <span>{kbKey}</span>;
