import {
  Box,
  IconButton,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { ReactElement } from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import RemoveIcon from '@material-ui/icons/Remove';
import { IShortcutDefinition } from '../../Connectors/ShortcutDefinitions';
import { ShortcutElement } from './shortcut';

type ConflictWarningProps = {
  defnitions: IShortcutDefinition[];
  onRemove: (definition: IShortcutDefinition) => void;
};

export const ConflictWarning = ({
  defnitions,
  onRemove
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

  const tooltip = defnitions.reduce<string>((str, defnition, idx) => {
    return str + defnition.label + (idx === defnitions.length - 1 ? '' : ', ');
  }, 'Click to resolve conflicts with: ');

  return (
    <>
      {defnitions.length > 0 && (
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
                {defnitions.map((definition, index) => (
                  <TableRow key={index}>
                    <TableCell className="keybindings-col">
                      {definition.label}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Remove" arrow>
                        <IconButton onClick={()=> onRemove(definition)}>
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
