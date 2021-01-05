import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { ReactElement } from 'react'; // we need this to make JSX compile
import { UniversalKeymap } from '../../Connectors/Keymap';
import { Shortcut } from '../../Connectors/Shortcut';
import {
  IShortcutDefinition,
  ShortcutDefinitions,
} from '../../Connectors/ShortcutDefinitions';
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
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Command</TableCell>
          <TableCell>Keybindings</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {shortcutDefinitions.definitions.map((definition, index) => {
          return (
            <TableRow key={index} onClick={() => onClick(definition)}>
              <TableCell>{definition.label}</TableCell>
              <TableCell>
                <ShortcutsList
                  shortcuts={keymap.get(definition.id)}
                ></ShortcutsList>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
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
