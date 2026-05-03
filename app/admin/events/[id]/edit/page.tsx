"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { revalidateSchedule } from "@/app/admin/actions";

const SKILL_LEVEL_OPTIONS = ["aa", "bb", "a", "b", "open"] as const;

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("tournament");
  const [gender, setGender] = useState("mens");
  const [surface, setSurface] = useState("indoor");
  const [teamSize, setTeamSize] = useState("6v6");
  const [skillLevels, setSkillLevels] = useState<string[]>([]);
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [address, setAddress] = useState("");
  const [cost, setCost] = useState("0");
  const [costType, setCostType] = useState("team");
  const [capacity, setCapacity] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const router = useRouter();

  function toggleSkillLevel(level: string) {
    setSkillLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  }

  useEffect(() => {
    async function fetchEvent() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setEventType(data.event_type);
        setGender(data.gender);
        setSurface(data.surface);
        setTeamSize(data.team_size);
        setSkillLevels(data.skill_levels ?? []);
        setEventDate(data.event_date);
        setStartTime(data.start_time);
        setEndTime(data.end_time ?? "");
        setAddress(data.address ?? "");
        setCost(data.cost.toString());
        setCostType(data.cost_type);
        setCapacity(data.capacity?.toString() ?? "");
        setRegistrationLink(data.registration_link ?? "");
        setCurrentImageUrl(data.image_url);
      }
      setFetching(false);
    }
    fetchEvent();
  }, [id]);

  async function handleSubmit() {
    setLoading(true);
    let image_url = currentImageUrl;

    if (image) {
      if (currentImageUrl) {
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

    const { error } = await supabase
      .from("events")
      .update({
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
        address: address || null,
        cost: parseFloat(cost),
        cost_type: costType,
        capacity: capacity ? parseInt(capacity) : null,
        registration_link: registrationLink || null,
        image_url,
      })
      .eq("id", id);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      await revalidateSchedule();
      router.push("/admin");
    }
  }

  if (fetching) return <p>Loading...</p>;

  return (
    <main>
      <h1>Edit Event</h1>
      <input
        placeholder='Event Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value='tournament'>Tournament</option>
        <option value='open_gym'>Open Gym</option>
      </select>
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value='mens'>Mens</option>
        <option value='womens'>Womens</option>
        <option value='coed'>Coed</option>
      </select>
      <select value={surface} onChange={(e) => setSurface(e.target.value)}>
        <option value='indoor'>Indoor</option>
        <option value='grass'>Grass</option>
        <option value='beach'>Beach</option>
      </select>
      <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)}>
        <option value='6v6'>6v6</option>
        <option value='4v4'>4v4</option>
        <option value='3v3'>3v3</option>
        <option value='2v2'>2v2</option>
      </select>
      <fieldset>
        <legend>Skill Levels</legend>
        {SKILL_LEVEL_OPTIONS.map((level) => (
          <label key={level}>
            <input
              type='checkbox'
              checked={skillLevels.includes(level)}
              onChange={() => toggleSkillLevel(level)}
            />
            {level.toUpperCase()}
          </label>
        ))}
      </fieldset>
      <input
        type='date'
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />
      <label>
        Start Time
        <input
          type='time'
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>
      <label>
        End Time (optional)
        <input
          type='time'
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </label>
      <input
        placeholder='Address (optional)'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        placeholder='Cost'
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />
      <select value={costType} onChange={(e) => setCostType(e.target.value)}>
        <option value='team'>Per Team</option>
        <option value='individual'>Per Individual</option>
      </select>
      <input
        type='number'
        placeholder='Capacity (leave blank for unlimited)'
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <input
        placeholder='Registration Link (optional)'
        value={registrationLink}
        onChange={(e) => setRegistrationLink(e.target.value)}
      />
      {(image ? URL.createObjectURL(image) : currentImageUrl) && (
        <Image
          src={image ? URL.createObjectURL(image) : currentImageUrl!}
          alt='Event image preview'
          width={200}
          height={200}
        />
      )}
      <input
        type='file'
        accept='image/*'
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
      {error && <p>{error}</p>}
    </main>
  );
}
