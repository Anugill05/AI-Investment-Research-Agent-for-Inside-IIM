-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "researches" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "ticker" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "recommendation" TEXT,
    "confidenceScore" INTEGER,
    "errorMessage" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "researches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_reports" (
    "id" TEXT NOT NULL,
    "researchId" TEXT NOT NULL,
    "companyOverview" TEXT NOT NULL,
    "financialHealth" TEXT NOT NULL,
    "revenueAnalysis" TEXT NOT NULL,
    "profitabilityAnalysis" TEXT NOT NULL,
    "valuationSummary" TEXT NOT NULL,
    "newsSummary" TEXT NOT NULL,
    "marketSentiment" TEXT NOT NULL,
    "riskAnalysis" TEXT NOT NULL,
    "opportunities" TEXT NOT NULL,
    "finalRecommendation" TEXT NOT NULL,
    "aiReasoning" TEXT NOT NULL,
    "rawFinancialData" JSONB,
    "rawNewsData" JSONB,
    "sentimentData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "researches_userId_idx" ON "researches"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "research_reports_researchId_key" ON "research_reports"("researchId");

-- AddForeignKey
ALTER TABLE "researches" ADD CONSTRAINT "researches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_reports" ADD CONSTRAINT "research_reports_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "researches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
