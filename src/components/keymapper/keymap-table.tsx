import React, { ReactElement } from 'react'; // we need this to make JSX compile
import { UniversalKeymap } from '../../Connectors/Keymap';
import { Shortcut, SingleShortcut } from '../../Connectors/Shortcut';
import { IShortcutDefinition, ShortcutDefinitions } from '../../Connectors/ShortcutDefinitions';
import { ShortcutElement } from './shortcut';

type KeymapTableProps = {
  keymap: UniversalKeymap;
  shortcutDefinitions: ShortcutDefinitions;
  onClick: (definition: IShortcutDefinition) => void;
};

export const KeymapTable = ({
  keymap,
  shortcutDefinitions,
  onClick,
}: KeymapTableProps): ReactElement => (
  <table>
    <tbody>
      {shortcutDefinitions.definitions.map((definition, index) => {
        return (
          <tr
            key={index}
            onClick={() => onClick(definition)}
          >
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


