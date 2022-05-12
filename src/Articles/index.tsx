import React, { useState } from 'react';

interface Props {
  title: string;
}
const Articles = (props: Props) => {
  const [lists, setLists] = useState([]);
  return (
    <div className="component-wechat">
      <h2>{props.title}</h2>
    </div>
  );
};

export default Articles;
