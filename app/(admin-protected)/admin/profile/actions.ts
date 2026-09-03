"use server";

import { upsertAdminProfile } from "@/app/admin/onboarding/actions";

export async function updateAdminProfile(formData: FormData) {
  return upsertAdminProfile(formData);
}
