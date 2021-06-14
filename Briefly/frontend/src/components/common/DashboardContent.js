import React from 'react';
import NestedGrid from './CollectionGrid';

export default function DashboardContent({open}) {
    return (
        <React.Fragment>
            <NestedGrid open={open}/>
        </React.Fragment>
    )
}
