import React, { useState } from "react";

const Problem1 = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const [todos, setTodos] = useState([]);
  const [show, setShow] = useState("all");

  const handleClick = (val) => {
    setShow(val);
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (name.length == 0 || status.length == 0) {
      window.alert("Name and status can not be empty.");
      return;
    }
    const todo = {
      name: name,
      status: status.toLowerCase(),
    };

    setTodos((prevTodos) => {
      const copyOfTodos = [...prevTodos];
      copyOfTodos.push(todo);
      return copyOfTodos;
    });
    // reset the controlled fields
    setName("");
    setStatus("");
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-1</h4>
        <div className="col-6 ">
          <form className="row gy-2 gx-3 align-items-center mb-4">
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={addTodo}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="col-8">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${show === "all" && "active"}`}
                type="button"
                onClick={() => handleClick("all")}
              >
                All
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "active" && "active"}`}
                type="button"
                onClick={() => handleClick("active")}
              >
                Active
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "completed" && "active"}`}
                type="button"
                onClick={() => handleClick("completed")}
              >
                Completed
              </button>
            </li>
          </ul>
          <div className="tab-content"></div>
          <table className="table table-striped ">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {
                show == "all" && todos.sort((a, b) => {
                  // sort active first
                  if(a.status == "active" ) {
                    return -1
                  }
                  if(b.status == "active") {
                    return 1
                  }

                  // sort completed second
                  if(a.status == "completed" ) {
                    return -1
                  }
                  if(b.status == "completed") {
                    return 1
                  }
                  
                  // sort others based on their name or status or whatever
                  a.name > b.name ? 1 : -1
                }).map((todo, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{todo.name}</td>
                      <td>{todo.status}</td>
                    </tr>
                  );
                })
              }

              {(show == "active" || show == "completed") &&
                todos
                  .filter((todo) => {
                    return (
                      todo.status == show
                    );
                  })
                  .map((todo, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{todo.name}</td>
                        <td>{todo.status}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problem1;
