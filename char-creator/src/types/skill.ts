import { AttributeName } from './character';

export type SkillType = 'parent' | 'individual';

export interface SkillDefinition {
  name: string;
  type: SkillType;
  attribute: AttributeName;
  costMultiplier: number; // 2.5 for parent, 1 for individual
  category?: string; // For organizing skills in UI (e.g., "Athletics", "Survival")
  parentGroup?: string; // Links child skill to parent group name (e.g., "ATHLETICS")
}

export interface SkillWithRank extends SkillDefinition {
  rank: number;
}
