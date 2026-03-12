"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const [name, setName] = useState("");
  const [type, setType] = useState("tournament");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [cost, setCost] = useState("0");
  const [costUnit, setCostUnit] = useState("per person");
  const [registrationLink, setRegistrationLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("session:", session);
    let image_url = null;

    if (image) {
      const { data, error: uploadError } = await supabase.storage
        .from("event_images")
        .upload(`${Date.now()}-${image.name}`, image);

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("event_images")
        .getPublicUrl(data.path);

      image_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("events").insert({
      name,
      type,
      date,
      time,
      address,
      description,
      rules,
      cost: parseFloat(cost),
      cost_unit: costUnit,
      registration_link: registrationLink,
      image_url,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
    }
  }

  return (
    <main>
      <h1>Add New Event</h1>
      <input
        placeholder='Event Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value='tournament'>Tournament</option>
        <option value='open play'>Open Play</option>
        <option value='clinic'>Clinic</option>
      </select>
      <input
        type='date'
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type='time'
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <input
        placeholder='Address'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <textarea
        placeholder='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea
        placeholder='Rules (optional)'
        value={rules}
        onChange={(e) => setRules(e.target.value)}
      />
      <input
        placeholder='Cost'
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />
      <select value={costUnit} onChange={(e) => setCostUnit(e.target.value)}>
        <option value='per person'>Per Person</option>
        <option value='per team'>Per Team</option>
        <option value='free'>Free</option>
      </select>
      <input
        placeholder='Registration Link (optional)'
        value={registrationLink}
        onChange={(e) => setRegistrationLink(e.target.value)}
      />
      <input
        type='file'
        accept='image/*'
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleSubmit}>Create Event</button>
      {error && <p>{error}</p>}
    </main>
  );
}
