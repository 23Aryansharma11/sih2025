CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"fullname" text,
	"avatar" text,
	"email" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
