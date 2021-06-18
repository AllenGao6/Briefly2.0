import React, { useState } from "react";
import {
  makeStyles,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  MenuList,
  MenuItem,
  Grid,
  useTheme,
} from "@material-ui/core";
import defaultImage from "../../assets/dummy/book.png";
import MenuPopper from "./MenuPopper";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 360,
    background: theme.palette.common.icon,
  },
  cardText: {
    color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
    marginBottom: "0.25rem",
    maxHeight: "4rem",
    overflow: "scroll",
  },
  button: {
    "&:hover": {
      background: "rgba(230, 230, 230, 0.4)",
    },
  },
}));

export default function CollectionCard({ collection }) {
  const classes = useStyles();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };

  const handleClose = (e) => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
    setOpen(true);
  };

  const CardSettings = (
    <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
      <MenuItem onClick={handleClose} className={classes.button}>
        Explore
      </MenuItem>
      <MenuItem onClick={handleClose} className={classes.button}>
        Edit
      </MenuItem>
      <MenuItem onClick={handleClose} className={classes.button}>
        Delete
      </MenuItem>
    </MenuList>
  );

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="An image"
          height="150"
          image={defaultImage}
          title="Contemplative Reptile"
        />
        <CardContent style={{ paddingBottom: 0, paddingRight: "0.5rem" }}>
          <Typography gutterBottom variant="h4" className={classes.cardText}>
            {collection.name}
          </Typography>
          <Typography variant="body2" paragraph className={classes.cardText}>
            {collection.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container justify="flex-end">
          <Grid item>
            <IconButton
              size="small"
              onClick={handleOpenMenu}
              className={classes.button}
            >
              <MoreVertIcon
                style={{
                  color:
                    theme.palette.type === "dark"
                      ? "white"
                      : theme.palette.common.grey,
                }}
              />
            </IconButton>
          </Grid>
        </Grid>
      </CardActions>
      <MenuPopper
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        onClose={handleClose}
        component={CardSettings}
        elevation={3}
        style={{ borderRadius: 0, background: "white" }}
      />
    </Card>
  );
}
