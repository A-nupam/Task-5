import React, { useState } from "react";
import QuestionNode from "./QuestionNode.jsx";


function FormBuilder() {
  const [questions, setQuestions] = useState([]);
  const [isSubmitted,setIsSubmitted] =useState(false);
  const addParentQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: "New Question",
        type: "short",
        answer: null,
        children: [],
      },
    ]);
  };

  const updateQuestion = (id, updatedData) => {
    const updateRecursive = (nodes) => {
      return nodes.map((node) => {
        if (node.id === id) {
          return { ...node, ...updatedData };
        }
        return {
          ...node,
          children: updateRecursive(node.children),
        };
      });
    };
    setQuestions((prev) => updateRecursive(prev));
  };

  const addChildQuestion = (parentId) => {
    const addChildRecursive = (nodes) => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...node.children,
              {
                id: Date.now().toString(),
                text: "",
                type: "short",
                answer: null,
                children: [],
              },
            ],
          };
        }
        return {
          ...node,
          children: addChildRecursive(node.children),
        };
      });
    };
    setQuestions((prev) => addChildRecursive(prev));
  };

  const deleteQuestion = (idToDelete)=>{
    const deleteRecursive = (nodes) =>{
        return nodes
        .filter((node)=>node.id !==idToDelete)
        .map((node)=>({
            ...node,
            children: deleteRecursive(node.children)
        }));
    };
    setQuestions((prev)=>deleteRecursive(prev));
  };

  return (
    <div>
      <h2>form builder</h2>
      {!isSubmitted &&(
        <>
        <button onClick={addParentQuestion}>Add New Question</button>
        <button onClick={()=>setIsSubmitted(true)}>Submit</button>
        </>

      )}

      {questions.map((q,index) => (
        <QuestionNode
          key={q.id}
          question={q}
          number={`${index+1}`}
          onUpdate={updateQuestion}
          onAddChild={addChildQuestion}
          onDelete={deleteQuestion}
          readOnly={isSubmitted}
        />
      ))}
    </div>
  );
}

export default FormBuilder;
