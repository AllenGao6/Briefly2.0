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
import { Rnd } from 'react-rnd';

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
    x: 0,
    y: 0,
    width: 320,
    height: 200,
  };

  componentDidMount = () => {
    this.props.loadVideosInCollection(this.props.match.params.id);
    this.props.loadAudiosInCollection(this.props.match.params.id);
  };

  handleDrawerToggle = () => {
    this.setState({ navbarOpen: !this.state.navbarOpen });
  };


  render() {
    const { classes, history } = this.props;
    const { navbarOpen } = this.state;

    return (
      <React.Fragment>

        <MediaScrollbar
          open={navbarOpen}
          onClose={this.handleDrawerToggle}
          history={history}
          isWorkspace={true}
        />
        <WorkspaceBar
          {...this.props}
          handleDrawerToggle={this.handleDrawerToggle}
          open={navbarOpen}
          history={history}
        />
        <div>{/* <Rnd
          minHeight={100}
          disableDragging={true}
          enableResizing={{ top:false, right:true, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
          size={{ width: this.state.width, height: this.state.height }}
          position={{ x: this.state.x, y: this.state.y }}
          onResizeStop={(e, direction, ref, delta, position) => {
            this.setState({
              width: ref.style.width,
              height: ref.style.height,
              ...position,
            });
          }}
        >
          <WorkspaceContent open={navbarOpen} />
        </Rnd> */}</div>
        <WorkspaceContent open={navbarOpen} />
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
