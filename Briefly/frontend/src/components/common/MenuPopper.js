import React from "react";

import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  Grid,
} from "@material-ui/core";
import IconTextButton from "./IconTextButton";
import { Component } from "react";

export default function MenuPopper({ onClose, anchorEl, open, component }) {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      transition
      placement="bottom"
      disablePortal
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: "top center",
          }}
        >
          <Paper elevation={10}>
            <ClickAwayListener onClickAway={onClose}>
              {component}
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
