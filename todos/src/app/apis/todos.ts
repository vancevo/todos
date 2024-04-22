import { ITodo } from "../types";

export const getTxt = async () => {
  const res = await fetch(`http://localhost:8000/todos`, {
    method: "GET",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return data;
};

export const addNewTxt = async ({ id, text }: ITodo) => {
  const res = await fetch("http://localhost:8000/todos", {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, text }),
  });
  const data = await res.json();

  console.log({ data });
  return Response.json({ data });
};
