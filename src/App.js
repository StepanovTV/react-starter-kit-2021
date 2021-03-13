import './style/styles.global.css';
import React from 'react';

import Img from 'components/Img';

const App = () => {
  return (
    <div>
      <h1>H1 We are fully licensed and regulated by the Belize Online Club Group</h1>
      <p>
        We are fully licensed and regulated by the Belize Online Club Group, a trusted
        licensing body in a beautiful Caribbean country located in the Central America.
        The bookmaker Oppa888 accepts bets on sports and other events worldwide. Bets may
        only be placed by individuals who are 18 years of age or the age of majority in
        their state.
      </p>
      <h2>H2 We are fully licensed and regulated by the Belize Online Club Group</h2>
      <h3>H3 We are fully licensed and regulated by the Belize Online Club Group</h3>
      <p>
        We are fully licensed and regulated by the Belize Online Club Group, a trusted
        licensing body in a beautiful Caribbean country located in the Central America.
        The bookmaker Oppa888 accepts bets on sports and other events worldwide. Bets may
        only be placed by individuals who are 18 years of age or the age of majority in
        their state.
      </p>
      <p>Name unordered</p>
      <ul>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ul>
      <p>Name ordered</p>
      <ol>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ol>
      <p>
        <a href="#top">Link will looks like this just with underline</a>
      </p>
      <Img
        src="/static/images/react.png"
        height={848}
        width={1200}
        alt="React logo"
        avif="/static/images/react.avif"
        webp="/static/images/react.webp"
      />
    </div>
  );
};

export default App;
