import useProjects from "../hooks/useProjects";

export default function ProjectDropdown({ value, onChange }) {
  const { projects } = useProjects();

  return (
    <select value={value} onChange={onChange}>
      <option value="">Select Project</option>

      {projects.map((p) => (
        <option key={p._id} value={p.name}>
          {p.name} ({p.city})
        </option>
      ))}
    </select>
  );
}