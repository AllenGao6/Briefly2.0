import React from "react";
import GoogleLoginButton from "../social_login/GoogleLoginButton";
import { Typography, Grid, Dialog, DialogContent } from "@material-ui/core";

export default function LoginDialog({ open, onClose, onSuccess, onFailure }) {
  return (
    <Dialog style={{ zIndex: 1302 }} open={open} onClose={onClose}>
      <DialogContent style={{ padding: 20 }}>
        <Grid container direction="column">
          <Grid item style={{ marginBottom: "2.5rem" }}>
            <Typography variant="h3">Select Signin Options</Typography>
          </Grid>
          <Grid item container justify="center">
            <Grid item>
              <GoogleLoginButton onSuccess={onSuccess} onFailure={onFailure} />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
