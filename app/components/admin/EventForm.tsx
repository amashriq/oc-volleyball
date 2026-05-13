"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { revalidateSchedule } from "@/app/admin/actions";
import { validateEvent, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_LOCATION_LENGTH, MAX_ADDRESS_LENGTH } from "@/lib/validateEvent";

const SKILL_LEVEL_OPTIONS = ["aa", "bb", "a", "b", "open"] as const;

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#001D3D] focus:border-transparent transition-shadow duration-200";

const selectClass =
  "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#001D3D] focus:border-transparent transition-shadow duration-200 cursor-pointer";

const labelClass = "text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400";

export interface EventInitialValues {
  title: string;
  description: string;
  event_type: string;
  gender: string;
  surface: string;
  team_size: string;
  skill_levels: string[] | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  address: string | null;
  cost: number;
  cost_type: string;
  capacity: number | null;
  registration_link: string | null;
  image_url: string | null;
  is_active: boolean | null;
}

interface EventFormProps {
  mode: "create" | "edit";
  initialValues?: EventInitialValues;
  eventId?: string;
}

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function EventForm({ mode, initialValues, eventId }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [eventType, setEventType] = useState(initialValues?.event_type ?? "tournament");
  const [gender, setGender] = useState(initialValues?.gender ?? "mens");
  const [surface, setSurface] = useState(initialValues?.surface ?? "indoor");
  const [teamSize, setTeamSize] = useState(initialValues?.team_size ?? "6v6");
  const [skillLevels, setSkillLevels] = useState<string[]>(initialValues?.skill_levels ?? []);
  const [eventDate, setEventDate] = useState(initialValues?.event_date ?? todayDate());
  const [startTime, setStartTime] = useState(initialValues?.start_time ?? "09:00");
  const [endTime, setEndTime] = useState(initialValues?.end_time ?? "");
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [address, setAddress] = useState(initialValues?.address ?? "");
  const [cost, setCost] = useState(initialValues?.cost?.toString() ?? "0");
  const [costType, setCostType] = useState(initialValues?.cost_type ?? "team");
  const [capacity, setCapacity] = useState(initialValues?.capacity?.toString() ?? "");
  const [registrationLink, setRegistrationLink] = useState(initialValues?.registration_link ?? "");
  const [isActive, setIsActive] = useState(initialValues?.is_active ?? true);
  const [image, setImage] = useState<File | null>(null);

  // Stable reference to the existing image URL — only used in edit mode for deletion
  const currentImageUrl = initialValues?.image_url ?? null;

  const router = useRouter();

  function toggleSkillLevel(level: string) {
    setSkillLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  }

  async function handleSubmit() {
    const validationError = validateEvent({ title, description, eventDate, startTime, location, address, cost });
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    let image_url: string | null = currentImageUrl;

    if (image) {
      if (mode === "edit" && currentImageUrl) {
        const oldPath = currentImageUrl.split("/event_images/")[1];
        await supabase.storage.from("event_images").remove([oldPath]);
      }

      const { data, error: uploadError } = await supabase.storage
        .from("event_images")
        .upload(`${Date.now()}-${image.name}`, image);

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("event_images")
        .getPublicUrl(data.path);

      image_url = urlData.publicUrl;
    }

    const payload = {
      title,
      description,
      event_type: eventType,
      gender,
      surface,
      team_size: teamSize,
      skill_levels: skillLevels.length ? skillLevels : null,
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime || null,
      location,
      address: address || null,
      cost: parseFloat(cost),
      cost_type: costType,
      capacity: capacity ? parseInt(capacity) : null,
      registration_link: registrationLink || null,
      image_url,
      is_active: isActive,
    };

    const { error: dbError } =
      mode === "create"
        ? await supabase.from("events").insert(payload)
        : await supabase.from("events").update(payload).eq("id", eventId!);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
    } else {
      await revalidateSchedule();
      router.push("/admin");
    }
  }

  const previewSrc = image ? URL.createObjectURL(image) : currentImageUrl;

  const costError =
    cost.trim() !== "" && isNaN(Number(cost.trim()))
      ? "Cost must be a valid number."
      : cost.trim() !== "" && Number(cost.trim()) < 0
      ? "Cost must be 0 or greater."
      : "";

  return (
    <main className="min-h-screen bg-slate-50 px-4 md:px-8 py-10 md:py-14">

      {/* Page Header */}
      <div className="max-w-2xl mx-auto mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="w-12 h-1 bg-red-700 mb-3" />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#001D3D] leading-tight">
            {mode === "create" ? "Add New Event" : "Edit Event"}
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-medium">
            All fields marked <span className="text-red-500">*</span> must be filled before saving.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={() => router.push("/admin")}
          className="text-2xl font-bold text-gray-400 hover:text-gray-800 leading-none mt-1 transition-colors duration-150"
        >
          ✕
        </button>
      </div>

      {/* Card Stack */}
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Section 1 — Basic Info */}
        <div className="bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]">Basic Info</h2>
          </div>
          <div className="px-6 py-6 flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={MAX_TITLE_LENGTH}
                className={inputClass}
              />
              <span className={`text-xs text-right font-medium ${title.length >= MAX_TITLE_LENGTH ? "text-red-500" : "text-gray-400"}`}>
                {title.length} / {MAX_TITLE_LENGTH}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe the event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                maxLength={MAX_DESCRIPTION_LENGTH}
                className={`${inputClass} resize-y`}
              />
              <span className={`text-xs text-right font-medium ${description.length >= MAX_DESCRIPTION_LENGTH ? "text-red-500" : "text-gray-400"}`}>
                {description.length} / {MAX_DESCRIPTION_LENGTH}
              </span>
            </div>

          </div>
        </div>

        {/* Section 2 — Classification */}
        <div className="bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]">Classification</h2>
          </div>
          <div className="px-6 py-6 flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Event Type</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)} className={selectClass}>
                <option value="tournament">Tournament</option>
                <option value="open_gym">Open Gym</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}>
                <option value="mens">Mens</option>
                <option value="womens">Womens</option>
                <option value="coed">Coed</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Surface</label>
              <select value={surface} onChange={(e) => setSurface(e.target.value)} className={selectClass}>
                <option value="indoor">Indoor</option>
                <option value="grass">Grass</option>
                <option value="beach">Beach</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Team Size</label>
              <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className={selectClass}>
                <option value="6v6">6v6</option>
                <option value="4v4">4v4</option>
                <option value="3v3">3v3</option>
                <option value="2v2">2v2</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>
                Skill Levels{" "}
                <span className="ml-1 text-gray-300 normal-case tracking-normal font-normal">(select all that apply)</span>
              </span>
              <div className="flex flex-wrap gap-3 pt-1">
                {SKILL_LEVEL_OPTIONS.map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      checked={skillLevels.includes(level)}
                      onChange={() => toggleSkillLevel(level)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#001D3D] cursor-pointer"
                    />
                    <span className="text-sm font-bold uppercase tracking-tight text-gray-600 group-hover:text-black transition-colors duration-150">
                      {level.toUpperCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Section 3 — Schedule */}
        <div className="bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]">Schedule</h2>
          </div>
          <div className="px-6 py-6 flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  End Time{" "}
                  <span className="ml-1 text-gray-300 normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Section 4 — Location */}
        <div className="bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]">Location</h2>
          </div>
          <div className="px-6 py-6 flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Venue / Location <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g. OC Sports Center"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                maxLength={MAX_LOCATION_LENGTH}
                className={inputClass}
              />
              <span className={`text-xs text-right font-medium ${location.length >= MAX_LOCATION_LENGTH ? "text-red-500" : "text-gray-400"}`}>
                {location.length} / {MAX_LOCATION_LENGTH}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Address{" "}
                <span className="ml-1 text-gray-300 normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <input
                placeholder="123 Main St, City, State"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                maxLength={MAX_ADDRESS_LENGTH}
                className={inputClass}
              />
              <span className={`text-xs text-right font-medium ${address.length >= MAX_ADDRESS_LENGTH ? "text-red-500" : "text-gray-400"}`}>
                {address.length} / {MAX_ADDRESS_LENGTH}
              </span>
            </div>

          </div>
        </div>

        {/* Section 5 — Pricing & Capacity */}
        <div className="bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]">Pricing &amp; Capacity</h2>
          </div>
          <div className="px-6 py-6 flex flex-col gap-5">

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Cost ($)</label>
                <input
                  placeholder="0"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className={inputClass}
                />
                {costError && <p className="text-xs text-red-600 mt-0.5">{costError}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Cost Type</label>
                <select value={costType} onChange={(e) => setCostType(e.target.value)} className={selectClass}>
                  <option value="team">Per Team</option>
                  <option value="individual">Per Individual</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Capacity{" "}
                <span className="ml-1 text-gray-300 normal-case tracking-normal font-normal">(optional — leave blank for unlimited)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 16"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className={inputClass}
              />
            </div>

          </div>
        </div>

        {/* Section 6 — Registration & Media */}
        <div className="bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]">Registration &amp; Media</h2>
          </div>
          <div className="px-6 py-6 flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Registration Link{" "}
                <span className="ml-1 text-gray-300 normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <input
                placeholder="https://..."
                value={registrationLink}
                onChange={(e) => setRegistrationLink(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>Event Image</span>

              {previewSrc && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <Image
                    src={previewSrc}
                    alt="Event image preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-lg px-4 py-8 cursor-pointer hover:border-[#001D3D] hover:bg-slate-50 transition-colors duration-200 group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-gray-300 group-hover:text-[#001D3D] mb-2 transition-colors"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm font-bold text-gray-400 group-hover:text-[#001D3D] transition-colors">
                  {image ? image.name : previewSrc ? "Click to replace image" : "Click to upload an image"}
                </span>
                <span className="text-xs text-gray-300 mt-1">PNG, JPG, GIF</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

          </div>
        </div>

        {/* Section 7 — Visibility */}
        <div className="bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]">Visibility</h2>
          </div>
          <div className="px-6 py-6">
            <label className="flex items-start gap-4 cursor-pointer">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#001D3D] rounded-full transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-[#001D3D] peer-focus:ring-offset-2" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Show on website</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  When turned on, this event appears on the public schedule page for anyone to see. Turn it off to hide the event without deleting it — handy for drafts or events that are full and no longer need to be listed.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-600 mt-0.5 shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-bold text-red-700">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col gap-3 pb-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-800 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-lg text-sm transition-colors duration-200 cursor-pointer"
          >
            {loading
              ? mode === "create" ? "Creating Event..." : "Saving..."
              : mode === "create" ? "Create Event" : "Save Changes"}
          </button>
          <p className="text-center text-xs text-gray-400 font-medium">
            You&apos;ll be redirected to the admin dashboard after saving.
          </p>
        </div>

      </div>
    </main>
  );
}
