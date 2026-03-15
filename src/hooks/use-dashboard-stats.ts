import type { SheetRow } from "../types";

const scoreColumns = [
  "1. หน่วยงานท่านปฏิบัติงานมีบัญชีรายการยาที่ต้องเฝ้าระวังสูง ( High-Alert Medication: HAM)  ",
  "2. หน่วยงานท่านปฏิบัติงานมีการแยกเก็บยา HAM ถูกเก็บในตู้/ลิ้นชักเฉพาะ มีป้ายเตือน “ยาที่ต้องเฝ้าระวังสูง” หรือป้ายสัญลักษณ์สี ชัดเจน",
  "3.หน่วยงานท่านมีการจำกัดการเข้าถึง การเบิก/เปิดตู้ยา HAM จำกัดเฉพาะบุคลากรตามนโยบาย เช่น พยาบาลวิชาชีพ",
  "4.การตรวจสต็อกประจำเวร (ตรวจชนิดยา ความแรง ปริมาณคงเหลือ และวันหมดอายุถูกต้อง ครบถ้วน)",
  "5.ความครบถ้วน ถูกต้องของคำสั่งยา (คำสั่งยาทุกใบมีชื่อยา ความแรง ขนาดยา route ความถี่ อัตราหยด/เวลาให้ และไม่มีคำสั่งกำกวม เช่น “ตามเดิม”)",
  "6.การใช้แบบฟอร์ม/แนวทางมาตรฐาน (การใช้ order set/protocol สำหรับยาเฉพาะ เช่น insulin infusion, heparin, opioids ทาง PCA ตามนโยบายโรงพยาบาล)",
  "7.การเตรียมยา (การเตรียมยาเป็นไปตามมาตรฐาน ความเข้มข้นมาตรฐาน ตัวทำละลายที่กำหนด การติดฉลากชื่อผู้ป่วย/ยา/ความแรง/เวลาเตรียม)",
  "8.การตรวจสอบซ้ำ\n   8.1รายการกลุ่มยา\n   8.2 มีลายมือชื่อผู้เตรียม/ให้ยา \n   8.3 มีลายมือชื่อผู้ตรวจสอบซ้ำ\n ",
  "9.การประเมินก่อนให้ยา (มีการประเมิน vital signs สภาพทั่วไป และข้อบ่งชี้/ข้อห้ามของยาอย่างเหมาะสม)",
  "10.การติดตามหลังให้ยา ( มีการติดตาม vital signs, ระดับความรู้สึกตัว, pain score และ/หรือผลตรวจทางห้องปฏิบัติการที่จำเป็น (เช่น INR, aPTT, glucose, K+, LFT, Renal function)",
  "11.หากหน่วยงานท่านเกิด เหตุการณ์ไม่พึงประสงค์/ เกือบพลาด มีการบันทึก ตามแบบฟอร์มและรายงาน ความสู่ระบบอย่างถูกต้อง และครบถ้วน",
  "12.หัวหน้าเวรมีการกำกับติดตามในการบริหารการตรวจสอบการบันทึกการจัดการยาที่ต้องเฝ้าระวังสูง ",
  "13.หัวหน้าเวรให้ feedback/คำแนะนำเพิ่มเติมแก่บุคลากรเมื่อพบข้อบกพร่องในการให้ยา HAD",
  "14. การประสานงาน (ประสานกับแพทย์/เภสัชกร/หน่วยงานอื่นเกี่ยวกับปัญหา HAM ในเวรนี้)",
] as const;

export type QuestionAverage = {
  questionNumber: number;
  questionLabel: string;
  averageValue: number;
};

type PositionCategory = "senior" | "professional" | "operational" | "registered";
type GenderCategory = "female" | "male";

export const positionGenderSeries = [
  { key: "seniorFemale", label: "ชำนาญการพิเศษ | หญิง", position: "senior", gender: "female" },
  { key: "seniorMale", label: "ชำนาญการพิเศษ | ชาย", position: "senior", gender: "male" },
  { key: "professionalFemale", label: "ชำนาญการ | หญิง", position: "professional", gender: "female" },
  { key: "professionalMale", label: "ชำนาญการ | ชาย", position: "professional", gender: "male" },
  { key: "operationalFemale", label: "ปฏิบัติการ | หญิง", position: "operational", gender: "female" },
  { key: "operationalMale", label: "ปฏิบัติการ | ชาย", position: "operational", gender: "male" },
  { key: "registeredFemale", label: "พยาบาลวิชาชีพ | หญิง", position: "registered", gender: "female" },
  { key: "registeredMale", label: "พยาบาลวิชาชีพ | ชาย", position: "registered", gender: "male" },
] as const;

