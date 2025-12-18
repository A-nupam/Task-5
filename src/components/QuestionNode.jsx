import React from "react";

function QuestionNode({ question,number, onUpdate, onAddChild, onDelete,readOnly, dragHandleProps }) {
  return (
    <div style={{ 
      marginLeft: '3%', 
      paddingLeft: '2%', 
      borderLeft: '5px solid brown',
      marginTop: '1%',
      marginBottom: '1%',
      backgroundColor: "white",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1%', marginTop: '0.5%', marginBottom: '1%', flexWrap: 'wrap' }}>
        {!readOnly && dragHandleProps && (
          <span
            {...dragHandleProps}
            style={{
              cursor: 'grab',
              userSelect: 'none',
              fontWeight: 700,
              padding: '0 0.5em',
            }}
            title="Drag"
            aria-label="Drag"
          >
            ⋮⋮
          </span>
        )}
        <b style={{ flex: '0 0 auto' }}>Q{number}</b>
        <input
          type="text"
          placeholder="Enter Question Text"
          value={question.text}
          onChange={(e) => onUpdate(question.id, { text: e.target.value })}
          disabled={readOnly}
          style={{ flex: '3 1 auto' }}
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
          style={{ flex: '0 1 auto' }}
        >
          <option value="short"> Short Answer</option>
          <option value="boolean"> True/False</option>
        </select>
        {!readOnly && (
          <button style={{ color: "red", flex: '0 1 auto' }} onClick={() => onDelete(question.id)}>
            Delete
          </button>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1%', marginBottom: '1%', flexWrap: 'wrap' }}>
        {question.type === "boolean" && (
          <select
            value={question.answer ?? ""}
            onChange={(e) =>
              onUpdate(question.id, {
                answer: e.target.value === "true",
              })
            }
            disabled={readOnly}
            style={{ marginRight: '10px' }}
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
      </div>
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
