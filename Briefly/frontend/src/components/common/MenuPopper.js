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
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  popper: {
    borderRadius: 10,
    background: "white",
  },
}));

export default function MenuPopper({
  onClose,
  anchorEl,
  open,
  component,
  placement,
  style,
}) {
  const classes = useStyles();

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      transition
      placement={placement}
      disablePortal
      style={{ zIndex: 1400 }}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: "top center",
          }}
        >
          <Paper elevation={10} classes={{ root: classes.popper }}>
            <ClickAwayListener onClickAway={onClose}>
              {component}
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
