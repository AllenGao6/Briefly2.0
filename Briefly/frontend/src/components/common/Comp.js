import React, { Fragment, useState } from "react";

/**
 * This counter has a button to increment the counter.
 * @returns {JSX.Element}
 */
export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Fragment>
      <h1>Counter</h1>
      <p>This is a counter.</p>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </Fragment>
  );
}
