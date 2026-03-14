"use client";

import { useState, useEffect, use } from "react";
import { browserSupabase as supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchEvent() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setName(data.name);
        setType(data.type);
        setDate(data.date);
        setTime(data.time);
        setAddress(data.address);
        setDescription(data.description);
        setRules(data.rules ?? "");
        setCost(data.cost.toString());
        setCostUnit(data.cost_unit);
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
      // Delete old image if exists
      if (currentImageUrl) {
        const oldPath = currentImageUrl.split("/event_images/")[1];
        await supabase.storage.from("event_images").remove([oldPath]);
      }

      // Upload new image
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
      })
      .eq("id", id);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  if (fetching) return <p>Loading...</p>;

  return (
    <main>
      <h1>Edit Event</h1>
      <input
        placeholder='Event Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value='tournament'>Tournament</option>
        <option value='open gym'>Open Gym</option>
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
