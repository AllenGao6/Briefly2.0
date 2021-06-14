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
    maxWidth: 345,
    background: theme.palette.common.icon,
  },
  description: {
    color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
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
          height="140"
          image={bookImage}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h3">
            Math 230
          </Typography>
          <Typography
            variant="body1"
            paragraph
            className={classes.description}
          >
            This is a collection of advance math in multi calculas
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
