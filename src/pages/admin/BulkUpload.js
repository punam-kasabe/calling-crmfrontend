import Sidebar from "../../components/Sidebar";
export default function BulkUpload() {
  return (
    <div className="d-flex">

      <Sidebar />

      <div style={{ marginLeft: "240px", padding: "20px", width: "100%" }}>
        <h3>Bulk Upload</h3>

        <input type="file" className="form-control mb-2" />
        <button className="btn btn-primary">Upload</button>
      </div>

    </div>
  );
}