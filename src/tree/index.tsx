import {useState, useEffect, KeyboardEvent} from 'react';
import "./index.css";
import initData from './data.json';

type NodeObj = {
  children: string[];
  id: string;
  value: string;
}

const Tree = () => {
  const [nodes, setNodes] = useState<NodeObj[]>(initData.tree.nodes);
  const [inputVisible, setInputVisible] = useState({});

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, val: string) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      setNodes(prevNodes => {
        const child: NodeObj | undefined = prevNodes.find(node => node.children.find(child => child === val));
        const childIdx = prevNodes.findIndex(node => node.children.find(child => child === val));
        child!.children.push(event.target.value);
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

  const onRemove = (val: string) => {
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
    const inputObject: unknown = {};
    for (const node of nodes) {
      if (node.children.length > 0) {
        inputObject[node.children[node.children.length - 1]] = true;
      }
    }
    setInputVisible(inputObject);
  }, [nodes])
  // alert(inputValue);
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
              <input type="text" onKeyDown={(e) => handleKeyDown(e, node.value)}/>
            )}

            </div>
          </div>
        )
      })}
    </div>
  );
};

export default Tree;
