import * as React from 'react';
import * as ReactDom from 'react-dom';

class App extends React.PureComponent<{ }, { }> {

  constructor( props ) {
     super( props );
  }
  render( ) {
    return (
      <h1>asds</h1>
    )
  }
}

ReactDom.render(
  <App />,
  document.querySelector('#app')
);