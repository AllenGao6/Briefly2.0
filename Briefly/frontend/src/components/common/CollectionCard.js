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
import StarOutlined from "@material-ui/icons/StarOutlineRounded";
import StarFilled from "@material-ui/icons/StarRounded";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 360,
    height: 264,
    background: theme.palette.common.icon,
  },
  cardText: {
    color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
    marginBottom: "0.25rem",
    maxHeight: "4rem",
    overflow: "scroll",
  },
  button: {
    ...theme.typography.h6,
    fontWeight: 350,
    color: "black",
    "&:hover": {
      background: "rgba(230, 230, 230, 0.4)",
    },
  },
}));

export default function CollectionCard({
  collection,
  collectionDialog,
  collectionDelete,
}) {
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
      <MenuItem
        onClick={() => {
          handleClose();
          collectionDialog(collection);
        }}
        className={classes.button}
      >
        Edit
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleClose();
          collectionDelete(collection);
        }}
        className={classes.button}
      >
        Delete
      </MenuItem>
    </MenuList>
  );

  return (
    <Card className={classes.root} elevation={6}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="An image"
          height="150"
          image={collection.image === null ? defaultImage : collection.image}
          title="Contemplative Reptile"
        />
        <CardContent style={{ paddingBottom: 5 }}>
          <Grid container>
            <Grid item>
              <Typography
                gutterBottom
                variant="h4"
                className={classes.cardText}
              >
                {collection.name}
              </Typography>
            </Grid>
            <Grid item container justify="flex-end">
              <Grid item>
                <Typography variant="body1" style={{ opacity: 0.6 }}>
                  {`Created At: ${collection.created.slice(0, 10)} by ${
                    collection.owner
                  }`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions style={{ paddingTop: 0, paddingBottom: 5 }}>
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
        style={{ borderRadius: 5, background: "white" }}
      />
    </Card>
  );
}