type PositionGenderSeriesKey = (typeof positionGenderSeries)[number]["key"];

export type PositionGenderQuestionAverage = {
  questionNumber: number;
  questionLabel: string;
} & Record<PositionGenderSeriesKey, number>;

type DashboardStats = {
  averageScore: string;
  discrepancyCount: number;
  fullComplianceCount: number;
  discrepancyPercent: string;
  fullCompliancePercent: string;
  averageAge: string;
  bachelorCount: number;
  masterCount: number;
  doctoralCount: number;
  seniorProfessionalCount: number;
  professionalCount: number;
  operationalCount: number;
  registeredNurseCount: number;
  questionAverages: QuestionAverage[];
  positionGenderQuestionAverages: PositionGenderQuestionAverage[];
};

export function useDashboardStats(data: SheetRow[]): DashboardStats {
  const normalizeText = (value: unknown) =>
    value?.toString().trim().toLowerCase() ?? "";

  const normalizePosition = (value: unknown) =>
    value?.toString().replace(/\s+/g, " ").trim().toLowerCase() ?? "";

  const getPositionCategory = (position: string): PositionCategory | null => {
    if (position.includes("ชำนาญการพิเศษ")) {
      return "senior";
    }

    if (position.includes("ชำนาญการ")) {
      return "professional";
    }

    if (position.includes("ปฏิบัติการ")) {
      return "operational";
    }

    if (position.includes("พยาบาลวิชาชีพ")) {
      return "registered";
    }

    return null;
  };

  const getGenderCategory = (gender: string): GenderCategory | null => {
    if (gender.includes("หญิง") || gender.includes("female")) {
      return "female";
    }

    if (gender.includes("ชาย") || gender.includes("male")) {
      return "male";
    }

    return null;
  };

  const ageValues = data
    .map((row) => Number(row["ปัจจุบันท่านมีอายุ เท่าใด"]))
    .filter((age) => Number.isFinite(age));

  const averageAge =
    ageValues.length > 0
      ? (
          ageValues.reduce((sum, age) => sum + age, 0) / ageValues.length
        ).toFixed(1)
      : "0.0";

  const bachelorCount = data.filter((row) =>
    normalizeText(row["วุฒิการศึกษาสูงสุดที่ท่านได้รับคือ"]).includes(
      "ปริญญาตรี",
    ),
  ).length;

  const masterCount = data.filter((row) =>
    normalizeText(row["วุฒิการศึกษาสูงสุดที่ท่านได้รับคือ"]).includes(
      "ปริญญาโท",
    ),
  ).length;

  const doctoralCount = data.filter((row) =>
    normalizeText(row["วุฒิการศึกษาสูงสุดที่ท่านได้รับคือ"]).includes(
      "ปริญญาเอก",
    ),
  ).length;

  const positionCounts = data.reduce(
    (counts, row) => {
      const position = normalizePosition(row["ปัจจุบันท่านดำรงตำแหน่งระดับใด"]);

      if (position.includes("ชำนาญการพิเศษ")) {
        counts.seniorProfessionalCount += 1;
      } else if (position.includes("ชำนาญการ")) {
        counts.professionalCount += 1;
      } else if (position.includes("ปฏิบัติการ")) {
        counts.operationalCount += 1;
      } else if (position.includes("พยาบาลวิชาชีพ")) {
        counts.registeredNurseCount += 1;
      }

      return counts;
    },
    {
      seniorProfessionalCount: 0,
      professionalCount: 0,
      operationalCount: 0,
      registeredNurseCount: 0,
    },
  );

  const {
    seniorProfessionalCount,
    professionalCount,
    operationalCount,
    registeredNurseCount,
  } = positionCounts;

  const questionNumbers = Array.from({ length: scoreColumns.length }, (_, index) => index + 1);

  const sampleRow = data[0] as Record<string, unknown> | undefined;

  const scoreColumnKeys = questionNumbers.map((questionNumber) => {
    const defaultKey = scoreColumns[questionNumber - 1];

    if (!sampleRow) {
      return defaultKey;
    }

    if (Object.prototype.hasOwnProperty.call(sampleRow, defaultKey)) {
      return defaultKey;
    }

    const questionKeyPattern = new RegExp(`^\\s*${questionNumber}\\s*\\.`);
    const fallbackKey = Object.keys(sampleRow).find((key) => questionKeyPattern.test(key));

    return fallbackKey ?? defaultKey;
  });

  const totalScore = data.reduce((sum, row) => {
    const rowRecord = row as unknown as Record<string, unknown>;

    const rowScore = scoreColumnKeys.reduce((rowSum, key) => {
      const raw = rowRecord[key];
      const normalized = raw?.toString().trim() ?? "";

      if (!normalized) {
        return rowSum;
      }

      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? rowSum + parsed : rowSum;
    }, 0);

    return sum + rowScore;
  }, 0);

  const totalScoreItems = data.reduce((count, row) => {
    const rowRecord = row as unknown as Record<string, unknown>;

    const rowCount = scoreColumnKeys.reduce((rowTotal, key) => {
      const normalized = rowRecord[key]?.toString().trim() ?? "";
      return normalized ? rowTotal + 1 : rowTotal;
    }, 0);

    return count + rowCount;
  }, 0);

  const averageScore =
    totalScoreItems > 0 ? (totalScore / totalScoreItems).toFixed(2) : "0.00";

  const questionAverages = scoreColumnKeys.map((column, index) => {
    const values = data
      .map((row) => Number((row as unknown as Record<string, unknown>)[column]))
      .filter((value) => Number.isFinite(value));

    const averageValue =
      values.length > 0
        ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2))
        : 0;

    return {
      questionNumber: index + 1,
      questionLabel: column,
      averageValue,
    };
  });

  const positionGenderQuestionAverages: PositionGenderQuestionAverage[] = scoreColumnKeys.map((column, index) => {
    const initialSeriesValues = positionGenderSeries.reduce(
      (acc, series) => ({
        ...acc,
        [series.key]: 0,
      }),
      {} as Record<PositionGenderSeriesKey, number>,
    );

    const rowBuckets = positionGenderSeries.reduce(
      (acc, series) => ({
        ...acc,
        [series.key]: [] as number[],
      }),
      {} as Record<PositionGenderSeriesKey, number[]>,
    );

    data.forEach((row) => {
      const rowRecord = row as unknown as Record<string, unknown>;
      const position = normalizePosition(rowRecord["ปัจจุบันท่านดำรงตำแหน่งระดับใด"]);
      const gender = normalizeText(rowRecord["เพศ"]);
      const positionCategory = getPositionCategory(position);
      const genderCategory = getGenderCategory(gender);

      if (!positionCategory || !genderCategory) {
        return;
      }

      const matchedSeries = positionGenderSeries.find(
        (series) => series.position === positionCategory && series.gender === genderCategory,
      );

      if (!matchedSeries) {
        return;
      }

      const parsedValue = Number(rowRecord[column]);

      if (!Number.isFinite(parsedValue)) {
        return;
      }

      rowBuckets[matchedSeries.key].push(parsedValue);
    });

    const averagedSeriesValues = positionGenderSeries.reduce(
      (acc, series) => {
        const values = rowBuckets[series.key];
        const average =
          values.length > 0
            ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2))
            : 0;

        acc[series.key] = average;
        return acc;
      },
      initialSeriesValues,
    );

    return {
      questionNumber: index + 1,
      questionLabel: column,
      ...averagedSeriesValues,
    };
  });

  const discrepancyCount = data.filter(
    (row) => row["พบความคลาดเคลื่อน"]?.toString().trim() === "พบ",
  ).length;

  const fullComplianceCount = data.filter(
    (row) =>
      row["การปฏิบัติตามแนวทางการจัดการยาที่ต้องเฝ้าระวังสูง"]
        ?.toString()
        .trim() === "ปฏิบัติตามแนวทางครบถ้วน",
  ).length;

  const discrepancyPercent =
    data.length > 0 ? ((discrepancyCount / data.length) * 100).toFixed(0) : "0";

  const fullCompliancePercent =
    data.length > 0
      ? ((fullComplianceCount / data.length) * 100).toFixed(0)
      : "0";

  return {
    averageScore,
    discrepancyCount,
    fullComplianceCount,
    discrepancyPercent,
    fullCompliancePercent,
    averageAge,
    bachelorCount,
    masterCount,
    doctoralCount,
    seniorProfessionalCount,
    professionalCount,
    operationalCount,
    registeredNurseCount,
    questionAverages,
    positionGenderQuestionAverages,
  };
}
