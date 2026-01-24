import { AttributeName } from './character';

export type SkillType = 'parent' | 'individual' | 'knowledge';

export interface SkillDefinition {
  name: string;
  type: SkillType;
  attribute: AttributeName;
  costMultiplier: number; // 2.5 for parent, 1 for individual, 0.5 for knowledge
  category?: string; // For organizing skills in UI (e.g., "Athletics", "Survival")
}

export interface SkillWithRank extends SkillDefinition {
  rank: number;
}
