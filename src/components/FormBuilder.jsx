import React, { useState } from "react";
import QuestionNode from "./QuestionNode.jsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const fromIndex = result.source.index;
    const toIndex = result.destination.index;
    if (fromIndex === toIndex) return;

    setQuestions((prev) => {
      const next = Array.from(prev);
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Nested Form</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {!isSubmitted && (
          <>
            <button onClick={addParentQuestion} style={{ marginRight: '10px' }}>Add New Question</button>
            <button onClick={()=>setIsSubmitted(true)}>Submit</button>
          </>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="parent-questions">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {questions.map((q, index) => (
                <Draggable
                  key={q.id}
                  draggableId={q.id}
                  index={index}
                  isDragDisabled={isSubmitted}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                    >
                      <QuestionNode
                        question={q}
                        number={`${index + 1}`}
                        onUpdate={updateQuestion}
                        onAddChild={addChildQuestion}
                        onDelete={deleteQuestion}
                        readOnly={isSubmitted}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default FormBuilder;
