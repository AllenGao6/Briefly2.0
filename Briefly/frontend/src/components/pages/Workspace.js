import React, { Component } from "react";
// redux
import { connect } from "react-redux";
import { loadVideosInCollection } from "../../redux/actions/video_actions";
import { loadAudiosInCollection } from "../../redux/actions/audio_actions";

class Workspace extends Component {
  state = {};

  render() {
    return <h1>Workspace</h1>;
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

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
