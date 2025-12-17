import React from "react";

function QuestionNode({ question,number, onUpdate, onAddChild, onDelete,readOnly }) {
  return (
    <div>
        <p>
            <b>Q{number}</b>
        </p>
      <input
        type="text"
        placeholder="Enter Question Text"
        value={question.text}
        onChange={(e) => onUpdate(question.id, { text: e.target.value })}
        disabled={readOnly}
      />
      <select
        value={question.type}
        onChange={(e) =>
          onUpdate(question.id, {
            type: e.target.value,
            answer: null,
            children: [],
          })
        }
        disabled={readOnly}
      >
        <option value="short"> Short Answer</option>
        <option value="boolean"> True/False</option>
      </select>
      {question.type === "boolean" && (
        <select
          value={question.answer ?? ""}
          onChange={(e) =>
            onUpdate(question.id, {
              answer: e.target.value === "true",
            })
          }
          disabled={readOnly}
        >
          <option value="">Select Answer</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      )}

      {!readOnly && question.type === "boolean" && question.answer === true && (
        <button onClick={() => onAddChild(question.id)}>
          Add Child Question
        </button>
      )}
      {!readOnly && (
        <button style={{ color: "red" }} onClick={() => onDelete(question.id)}>
          Delete
        </button>
      )}
      {question.children.map((child,index) => (
        <QuestionNode
          key={child.id}
          question={child}
          number={`${number}.${index+1}`}
          onUpdate={onUpdate}
          onAddChild={onAddChild}
          onDelete={onDelete}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}

export default QuestionNode;
