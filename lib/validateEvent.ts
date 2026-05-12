export interface EventFields {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  location: string;
}

export function validateEvent(fields: EventFields): string {
  if (!fields.title.trim()) return "Title is required.";
  if (!fields.description.trim()) return "Description is required.";
  if (!fields.eventDate) return "Event date is required.";
  if (!fields.startTime) return "Start time is required.";
  if (!fields.location.trim()) return "Location is required.";
  return "";
}
