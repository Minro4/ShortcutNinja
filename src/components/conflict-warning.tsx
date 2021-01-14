import {
  IconButton,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import React from 'react';
import { ReactElement } from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import RemoveIcon from '@material-ui/icons/Remove';
import { IShortcutDefinition } from '../Connectors/ShortcutDefinitions';
import { Shortcut } from '../Connectors/Shortcut';

export interface IShortcutConflict {
  definition: IShortcutDefinition;
  shortcuts: Shortcut[]
}

type ConflictWarningProps = {
  conflicts: IShortcutConflict[];
  onRemove: (conflict: IShortcutConflict) => void;
};

export const ConflictWarning = ({
  conflicts,
  onRemove,
}: ConflictWarningProps): ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const tooltip = conflicts.reduce<string>((str, conflict, idx) => {
    return str + conflict.definition.label + (idx === conflicts.length - 1 ? '' : ', ');
  }, 'Click to resolve conflicts with: ');

  return (
    <>
      {conflicts.length > 0 && (
        <>
          <Tooltip title={tooltip} arrow>
            <IconButton onClick={handleClick} className="conflict-button">
              <WarningIcon fontSize="small"></WarningIcon>
            </IconButton>
          </Tooltip>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} className="conflict-header">
                    The shortcut is already asigned to the following commands,
                    you may remove them if you wish.
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conflicts.map((conflict, index) => (
                  <TableRow key={index}>
                    <TableCell className="keybindings-col">
                      {conflict.definition.label}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Remove" arrow>
                        <IconButton onClick={() => onRemove(conflict)}>
                          <RemoveIcon fontSize="small"></RemoveIcon>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Popover>
        </>
      )}
    </>
  );
};
