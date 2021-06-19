import React from "react";
import CollectionGrid from "./CollectionGrid";

export default function DashboardContent({ open, collectionDialog }) {
  return (
    <React.Fragment>
      <CollectionGrid open={open} collectionDialog={collectionDialog} />
    </React.Fragment>
  );
}
