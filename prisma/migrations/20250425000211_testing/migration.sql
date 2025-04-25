-- CreateTable
CREATE TABLE "hexagram_relations" (
    "hexagram_id" INTEGER NOT NULL,
    "inverted_id" INTEGER,
    "opposite_id" INTEGER,
    "mutual_id" INTEGER,

    CONSTRAINT "hexagram_relations_pkey" PRIMARY KEY ("hexagram_id")
);

-- CreateTable
CREATE TABLE "hexagrams" (
    "id" SERIAL NOT NULL,
    "hexagram_name" TEXT NOT NULL,
    "hexagram_sequence" TEXT NOT NULL,
    "upper_trigram" TEXT,
    "lower_trigram" TEXT,

    CONSTRAINT "hexagrams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "text_hexagram_links" (
    "id" SERIAL NOT NULL,
    "text_id" INTEGER NOT NULL,
    "hexagram_id" INTEGER NOT NULL,

    CONSTRAINT "text_hexagram_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "text_yao_links" (
    "id" SERIAL NOT NULL,
    "text_id" INTEGER NOT NULL,
    "yao_id" INTEGER NOT NULL,

    CONSTRAINT "text_yao_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "texts" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "section" TEXT,
    "content" TEXT NOT NULL,

    CONSTRAINT "texts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trigrams" (
    "id" SERIAL NOT NULL,
    "hexagram_name" TEXT NOT NULL,
    "hexagram_sequence" TEXT NOT NULL,

    CONSTRAINT "trigrams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yaos" (
    "id" SERIAL NOT NULL,
    "hexagram_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "label" TEXT,

    CONSTRAINT "yaos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trigrams_hexagram_sequence_key" ON "trigrams"("hexagram_sequence");

-- AddForeignKey
ALTER TABLE "hexagram_relations" ADD CONSTRAINT "hexagram_relations_hexagram_id_fkey" FOREIGN KEY ("hexagram_id") REFERENCES "hexagrams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hexagram_relations" ADD CONSTRAINT "hexagram_relations_inverted_id_fkey" FOREIGN KEY ("inverted_id") REFERENCES "hexagrams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hexagram_relations" ADD CONSTRAINT "hexagram_relations_mutual_id_fkey" FOREIGN KEY ("mutual_id") REFERENCES "hexagrams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hexagram_relations" ADD CONSTRAINT "hexagram_relations_opposite_id_fkey" FOREIGN KEY ("opposite_id") REFERENCES "hexagrams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "text_hexagram_links" ADD CONSTRAINT "text_hexagram_links_hexagram_id_fkey" FOREIGN KEY ("hexagram_id") REFERENCES "hexagrams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "text_hexagram_links" ADD CONSTRAINT "text_hexagram_links_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "texts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "text_yao_links" ADD CONSTRAINT "text_yao_links_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "texts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "text_yao_links" ADD CONSTRAINT "text_yao_links_yao_id_fkey" FOREIGN KEY ("yao_id") REFERENCES "yaos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "yaos" ADD CONSTRAINT "yaos_hexagram_id_fkey" FOREIGN KEY ("hexagram_id") REFERENCES "hexagrams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
