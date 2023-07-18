CREATE TABLE "users" (
  "id" varchar PRIMARY KEY,
  "full_name" varchar,
  "email" varchar unique ,
  "password" varchar,
  "user_name" varchar unique ,
  "dob" date,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "posts" (
  "id" varchar PRIMARY KEY,
  "title" varchar,
  "content" varchar,
  "category" varchar,
  "user_id" varchar,
  "active" boolean,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "comments" (
  "id" varchar PRIMARY KEY,
  "content" varchar,
  "created_at" timestamp,
  "updated_at" timestamp,
  "post_id" varchar,
  "user_id" varchar
);


ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE;

ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;


ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT NOW();
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT NOW();
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "posts" ALTER COLUMN "created_at" SET DEFAULT NOW();
ALTER TABLE "posts" ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE "posts" ALTER COLUMN "updated_at" SET DEFAULT NOW();
ALTER TABLE "posts" ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "comments" ALTER COLUMN "created_at" SET DEFAULT NOW();
ALTER TABLE "comments" ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE "comments" ALTER COLUMN "updated_at" SET DEFAULT NOW();
ALTER TABLE "comments" ALTER COLUMN "updated_at" SET NOT NULL;
