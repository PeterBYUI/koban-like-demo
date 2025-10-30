import CardGrid from "../components/CardGrid";
import Card from "../components/Card";
const cards = [
  {
    title: "Ideas",
    tasks: ["Find new printer to replace old one"],
  },
  {
    title: "To-Do",
    tasks: [
      "Compare CRM software for next year",
      "Send invoices and track payments",
      "Clean up my CRM or contact list",
      "Organize files and digital workspace",
    ],
  },
];

export default function Boards() {
  return (
    <CardGrid>
      {cards.map((card) => (
        <Card key={card.title} card={card} />
      ))}
    </CardGrid>
  );
}
