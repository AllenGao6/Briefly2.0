import React from "react";
import CollectionGrid from "./CollectionGrid";

export default function DashboardContent({ open, collectionDialog, collectionDelete }) {
  return (
    <React.Fragment>
      <CollectionGrid open={open} collectionDialog={collectionDialog} collectionDelete={collectionDelete}/>
    </React.Fragment>
  );
}
