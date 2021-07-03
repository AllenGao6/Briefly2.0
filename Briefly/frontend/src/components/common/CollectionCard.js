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
  Divider,
} from "@material-ui/core";
import defaultImage from "../../assets/dummy/book.png";
import MenuPopper from "./MenuPopper";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import StarOutlined from "@material-ui/icons/StarOutlineRounded";
import StarFilled from "@material-ui/icons/StarRounded";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { connect } from "react-redux";
import { selectCollection } from "../../redux/actions/collection_actions";

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

function CollectionCard({
  collection,
  collectionDialog,
  collectionDelete,
  history,
  selectCollection,
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

  const handleClick = () => {
    history.push(`/dashboard/${collection.id}/video`);
  };

  const CardSettings = (
    <MenuList
      autoFocusItem={open}
      onKeyDown={handleListKeyDown}
      style={{
        background: theme.palette.type === "dark" ? "#1e272e" : "white",
      }}
    >
      <MenuItem
        onClick={() => {
          handleClose();
          collectionDialog(collection);
        }}
        className={classes.button}
        style={{ color: theme.palette.common.blue }}
      >
        <EditIcon style={{ fontSize: "1rem", marginRight: "0.5rem" }} />
        Edit
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleClose();
          collectionDelete(collection);
        }}
        className={classes.button}
        style={{ color: theme.palette.common.red }}
      >
        <DeleteIcon style={{ fontSize: "1rem", marginRight: "0.5rem" }} />
        Delete
      </MenuItem>
    </MenuList>
  );

  return (
    <Card className={classes.root} elevation={6}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          alt="An image"
          height="150"
          image={collection.image === null ? defaultImage : collection.image}
          title="Contemplative Reptile"
        />
        <CardContent style={{ paddingBottom: 5 }}>
          <Grid container direction="column">
            <Grid item>
              <Typography
                variant="h4"
                className={classes.cardText}
                style={{ overflow: "hidden" }}
              >
                {collection.name}
              </Typography>
            </Grid>
            <Grid item container justify="space-between" alignItems="center">
              <Grid item style={{ flexGrow: 3 }}>
                {collection.is_archived ? (
                  <StarFilled style={{ color: "#f9ca24" }} />
                ) : (
                  <StarOutlined />
                )}
              </Grid>
              <Grid item>
                <Typography variant="body1" style={{ opacity: 0.6 }}>
                  {`Created At: ${collection.created.slice(0, 10)} by `}
                </Typography>
              </Grid>
              <Grid item style={{ paddingLeft: "0.3rem" }}>
                <Typography variant="body1" style={{ fontStyle: "italic" }}>
                  {collection.get_owner_name}
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

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  selectCollection,
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionCard);
