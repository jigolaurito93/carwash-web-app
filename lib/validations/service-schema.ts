import { z } from "zod";

const pricesSchema = z.object({
  small_car_price: z.number().finite("Small car price must be a number"),
  medium_car_price: z.number().finite("Medium car price must be a number"),
  large_car_price: z.number().finite("Large car price must be a number"),
});

const serviceBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name is too long"),
  description: z
    .string()
    .trim()
    .max(2000, "Description is too long")
    .nullable(),
  notes: z.string().trim().max(5000, "Notes are too long").nullable(),
  category_id: z.number().int().positive("Category is required"),
  sort_order: z.number().int("Sort order must be a whole number"),
  is_active: z.boolean(),
});

export const serviceSchema = z.discriminatedUnion("card_layout", [
  serviceBaseSchema.extend({
    card_layout: z.literal("layout1"),
    layout1_data: pricesSchema.extend({
      includes: z.array(z.string().trim().min(1)),
    }),
    layout2_data: z.null(),
    layout3_data: z.null(),
    layout4_data: z.null(),
  }),
  serviceBaseSchema.extend({
    card_layout: z.literal("layout2"),
    layout1_data: z.null(),
    layout2_data: z.object({
      items: z.record(z.string().min(1), z.number().finite()),
    }),
    layout3_data: z.null(),
    layout4_data: z.null(),
  }),
  serviceBaseSchema.extend({
    card_layout: z.literal("layout3"),
    layout1_data: z.null(),
    layout2_data: z.null(),
    layout3_data: z.string().nullable(),
    layout4_data: z.null(),
  }),
  serviceBaseSchema.extend({
    card_layout: z.literal("layout4"),
    layout1_data: z.null(),
    layout2_data: z.null(),
    layout3_data: z.null(),
    layout4_data: pricesSchema.extend({
      info: z.string(),
    }),
  }),
]);

export type ServiceFormValues = z.infer<typeof serviceSchema>;
