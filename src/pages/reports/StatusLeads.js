import { useParams } from "react-router-dom";

export default function StatusLeads() {

  const { status } = useParams();

  return (
    <div
      style={{
        padding: "30px"
      }}
    >
      <h1>
        {status} Leads
      </h1>
    </div>
  );
}