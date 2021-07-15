import React, { Component } from "react";
// redux
import { connect } from "react-redux";
import { loadVideosInCollection } from "../../redux/actions/video_actions";
import { loadAudiosInCollection } from "../../redux/actions/audio_actions";
// material-ui
import { withStyles } from "@material-ui/styles";
import { Grid, Button, Typography } from "@material-ui/core";
// briefly component
import WorkspaceBar from "../common/WorkspaceBar";
import MediaScrollbar from "../common/MediaScrollbar";
import WorkspaceContent from "../common/WorkspaceContent";
//resizeable grid experimenting
import { Rnd } from "react-rnd";

const useStyles = (theme) => {
  const matchesDark = theme.palette.type === "dark";

  return {
    root: {
      background: matchesDark ? "red" : "blue",
    },
  };
};

class Workspace extends Component {
  state = {
    navbarOpen: false,
    search: "",
    x: 0,
    y: 0,
    width: 320,
    height: 200,
  };

  componentDidMount = () => {
    this.props.loadVideosInCollection(this.props.match.params.id);
    this.props.loadAudiosInCollection(this.props.match.params.id);
  };

  setSearch = (search) => {
    this.setState({ search });
  };
  handleDrawerToggle = () => {
    this.setState({ navbarOpen: !this.state.navbarOpen });
  };

  filter_media = (medias) => {
    return medias.filter((item) =>
      item.title.toLowerCase().includes(this.state.search.toLowerCase())
    );
  };

  getMedia = () => {
    switch (this.props.match.params.mediaType) {
      case "video":
        return this.props.videos;
      case "audio":
        return this.props.audios;
      case "text":
      default:
        return [];
    }
  };

  render() {
    const { classes, history, videos, audios, match } = this.props;
    const { navbarOpen, search } = this.state;
    const media_type = match.params.mediaType;
    const filter = this.filter_media;

    //console.log('this is ',videos);
    return (
      <React.Fragment>
        <MediaScrollbar
          open={navbarOpen}
          onClose={this.handleDrawerToggle}
          history={history}
          isWorkspace={true}
          setSearch={this.setSearch}
          search={search}
          media_type={media_type}
          media={filter(this.getMedia())}
        />
        <WorkspaceBar
          {...this.props}
          handleDrawerToggle={this.handleDrawerToggle}
          open={navbarOpen}
          history={history}
        />
        <WorkspaceContent
          open={navbarOpen}
          media={
            this.getMedia().filter((item) => item.id == match.params.mediaId)[0]
          }
          mediaType={media_type}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    videos: state.videoReducer.videos,
    audios: state.audioReducer.audios,
  };
}

const mapDispatchToProps = {
  loadVideosInCollection,
  loadAudiosInCollection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(useStyles)(Workspace));
