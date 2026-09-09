"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProgressIndicator, useLocale } from "@/components";
import {
  IntakeFormData,
  Sex,
  Diet,
  Goal,
  ExerciseFrequency,
  ExerciseIntensity,
  SleepQuality,
  DigestiveIssue,
  CaffeineIntake,
  SunExposure,
  SkinType,
  JobType,
  JobStress,
  MedicalCondition,
} from "@/types";
import { getAllSupplements } from "@/lib/recommendation-engine";
import { getT } from "@/lib/i18n";
import { SUPPLEMENT_IT } from "@/lib/supplement-i18n";

const TOTAL_STEPS = 10;

const GOAL_VALUES: Goal[] = ["energy", "sleep", "focus", "immunity", "stress", "longevity", "muscle", "skin"];
const DIET_VALUES: Diet[] = ["omnivore", "carnivore", "pescatarian", "vegetarian", "vegan", "keto", "paleo"];
const SEX_VALUES: Sex[] = ["male", "female"];
const EXERCISE_FREQUENCY_VALUES: ExerciseFrequency[] = ["sedentary", "light", "moderate", "intense"];
const EXERCISE_INTENSITY_VALUES: ExerciseIntensity[] = ["cardio", "strength", "mobility"];
const SLEEP_QUALITY_VALUES: SleepQuality[] = ["poor", "fair", "good", "excellent"];
const DIGESTIVE_ISSUE_VALUES: DigestiveIssue[] = [
  "bloating", "constipation", "diarrhea", "nausea", "stomach-cramps",
  "gerd", "ibs", "ibd", "lactose-intolerance", "gluten-sensitivity", "poor-absorption", "none",
];
const CAFFEINE_INTAKE_VALUES: CaffeineIntake[] = ["low", "moderate", "high"];
const SUN_EXPOSURE_VALUES: SunExposure[] = ["low", "moderate", "high"];
const JOB_TYPE_VALUES: JobType[] = ["desk", "physical", "hybrid"];
const JOB_STRESS_VALUES: JobStress[] = ["low", "moderate", "high"];
const MEDICAL_CONDITION_VALUES: MedicalCondition[] = [
  "hypertension", "diabetes", "heart-disease", "thyroid", "autoimmune",
  "osteoporosis", "anxiety-depression", "anaemia", "pcos", "insomnia",
  "kidney-disease", "ibd-crohns", "pregnancy", "none",
];
const SKIN_TYPE_VALUES: SkinType[] = ["normal", "dry", "oily", "mixed", "sensitive", "aged"];
const ALLERGY_VALUES = ["dairy", "gluten", "eggs", "nuts", "soy", "fish", "shellfish", "sesame", "corn", "legumes", "sulphites", "gelatin"];
const SLEEP_HOUR_VALUES = ["4", "6", "7", "9"];

