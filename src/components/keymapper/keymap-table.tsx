import React, { ReactElement } from 'react'; // we need this to make JSX compile
import { UniversalKeymap } from '../../Connectors/Keymap';
import { Shortcut, SingleShortcut } from '../../Connectors/Shortcut';
import { ShortcutDefinitions } from '../../Connectors/ShortcutDefinitions';

type KeymapTableProps = {
  keymap: UniversalKeymap;
  shortcutDefinitions: ShortcutDefinitions;
};

export const KeymapTable = ({
  keymap,
  shortcutDefinitions,
}: KeymapTableProps): ReactElement => (
  <table>
    <tbody>
      {shortcutDefinitions.definitions.map((definition, index) => {
        return (
          <tr key={index}>
            <td>{definition.label}</td>
            <td>
              <ShortcutsList
                shortcuts={keymap.get(definition.id)}
              ></ShortcutsList>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

type ShortcutsListProps = {
  shortcuts: Shortcut[];
};

const ShortcutsList = ({ shortcuts }: ShortcutsListProps): ReactElement => (
  <label>
    {shortcuts.map((shortcut, idx) => (
      <span key={idx}>
        <ShortcutElement shortcut={shortcut}></ShortcutElement>{' '}
        {idx != shortcuts.length - 1 && ' or '}
      </span>
    ))}
  </label>
);

type ShortcutProps = {
  shortcut: Shortcut;
};

const ShortcutElement = ({ shortcut }: ShortcutProps): ReactElement => (
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
  console.log(singleShortcut)
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
