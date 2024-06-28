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
  const [inputLevel, setInputLevel] = useState();

  //Function for adding new element to current level node
  const handleEnter = (event: KeyboardEvent<HTMLInputElement>, val: string) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      let prevNodes = [...nodes];

      //Add new element to its parent's children array
      const child: NodeObj = prevNodes.find(node => node.children.find(child => child === val));
      const childIdx = prevNodes.findIndex(node => node.children.find(child => child === val));
      child!.children.push(event.target.value);
      prevNodes[childIdx] = child;

      //Add new element as a new node in the tree
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

  //Function for adding new element to previous level node
  const handleEnterParent = (event: KeyboardEvent<HTMLInputElement>, val: string) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      let prevNodes = [...nodes];

      //Add new element to its parent's children array
      const child: NodeObj = prevNodes.find(node => node.children.find(child => child === val));
      const childIdx = prevNodes.findIndex(node => node.children.find(child => child === val));
      child!.children.push(event.target.value);
      prevNodes[childIdx] = child;

      //Add new element as a new node in the tree
      const newNode = {
        "children": [], 
        "id": event.target.value, 
        "value": event.target.value
      };
      const parentNode = prevNodes.find(node => node.value === val);
      const element = parentNode?.children.find(child => child);
      const elementIdx = prevNodes.findIndex(node => node.value === element);
      prevNodes = [...prevNodes.slice(0, elementIdx + 1), newNode, ...prevNodes.slice(elementIdx + 1)];
      setNodes(prevNodes);
    }
  }

  const onRemove = (val: string) => {
      const prevNodes = [...nodes];
      const selectedElementIdxInParent = prevNodes.findIndex(node => node.children.find(child => child === val));

      //Remove selected element from parent's children array
      if (selectedElementIdxInParent !== - 1) {
        const selectedElementInParent = prevNodes.find(node => node.children.find(child => child === val));
        const selectedElementIdxInChildren = selectedElementInParent.children.indexOf(val);
        selectedElementInParent.children.splice(selectedElementIdxInChildren, 1);
        prevNodes[selectedElementIdxInParent] = selectedElementInParent;
      }
      
      //Remove children of selected element and their children(if any) from nodes array
      const selectedNode = prevNodes.find(node => node.value === val);
      for (const child1 of selectedNode.children) {
        let childIdx1 = prevNodes.findIndex(node => node.value === child1);
          if (childIdx1 !== -1) {
            if (prevNodes[childIdx1].children.length === 0) {
              prevNodes.splice(childIdx1, 1);
            } else {
              for (const child2 of prevNodes[childIdx1].children) {
                const childIdx2 = prevNodes.findIndex(node => node.value === child2);
                prevNodes.splice(childIdx2, 1);
              }
              childIdx1 = prevNodes.findIndex(node => node.value === child1);
              prevNodes.splice(childIdx1, 1);
            }
          }
      }

      //Remove selected element from nodes array
      const updatedNodes = prevNodes.filter(node => node.value !== val);
      setNodes(updatedNodes);
    };

  useEffect(() => {
    //Set style/indentation properties, input fields visibility
    const levels = {};
    levels['zero'] = ['root'];
    const inputObject: unknown = {};
    const inputLevel = {};
    let lastRootChild;

    for (const node of nodes) {
      if (node.value === 'root') {
        levels['one'] = node.children;

        lastRootChild = node.children.slice(node.children.length - 1);
        const lastRootChildNode = nodes.find(item => item.value === lastRootChild[0]);
        let display;
        if (lastRootChildNode.children.length === 0) {
          display = true;
        } else {
          display = false;
        }
        inputLevel[lastRootChild[0]] = 1;
        inputObject[lastRootChild[0]] = display;
      }
    }
    
    let lastElement;
    if (levels['one'].length > 0) {
      let array1 = [];
      for (const two of Array.from(levels['one'])) {
        const node = nodes.find(node => node.value === two);
        if (node?.children.length > 0) {
          lastElement = node.children.slice(node.children.length - 1);
          const lastElementNode = nodes.find(item => item.value === lastElement[0]);
          let display;
          if (lastElementNode.children.length === 0) {
            display = true;
          } else {
            display = false;
          }
          inputObject[lastElement[0]] = display;

          if (two !== lastRootChild[0]) {
            inputLevel[lastElement[0]] = 1;
          } else if (two === lastRootChild[0]) {
            inputLevel[lastElement[0]] = 2;
          }
        }
        array1.push(...node.children);
      }
      levels['two'] = array1;
    }
    
    if (levels['one'].length > 0) {
      let array2 = [];
      for (const three of Array.from(levels['one'])) {
        const node = nodes.find(node => node.value === three);
        if (node?.children.length > 0) {
          const lastItem = node?.children.slice(node.children.length - 1);
          for (const element of node.children) {
            const elementNode = nodes.find(node => node.value === element);
            if (elementNode.children.length > 0) {
              lastElement = elementNode.children.slice(elementNode.children.length - 1);
              if (lastItem[0] === element) {
                inputLevel[lastElement[0]] = 3;
              } else {
                inputLevel[lastElement[0]] = 1;
              }
              inputObject[lastElement[0]] = true;
              array2.push(...elementNode.children);
              levels['three'] = array2;
            }
          }
        }
      }
    }

    setLevels(levels);
    setInputVisible(inputObject);
    setInputLevel(inputLevel);
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

        const parentNode = nodes.find(element => element.children.find(child => child === node.value));

        return (
          <div className={level}>
            {node.value}
            {node.value !== 'root' && (
              <button onClick={() => onRemove(node.value)}>
                ❌
              </button> 
            )}
            <br />
            {inputVisible[node.value] && inputLevel[node.value] === 1 && (
              <div >
                <div>
                <input type="text" onKeyDown={(e) => handleEnter(e, node.value)}/>
                </div>
              </div>
              )}
            {inputVisible[node.value] && (inputLevel[node.value] === 2 || inputLevel[node.value] === 3) && (
              <div>
                <div style={{marginBottom: '5px'}}>
                <input type="text" onKeyDown={(e) => handleEnter(e, node.value)}/>
                </div>
                <div className="minus">
                <input type="text" onKeyDown={(e) => handleEnterParent(e, parentNode.value)}/>
                </div>               
              </div>
              )}
          </div>
        )
      })}
    </div>
  );
};

export default Tree;
