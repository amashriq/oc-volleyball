export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 1000;
export const MAX_LOCATION_LENGTH = 100;
export const MAX_ADDRESS_LENGTH = 200;

export interface EventFields {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  location: string;
  address?: string;
  cost: string;
}

export function validateEvent(fields: EventFields): string {
  if (!fields.title.trim()) return "Title is required.";
  if (!fields.description.trim()) return "Description is required.";
  if (!fields.eventDate) return "Event date is required.";
  if (!fields.startTime) return "Start time is required.";
  if (!fields.location.trim()) return "Location is required.";
  if (!fields.cost.trim()) return "Cost is required.";
  if (isNaN(Number(fields.cost.trim()))) return "Cost must be a valid number.";
  if (Number(fields.cost.trim()) < 0) return "Cost must be 0 or greater.";
  if (fields.title.length > MAX_TITLE_LENGTH)
    return `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
  if (fields.description.length > MAX_DESCRIPTION_LENGTH)
    return `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`;
  if (fields.location.length > MAX_LOCATION_LENGTH)
    return `Location must be ${MAX_LOCATION_LENGTH} characters or fewer.`;
  if (fields.address && fields.address.length > MAX_ADDRESS_LENGTH)
    return `Address must be ${MAX_ADDRESS_LENGTH} characters or fewer.`;
  return "";
}
