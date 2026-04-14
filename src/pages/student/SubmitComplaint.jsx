import { useMemo, useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import PriorityBadge from "../../components/PriorityBadge";
import { locationTypes } from "../../data/mockCategories";
import { useComplaints } from "../../context/ComplaintContext";

function SubmitComplaint() {
  const { addComplaint, detectCategory, calculatePriorityScore, scoreToPriority } = useComplaints();
  const [form, setForm] = useState({
    title: "",
    description: "",
    locationType: "Building",
    specificLocation: "",
    image: ""
  });
  const [suggestedCategory, setSuggestedCategory] = useState("Building");

  const score = useMemo(
    () => calculatePriorityScore({ category: suggestedCategory, description: form.description, locationType: form.locationType }),
    [calculatePriorityScore, form.description, form.locationType, suggestedCategory]
  );
  const priority = scoreToPriority(score);

  const onField = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    setSuggestedCategory(detectCategory(next.description, next.locationType));
  };

  const onFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onField("image", reader.result);
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    addComplaint({ ...form, createdBy: "Student" });
    setForm({ title: "", description: "", locationType: "Building", specificLocation: "", image: "" });
    setSuggestedCategory("Building");
  };

  return (
    <Card className="max-w-3xl">
      <h2 className="page-title">Submit Complaint</h2>
      <p className="page-subtitle mt-1">Describe the issue and let Campus Resolve auto-analyze urgency.</p>
      <form className="mt-5 space-y-4" onSubmit={submit}>
        <Input label="Complaint Title" value={form.title} onChange={(e) => onField("title", e.target.value)} required />
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</span>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800"
            value={form.description}
            onChange={(e) => onField("description", e.target.value)}
            required
          />
        </label>
        <Select label="Location Type" value={form.locationType} onChange={(e) => onField("locationType", e.target.value)} options={locationTypes} />
        <Input label="Specific Location" value={form.specificLocation} onChange={(e) => onField("specificLocation", e.target.value)} required />

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload Photo</span>
          <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="block w-full text-sm" />
        </label>

        {form.image && (
          <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <img src={form.image} alt="preview" className="max-h-48 rounded-lg object-cover" />
            <Button type="button" variant="danger" className="mt-2" onClick={() => onField("image", "")}>Remove Image</Button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          <p className="text-sm">AI Category: <span className="font-semibold">{suggestedCategory}</span></p>
          <p className="text-sm">Score: <span className="font-semibold">{score}</span></p>
          <PriorityBadge priority={priority} />
        </div>

        <Button type="submit">Submit Complaint</Button>
      </form>
    </Card>
  );
}

export default SubmitComplaint;
