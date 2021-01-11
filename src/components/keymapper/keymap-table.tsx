import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import React, { ReactElement } from 'react'; // we need this to make JSX compile
import { UniversalKeymap } from '../../Connectors/Keymap';
import { Shortcut } from '../../Connectors/Shortcut';
import {
  IShortcutCategory,
  IShortcutDefinition,
  ShortcutCategories,
} from '../../Connectors/ShortcutDefinitions';
import { ShortcutElement } from './shortcut';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const nbrCols = 2;

type KeymapTableProps = {
  keymap: UniversalKeymap;
  shortcutCategories: ShortcutCategories;
  onClick: (definition: IShortcutDefinition) => void;
  openedCategories: boolean[];
  setOpen: ((value: boolean) => void)[];
};

export const KeymapTable = ({
  keymap,
  shortcutCategories,
  onClick,
  openedCategories,
  setOpen,
}: KeymapTableProps): ReactElement => (
  <TableContainer className="keymap-table">
    <Table size="small" stickyHeader>
      <TableBody>
        {shortcutCategories.categories.map((category, index) => {
          return (
            <CatergoryRow
              key={index}
              onShortcutClick={onClick}
              category={category}
              keymap={keymap}
              open={openedCategories[index]}
              setOpen={setOpen[index]}
            ></CatergoryRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

type CatergoryRowProps = {
  category: IShortcutCategory;
  keymap: UniversalKeymap;
  onShortcutClick: (definition: IShortcutDefinition) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const CatergoryRow = ({
  category,
  keymap,
  onShortcutClick,
  open,
  setOpen,
}: CatergoryRowProps): ReactElement => {
  return (
    <>
      <TableRow className="keymapper-row" onClick={() => setOpen(!open)}>
        <TableCell component="th" scope="row" className="category-header">
          <IconButton
            aria-label="expand row"
            size="small"
            className="collapse-button"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {category.label}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0, border: 0 }} colSpan={nbrCols}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                {category.definitions.map((definition, index) => (
                  <TableRow
                    key={index}
                    onClick={() => onShortcutClick(definition)}
                    className="keymapper-row"
                  >
                    <TableCell className="tab-col"></TableCell>
                    <TableCell className="command-col">
                      {definition.label}
                    </TableCell>
                    <TableCell className="keybindings-col">
                      <ShortcutsList
                        shortcuts={keymap.get(definition.id)}
                      ></ShortcutsList>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

type ShortcutsListProps = {
  shortcuts: Shortcut[];
};

export const ShortcutsList = ({
  shortcuts,
}: ShortcutsListProps): ReactElement => (
  <>
    {shortcuts.map((shortcut, idx) => (
      <Box component="span" key={idx}>
        <ShortcutElement shortcut={shortcut}></ShortcutElement>{' '}
        {idx != shortcuts.length - 1 && ' or '}
      </Box>
    ))}
  </>
);