export default function IntakePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = getT(locale);
  const ti = t.intake;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IntakeFormData>({
    age: "",
    sex: "",
    height: "",
    weight: "",
    diet: "",
    goals: [],
    currentSupplements: [],
    exerciseFrequency: "",
    exerciseIntensity: [],
    sleepHours: "",
    sleepQuality: "",
    stressLevel: "",
    digestiveIssues: [],
    caffeineIntake: "",
    sunExposure: "",
    skinType: "",
    smokes: "",
    jobType: "",
    jobStress: "",
    medications: "",
    allergies: [],
    medicalConditions: [],
  });
  const [errors, setErrors] = useState<string[]>([]);

  const supplements = getAllSupplements();

  const validateCurrentStep = (): boolean => {
    const newErrors: string[] = [];

    if (currentStep === 1) {
      const age = parseInt(formData.age);
      if (!formData.age || isNaN(age) || age < 18 || age > 120) {
        newErrors.push(ti.errors.age);
      }
      if (!formData.sex) {
        newErrors.push(ti.errors.sex);
      }
      const height = parseInt(formData.height);
      if (!formData.height || isNaN(height) || height < 120 || height > 250) {
        newErrors.push(ti.errors.height);
      }
      const weight = parseInt(formData.weight);
      if (!formData.weight || isNaN(weight) || weight < 30 || weight > 300) {
        newErrors.push(ti.errors.weight);
      }
    } else if (currentStep === 2) {
      if (!formData.diet) {
        newErrors.push(ti.errors.diet);
      }
    } else if (currentStep === 3) {
      if (!formData.caffeineIntake) {
        newErrors.push(ti.errors.caffeine);
      }
    } else if (currentStep === 4) {
      if (formData.goals.length === 0) {
        newErrors.push(ti.errors.goals);
      }
    } else if (currentStep === 6) {
      if (!formData.exerciseFrequency) {
        newErrors.push(ti.errors.exerciseFrequency);
      }
      if (formData.exerciseIntensity.length === 0) {
        newErrors.push(ti.errors.exerciseIntensity);
      }
    } else if (currentStep === 7) {
      if (!formData.jobType) {
        newErrors.push(ti.errors.jobType);
      }
      if (!formData.jobStress) {
        newErrors.push(ti.errors.jobStress);
      }
    } else if (currentStep === 8) {
      if (!formData.sleepHours) {
        newErrors.push(ti.errors.sleepHours);
      }
      if (!formData.sleepQuality) {
        newErrors.push(ti.errors.sleepQuality);
      }
    } else if (currentStep === 9) {
      if (!formData.skinType) {
        newErrors.push(ti.errors.skinType);
      }
      if (!formData.smokes) {
        newErrors.push(ti.errors.smoking);
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors([]);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      const profileData = {
        age: parseInt(formData.age),
        sex: formData.sex,
        heightCm: parseInt(formData.height),
        weightKg: parseInt(formData.weight),
        diet: formData.diet,
        goals: formData.goals,
        currentSupplements: formData.currentSupplements,
        exerciseFrequency: formData.exerciseFrequency,
        exerciseIntensity: formData.exerciseIntensity.length > 0 ? formData.exerciseIntensity : undefined,
        sleepHours: parseInt(formData.sleepHours),
        sleepQuality: formData.sleepQuality,
        stressLevel: formData.stressLevel,
        digestiveIssues: formData.digestiveIssues.length > 0 ? formData.digestiveIssues : ["none"],
        caffeineIntake: formData.caffeineIntake,
        sunExposure: formData.sunExposure,
        skinType: formData.skinType || undefined,
        smokes: formData.smokes === "yes",
        jobType: formData.jobType,
        jobStress: formData.jobStress,
        medications: formData.medications.trim() || "None",
        allergies: formData.allergies,
        medicalConditions: formData.medicalConditions.length > 0 ? formData.medicalConditions : ["none"],
      };
      sessionStorage.setItem("intakeProfile", JSON.stringify(profileData));
      router.push("/results");
    }
  };

  const toggleGoal = (goal: Goal) => {
    setFormData((prev) => {
      if (prev.goals.includes(goal)) {
        return { ...prev, goals: prev.goals.filter((g) => g !== goal) };
      }
      if (prev.goals.length >= 2) return prev;
      return { ...prev, goals: [...prev.goals, goal] };
    });
  };

  const toggleSupplement = (slug: string) => {
    setFormData((prev) => ({
      ...prev,
      currentSupplements: prev.currentSupplements.includes(slug)
        ? prev.currentSupplements.filter((s) => s !== slug)
        : [...prev.currentSupplements, slug],
    }));
  };

  const toggleExerciseIntensity = (intensity: ExerciseIntensity) => {
    setFormData((prev) => {
      if (prev.exerciseIntensity.includes(intensity)) {
        return { ...prev, exerciseIntensity: prev.exerciseIntensity.filter((i) => i !== intensity) };
      }
      if (prev.exerciseIntensity.length >= 3) return prev;
      return { ...prev, exerciseIntensity: [...prev.exerciseIntensity, intensity] };
    });
  };

  const toggleDigestiveIssue = (issue: DigestiveIssue) => {
    setFormData((prev) => {
      if (issue === "none") {
        return { ...prev, digestiveIssues: prev.digestiveIssues.includes("none") ? [] : ["none"] };
      }
      const without = prev.digestiveIssues.filter((i) => i !== "none" && i !== issue);
      return {
        ...prev,
        digestiveIssues: prev.digestiveIssues.includes(issue) ? without : [...without, issue],
      };
    });
  };

  const toggleAllergy = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy],
    }));
  };

  const toggleMedicalCondition = (condition: MedicalCondition) => {
    setFormData((prev) => {
      if (condition === "none") {
        return { ...prev, medicalConditions: prev.medicalConditions.includes("none") ? [] : ["none"] };
      }
      const without = prev.medicalConditions.filter((c) => c !== "none" && c !== condition);
      return {
        ...prev,
        medicalConditions: prev.medicalConditions.includes(condition) ? without : [...without, condition],
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#FCFCF7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-xs tracking-widest uppercase text-[#9C8B78] hover:text-[#2E1B12] transition-colors">
            {ti.backHome}
          </Link>
        </div>

        <div className="bg-white border border-[#2E1B12]/10 p-8 md:p-12">
          <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-3">{ti.tagline}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2E1B12] mb-2">
            {ti.title}
          </h1>
          <p className="text-[#9C8B78] mb-8">{ti.subtitle}</p>

          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            stepLabels={ti.stepLabels}
          />

          {errors.length > 0 && (
            <div className="mb-6 p-4 border border-[#2E1B12]/20 bg-[#FCFCF7]">
              <ul className="text-sm text-[#2E1B12] space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step 1: Basics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-[#2E1B12] mb-2">
                  {ti.steps.basics.ageLabel}
                </label>
                <input
                  type="number"
                  id="age"
                  min="18"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 border border-[#2E1B12]/20 bg-white text-[#2E1B12] focus:outline-none focus:border-[#2E1B12] text-lg transition-colors"
                  placeholder={ti.steps.basics.agePlaceholder}
                />
                <p className="mt-1 text-sm text-[#9C8B78]">{ti.steps.basics.ageHint}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-[#2E1B12] mb-2">
                    {ti.steps.basics.heightLabel}
                  </label>
                  <input
                    type="number"
                    id="height"
                    min="120"
                    max="250"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-4 py-3 border border-[#2E1B12]/20 bg-white text-[#2E1B12] focus:outline-none focus:border-[#2E1B12] text-lg transition-colors"
                    placeholder={ti.steps.basics.heightPlaceholder}
                  />
                  <p className="mt-1 text-sm text-[#9C8B78]">{ti.steps.basics.heightHint}</p>
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-[#2E1B12] mb-2">
                    {ti.steps.basics.weightLabel}
                  </label>
                  <input
                    type="number"
                    id="weight"
                    min="30"
                    max="300"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-3 border border-[#2E1B12]/20 bg-white text-[#2E1B12] focus:outline-none focus:border-[#2E1B12] text-lg transition-colors"
                    placeholder={ti.steps.basics.weightPlaceholder}
                  />
                  <p className="mt-1 text-sm text-[#9C8B78]">{ti.steps.basics.weightHint}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-2">
                  {ti.steps.basics.sexLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SEX_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, sex: value })}
                      className={`px-4 py-3 border text-center text-sm transition-colors ${
                        formData.sex === value
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      {ti.sexes[value]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Diet */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.diet.dietLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DIET_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, diet: value })}
                      className={`px-3 py-2 border text-left transition-colors ${
                        formData.diet === value
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      <span className="font-medium text-sm block">{ti.diets[value].label}</span>
                      <span className={`text-xs mt-0.5 block leading-tight ${formData.diet === value ? "text-white/70" : "text-[#9C8B78]"}`}>
                        {ti.diets[value].desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.diet.allergyLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALLERGY_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleAllergy(value)}
                      className={`px-3 py-2 border text-left text-sm transition-colors ${
                        formData.allergies.includes(value)
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      {ti.allergies[value as keyof typeof ti.allergies]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Digestion & Caffeine */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.digestion.digestiveLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DIGESTIVE_ISSUE_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleDigestiveIssue(value)}
                      className={`px-4 py-3 border text-left transition-colors ${
                        formData.digestiveIssues.includes(value)
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      <span className="font-medium text-sm">{ti.digestiveIssues[value]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.digestion.caffeineLabel}
                </label>
                <div className="space-y-2">
                  {CAFFEINE_INTAKE_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, caffeineIntake: value })}
                      className={`w-full px-4 py-3 border text-left transition-colors ${
                        formData.caffeineIntake === value
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      <span className="font-medium text-sm">{ti.caffeineIntakes[value]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {currentStep === 4 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-[#2E1B12]">
                  {ti.steps.goals.label}
                </label>
                <span className="text-xs text-[#9C8B78]">{formData.goals.length}/2</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GOAL_VALUES.map((value) => {
                  const selected = formData.goals.includes(value);
                  const maxed = formData.goals.length >= 2 && !selected;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleGoal(value)}
                      disabled={maxed}
                      className={`px-4 py-3 border text-left transition-colors ${
                        selected
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : maxed
                          ? "border-[#2E1B12]/10 bg-white text-[#2E1B12]/30 cursor-not-allowed"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      <span className="font-medium text-sm block">{ti.goals[value].label}</span>
                      <p className={`text-xs mt-0.5 ${selected ? "text-white/70" : "text-[#9C8B78]"}`}>
                        {ti.goals[value].desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Current Supplements */}
          {currentStep === 5 && (
            <div>
              <label className="block text-sm font-medium text-[#2E1B12] mb-2">
                {ti.steps.supplements.label}
              </label>
              <p className="text-sm text-[#9C8B78] mb-4">
                {ti.steps.supplements.hint}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {supplements.map((supplement) => (
                  <button
                    key={supplement.slug}
                    type="button"
                    onClick={() => toggleSupplement(supplement.slug)}
                    className={`px-3 py-2 border text-left text-sm transition-colors ${
                      formData.currentSupplements.includes(supplement.slug)
                        ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                        : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                    }`}
                  >
                    {locale === "it"
                      ? SUPPLEMENT_IT[supplement.slug]?.name ?? supplement.name
                      : supplement.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Exercise */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.exercise.frequencyLabel}
                </label>
                <div className="space-y-2">
                  {EXERCISE_FREQUENCY_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, exerciseFrequency: value })}
                      className={`w-full px-4 py-3 border text-left transition-colors ${
                        formData.exerciseFrequency === value
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      <span className="font-medium text-sm">{ti.exerciseFrequencies[value]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#2E1B12]">
                    {ti.steps.exercise.typeLabel}
                  </label>
                </div>
                <div className="space-y-2">
                  {EXERCISE_INTENSITY_VALUES.map((value) => {
                    const selected = formData.exerciseIntensity.includes(value);
                    const maxed = formData.exerciseIntensity.length >= 3 && !selected;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleExerciseIntensity(value)}
                        disabled={maxed}
                        className={`w-full px-4 py-3 border text-left transition-colors ${
                          selected
                            ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                            : maxed
                            ? "border-[#2E1B12]/10 bg-white text-[#2E1B12]/30 cursor-not-allowed"
                            : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                        }`}
                      >
                        <span className="font-medium text-sm block">{ti.exerciseTypes[value].label}</span>
                        <span className={`text-xs mt-0.5 block ${selected ? "text-white/70" : "text-[#9C8B78]"}`}>
                          {ti.exerciseTypes[value].desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Lifestyle */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.lifestyle.jobTypeLabel}
                </label>
                <div className="space-y-2">
                  {JOB_TYPE_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, jobType: value })}
                      className={`w-full px-4 py-3 border text-left transition-colors ${
                        formData.jobType === value
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      <span className="font-medium text-sm">{ti.jobTypes[value]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.lifestyle.jobStressLabel}
                </label>
                <div className="space-y-2">
                  {JOB_STRESS_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, jobStress: value })}
                      className={`w-full px-4 py-3 border text-left transition-colors ${
                        formData.jobStress === value
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      <span className="font-medium text-sm">{ti.jobStresses[value]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Sleep & Stress */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.sleep.hoursLabel}
                </label>
                <div className="space-y-2">
                  {SLEEP_HOUR_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, sleepHours: value })}
                      className={`w-full px-4 py-3 border text-left text-sm transition-colors ${
                        formData.sleepHours === value
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      {ti.sleepHours[value]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.sleep.qualityLabel}
                </label>
                <div className="space-y-2">
                  {SLEEP_QUALITY_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, sleepQuality: value })}
                      className={`w-full px-4 py-3 border text-left transition-colors ${
                        formData.sleepQuality === value
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      <span className="font-medium text-sm">{ti.sleepQualities[value]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 9: Skin */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.skin.typeLabel}
                </label>
                <div className="space-y-2">
                  {SKIN_TYPE_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, skinType: value })}
                      className={`w-full px-4 py-3 border text-left transition-colors ${
                        formData.skinType === value
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      <span className="font-medium text-sm block">{ti.skinTypes[value].label}</span>
                      <span className={`text-xs mt-0.5 block ${formData.skinType === value ? "text-white/70" : "text-[#9C8B78]"}`}>
                        {ti.skinTypes[value].desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.skin.sunLabel}
                </label>
                <div className="space-y-2">
                  {SUN_EXPOSURE_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, sunExposure: value })}
                      className={`w-full px-4 py-3 border text-left transition-colors ${
                        formData.sunExposure === value
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      <span className="font-medium text-sm">{ti.sunExposures[value]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.skin.smokeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["yes", "no"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, smokes: value })}
                      className={`px-4 py-3 border text-center text-sm transition-colors ${
                        formData.smokes === value
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      }`}
                    >
                      {value === "yes" ? ti.steps.skin.smokeYes : ti.steps.skin.smokeNo}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 10: Health & Safety */}
          {currentStep === 10 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="medications" className="block text-sm font-medium text-[#2E1B12] mb-2">
                  {ti.steps.health.medicationsLabel}
                </label>
                <textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  className="w-full px-4 py-3 border border-[#2E1B12]/20 bg-white text-[#2E1B12] focus:outline-none focus:border-[#2E1B12] transition-colors"
                  placeholder={ti.steps.health.medicationsPlaceholder}
                  rows={3}
                />
                <p className="mt-1 text-sm text-[#9C8B78]">
                  {ti.steps.health.medicationsHint}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E1B12] mb-3">
                  {ti.steps.health.conditionsLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MEDICAL_CONDITION_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleMedicalCondition(value)}
                      className={`px-3 py-2 border text-left text-sm transition-colors ${
                        formData.medicalConditions.includes(value)
                          ? "border-[#2E1B12] bg-[#2E1B12] text-white"
                          : "border-[#2E1B12]/20 bg-white text-[#2E1B12] hover:border-[#2E1B12]"
                      } ${value === "none" ? "col-span-2" : ""}`}
                    >
                      {ti.medicalConditions[value]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-[#2E1B12]/10">
            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-full flex items-center justify-between px-8 py-4 bg-[#FFB326] text-[#2E1B12] rounded-full font-medium hover:bg-[#e6a020] transition-colors"
              >
                <span>{ti.continue}</span>
                <span>→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full flex items-center justify-between px-8 py-4 bg-[#FFB326] text-[#2E1B12] rounded-full font-medium hover:bg-[#e6a020] transition-colors"
              >
                <span>{ti.getMyPlan}</span>
                <span>→</span>
              </button>
            )}
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="w-full mt-3 py-2 text-sm text-[#9C8B78] hover:text-[#2E1B12] transition-colors text-center"
              >
                {ti.back}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
