CREATE TABLE "seat" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "seat_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"theater_id" integer NOT NULL,
	"screen_type" text DEFAULT 'Digital' NOT NULL,
	"row" text NOT NULL,
	"seat_number" integer NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "theater" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "theater_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"theater_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "seat" ADD CONSTRAINT "seat_theater_id_theater_id_fk" FOREIGN KEY ("theater_id") REFERENCES "public"."theater"("id") ON DELETE cascade ON UPDATE no action;