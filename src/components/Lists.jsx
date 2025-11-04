import AddButton from "./AddButton";

export default function Lists({ title, lists }) {
  if (lists.length > 0) {
    return <p>Great!</p>;
  } else {
    return <p>Empty</p>;
  }
}
