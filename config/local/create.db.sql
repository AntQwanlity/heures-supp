-- -------------------------------------------------------------
-- TablePlus 4.5.2(402)
--
-- https://tableplus.com/
--
-- Database: postgres
-- Generation Time: 2022-03-01 08:59:47.2170
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."box";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."box" (
    "uuid" uuid NOT NULL,
    "name" varchar NOT NULL,
    "description" varchar NOT NULL,
    "created_at" timestamptz NOT NULL,
    "updated_at" timestamptz NOT NULL,
    "owner_uuid" uuid NOT NULL,
    PRIMARY KEY ("uuid")
);

DROP TABLE IF EXISTS "public"."box_invite";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."box_invite" (
    "uuid" uuid NOT NULL,
    "box_uuid" uuid NOT NULL,
    "invited_email" varchar NOT NULL,
    "created_at" timestamptz NOT NULL,
    "updated_at" timestamptz NOT NULL,
    PRIMARY KEY ("uuid")
);

DROP TABLE IF EXISTS "public"."box_participant";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."box_participant" (
    "box_uuid" uuid NOT NULL,
    "participant_uuid" uuid NOT NULL,
    "created_at" timestamptz NOT NULL,
    "updated_at" timestamptz NOT NULL,
    "deleted_at" timestamptz,
    PRIMARY KEY ("box_uuid","participant_uuid")
);

DROP TABLE IF EXISTS "public"."firebase_user";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."firebase_user" (
    "user_uuid" uuid NOT NULL,
    "firebase_id" varchar NOT NULL,
    PRIMARY KEY ("user_uuid","firebase_id")
);

DROP TABLE IF EXISTS "public"."idea";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."idea" (
    "uuid" uuid NOT NULL,
    "name" varchar NOT NULL,
    "description" varchar NOT NULL,
    "author_uuid" uuid NOT NULL,
    "created_at" timestamptz NOT NULL,
    "updated_at" timestamptz NOT NULL,
    "box_uuid" uuid NOT NULL,
    "deleted_at" timestamptz,
    PRIMARY KEY ("uuid")
);

DROP TABLE IF EXISTS "public"."idea_comment";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."idea_comment" (
    "uuid" uuid NOT NULL,
    "idea_uuid" uuid NOT NULL,
    "author_uuid" uuid NOT NULL,
    "content" varchar NOT NULL,
    "created_at" timestamptz NOT NULL,
    "updated_at" timestamptz NOT NULL,
    PRIMARY KEY ("uuid")
);

DROP TABLE IF EXISTS "public"."idea_vote";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."idea_vote" (
    "idea_uuid" uuid NOT NULL,
    "user_uuid" uuid NOT NULL,
    "vote_type" varchar NOT NULL,
    "created_at" timestamptz NOT NULL,
    "updated_at" timestamptz NOT NULL,
    PRIMARY KEY ("idea_uuid","user_uuid")
);

DROP TABLE IF EXISTS "public"."user";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."user" (
    "uuid" uuid NOT NULL,
    "username" varchar NOT NULL,
    "image_url" varchar NOT NULL,
    "firstname" varchar,
    "lastname" varchar,
    "created_at" timestamptz NOT NULL,
    "updated_at" timestamptz NOT NULL,
    "email" varchar,
    PRIMARY KEY ("uuid")
);

ALTER TABLE "public"."box" ADD FOREIGN KEY ("owner_uuid") REFERENCES "public"."user"("uuid") ON UPDATE CASCADE;
ALTER TABLE "public"."box_invite" ADD FOREIGN KEY ("box_uuid") REFERENCES "public"."box"("uuid") ON UPDATE CASCADE;
ALTER TABLE "public"."box_participant" ADD FOREIGN KEY ("participant_uuid") REFERENCES "public"."user"("uuid") ON UPDATE CASCADE;
ALTER TABLE "public"."box_participant" ADD FOREIGN KEY ("box_uuid") REFERENCES "public"."box"("uuid") ON UPDATE CASCADE;
ALTER TABLE "public"."firebase_user" ADD FOREIGN KEY ("user_uuid") REFERENCES "public"."user"("uuid") ON UPDATE CASCADE;
ALTER TABLE "public"."idea" ADD FOREIGN KEY ("box_uuid") REFERENCES "public"."box"("uuid") ON UPDATE CASCADE;
ALTER TABLE "public"."idea" ADD FOREIGN KEY ("author_uuid") REFERENCES "public"."user"("uuid") ON UPDATE CASCADE;
ALTER TABLE "public"."idea_comment" ADD FOREIGN KEY ("idea_uuid") REFERENCES "public"."idea"("uuid") ON UPDATE CASCADE;
ALTER TABLE "public"."idea_comment" ADD FOREIGN KEY ("author_uuid") REFERENCES "public"."user"("uuid") ON UPDATE CASCADE;
