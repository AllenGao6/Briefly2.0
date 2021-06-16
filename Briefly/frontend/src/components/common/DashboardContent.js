import React from "react";
import CollectionGrid from "./CollectionGrid";

export default function DashboardContent({ open }) {
  return (
    <React.Fragment>
      <CollectionGrid open={open} />
    </React.Fragment>
  );
}
