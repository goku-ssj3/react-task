import {useState, useEffect} from 'react';
import "./index.css";
import initData from './data.json';

const Tree = () => {
  const [nodes, setNodes] = useState(initData.tree.nodes);
  const [inputVisible, setInputVisible] = useState({});
  const [inputValue, setInputValue] = useState();

  const onAdd = (nodeVal, inputVal) => {
    setInputValue(nodeVal[inputVal] = true);
  }

  const handleKeyDown = (event, val) => {
    if (event.keyCode === 13) {
      setNodes(prevNodes => {
        const child = prevNodes.find(node => node.children.find(child => child === val));
        const childIdx = prevNodes.findIndex(node => node.children.find(child => child === val));
        child.children.push(event.target.value);
        prevNodes[childIdx] = child;
        const newNode = {
          "children": [], 
          "id": event.target.value, 
          "value": event.target.value
        };
        return [...prevNodes, newNode];
      });
    }
  }

  const onRemove = (val) => {
      const prevNodes = [...nodes];
      const child = prevNodes.find(node => node.children.find(child => child === val));
      const childIdx = prevNodes.findIndex(node => node.children.find(child => child === val));
      const childrenIdx = child.children.indexOf(val);
      if (childrenIdx !== -1) {
        child.children.splice(childrenIdx, 1);
        prevNodes[childIdx] = child;
      }
      const updatedNodes = prevNodes.filter(node => node.value !== val);
      setNodes(updatedNodes);
    };

  useEffect(() => {
    let inputObject = {};
    for (const node of nodes) {
      if (node.children.length > 0) {
        inputObject[node.children[node.children.length - 1]] = true;
      }
    }
    setInputVisible(inputObject);
  }, [nodes])

  return (
    <div className="tree">
      {nodes.map((node, index) => {
        return (
          <div className={node.value}>
            {node.value}
            {node.value !== 'root' && (
              <button onClick={() => onRemove(node.value)}>
                ❌
              </button> 
            )}
            <br />
            <div>
            {inputVisible[node.value] && (
              <input type="text" value={inputValue} onChange={(e) => onAdd(node.value, e.target.value)} onKeyDown={(e) => handleKeyDown(e, node.value)}/>
            )}

            </div>
          </div>
        )
      })}
    </div>
  );
};

export default Tree;
