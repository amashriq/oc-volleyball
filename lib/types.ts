export type Event = {
  id: number;
  name: string;
  type: string;
  date: string;
  time: string;
  address: string;
  description: string;
  rules: string | null;
  cost: number;
  cost_unit: string;
  registration_link: string | null;
  image_url: string | null;
  created_at: string;
};
