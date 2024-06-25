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
  const [levels, setLevels] = useState({});

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>, val: string) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      let prevNodes = [...nodes];

      const child: NodeObj = prevNodes.find(node => node.children.find(child => child === val));
      const childIdx = prevNodes.findIndex(node => node.children.find(child => child === val));
      child!.children.push(event.target.value);
      prevNodes[childIdx] = child;

      const newNode = {
        "children": [], 
        "id": event.target.value, 
        "value": event.target.value
      };
      const parentIdx = prevNodes.findIndex(node => node.value === val);
      prevNodes = [...prevNodes.slice(0, parentIdx + 1), newNode, ...prevNodes.slice(parentIdx + 1)];
      setNodes(prevNodes);
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
    const levels = {};
    levels['zero'] = ['root'];
    const inputObject: unknown = {};
    for (const node of nodes) {
      if (node.children.length > 0) {
        inputObject[node.children[node.children.length - 1]] = true;
      }

      if (node.value === 'root') {
        levels['one'] = node.children;
      }
    }
    
    if (levels['one'].length > 0) {
      let array1 = [];
      for (const two of Array.from(levels['one'])) {
        const node = nodes.find(node => node.value === two);
        array1.push(...node.children);
      }
      levels['two'] = array1;
    }
    
    if (levels['two'].length > 0) {
      let array2 = [];
      for (const three of Array.from(levels['two'])) {
        const node = nodes.find(node => node.value === three);
        array2.push(...node.children);
      }
      levels['three'] = array2;
    }

    setLevels(levels);
    setInputVisible(inputObject);
  }, [nodes])

  return (
    <div className="tree">
      {nodes.map((node, index) => {
        let level;
        for (const [key, value] of Object.entries(levels)) {
          const idx = value.findIndex(itm => itm === node.value);
          if (idx !== -1) {
            level = key;
          }
        }

        return (
          <div className={level}>
            {node.value}
            {node.value !== 'root' && (
              <button onClick={() => onRemove(node.value)}>
                ❌
              </button> 
            )}
            <br />
            <div>
            {inputVisible[node.value] && (
              <input type="text" onKeyDown={(e) => handleEnter(e, node.value)}/>
            )}

            </div>
          </div>
        )
      })}
    </div>
  );
};

export default Tree;
