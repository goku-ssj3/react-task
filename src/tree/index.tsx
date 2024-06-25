import "./index.css";
import data from './data.json';

const Tree = () => {
  return (
    <div className="tree">
      <div>
        {data[0].NodeName}
      </div>
      <div className="ant-bear">
        {data[0].Children[0].NodeName} <br />
        {data[0].Children[1].NodeName}
      </div>
      <div className="cat-dog">
        {data[0].Children[1].Children[0].NodeName} <br />
        {data[0].Children[1].Children[1].NodeName}
      </div>
      <div className="elephant">
        {data[0].Children[1].Children[1].Children[0].NodeName}{" "}
      </div>
      <div className="frog">
        {data[0].Children[2].NodeName}
      </div>
      <div className="dolphin">
        {data[0].Children[2].Children[0].NodeName}
      </div>
    </div>
  );
};

export default Tree;
