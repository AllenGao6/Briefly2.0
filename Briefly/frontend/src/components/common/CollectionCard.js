import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import bookImage from "../../assets/dummy/book.png";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 360,
    background: theme.palette.common.icon,
  },
  cardText: {
    color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
    marginBottom: "0.25rem",
    maxHeight: "4rem",
    overflow: "scroll",
  },
}));

export default function ImgMediaCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="An image"
          height="150"
          image={bookImage}
          title="Contemplative Reptile"
        />
        <CardContent style={{ paddingBottom: 0, paddingRight: "0.5rem" }}>
          <Typography gutterBottom variant="h4" className={classes.cardText}>
            Math 230
          </Typography>
          <Typography variant="body2" paragraph className={classes.cardText}>
            The collection of whatever stuffs it is supposed to be, this is a
            randomly typed sentence just to make sure it has more words.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Explore
        </Button>
        <Button size="small" color="primary">
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}
