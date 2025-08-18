import { integer, json, jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits:integer()
});

export const SessionChatTable=pgTable('sessionChatTable',{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId:varchar().notNull(),
  notes:text(),
  selectedDoctor:json(),
  report:json(),
  createdBy:varchar().references(()=>usersTable.email),
  createdOn:varchar(),

})
