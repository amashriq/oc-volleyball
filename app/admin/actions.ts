"use server";
import { revalidatePath } from "next/cache";

export async function revalidateSchedule() {
  revalidatePath("/schedule");
}
